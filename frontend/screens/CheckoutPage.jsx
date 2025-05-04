import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackBtn from "../components/BackBtn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseUrl from "../assets/common/baseUrl";
import axios from "axios";
import { UserLocationContext } from "../contexts/UserLocationContext";
import { UserReversedGeoCode } from "../contexts/UserReversedGeoCode";
import Button from "../components/Button";
import GoogleApiServices from "../hook/GoogleApiServices";
import Toast from "react-native-toast-message";
import Loader from "../components/Loader";
import {
  attachPaymentMethod,
  createPaymentIntent,
  createPaymentMethod,
} from "../hook/paymongoService";
import DeliveryAddress from "../components/Checkout/DeliveryAddress";
import DeliveryOptions from "../components/Checkout/DeliveryOptions";
import PersonalDetails from "../components/Checkout/PersonalDetails";
import PaymentMethod from "../components/Checkout/PaymentMethod";
import OrderSummary from "../components/Checkout/OrderSummary";
import AddressBottomModal from "../components/Checkout/AddressBottomModal";
import PickupLocation from "../components/Checkout/PickupLocation";
import { COLORS, SIZES } from "../styles/theme";
import Divider from "../components/Divider";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import SpecialRemarks from "../components/Checkout/SpecialRemarks";
import PaymentDetails from "../components/Checkout/PaymentDetails";

const CheckoutPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { cart, user } = route.params;
  const [username, setUsername] = useState(user?.username);
  const [email, setEmail] = useState(user?.email);
  const [phone, setPhone] = useState(user?.phone);
  const [image, setImage] = useState(user?.profile?.url);
  const [supplier, setSupplier] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const { address, setAddress } = useContext(UserReversedGeoCode);
  const { location, setLocation } = useContext(UserLocationContext);
  const [showAddresses, setShowAddresses] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedAddressLat, setSelectedAddressLat] = useState(null);
  const [selectedAddressLng, setSelectedAddressLng] = useState(null);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [distanceTime, setDistanceTime] = useState({});
  const [deliveryFee, setDeliveryFee] = useState(
    selectedDeliveryOption === "standard" ? distanceTime.finalPrice : 0
  );
  const [editProfile, setEditProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deliveryOptionsError, setDeliveryOptionsError] = useState(false);
  const [paymentMethodError, setPaymentMethodError] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [region, setRegion] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      if ((selectedAddressLat && selectedAddressLng) || location?.coords) {
        setRegion({
          latitude:
            selectedAddressLat === null
              ? location?.coords?.latitude
              : selectedAddressLat,
          longitude:
            selectedAddressLng === null
              ? location?.coords?.longitude
              : selectedAddressLng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    }, [location?.coords, selectedAddressLat, selectedAddressLng])
  );

  useEffect(() => {
    if (restaurant?.delivery === true || supplier?.delivery === true) {
      setSelectedDeliveryOption("standard");
      setSelectedPaymentMethod(null);
    } else {
      setSelectedDeliveryOption("pickup");
      setSelectedPaymentMethod("gcash");
    }
  }, [restaurant, supplier]);

  const getUserAddresses = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };

        const response = await axios.get(
          `${baseUrl}/api/users/address/list`,
          config
        );
        setAddresses(response.data.addresses);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRestaurant = async () => {
    if (cart?.cartItems.length > 0) {
      const restaurantId = cart?.cartItems[0].foodId.restaurant;
      try {
        const response = await axios.get(
          `${baseUrl}/api/restaurant/byId/${restaurantId}`
        );
        setRestaurant(response.data.data);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    }
  };

  const fetchSupplier = async () => {
    try {
      if (cart?.cartItems.length > 0) {
        const supplierId = cart?.cartItems[0].productId.supplier;
        try {
          const response = await axios.get(
            `${baseUrl}/api/supplier/byId/${supplierId}`
          );
          setSupplier(response.data.data);
        } catch (error) {
          console.error("Error fetching supplier data:", error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const reverseGeoCode = async (latitude, longitude) => {
    const reverseGeoCodedAddress = await Location.reverseGeocodeAsync({
      longitude: longitude,
      latitude: latitude,
    });
    setAddress(reverseGeoCodedAddress[0]);
  };

  const handleSubmitForm = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();
      if (image.startsWith("file://")) {
        const filename = image.split("/").pop();
        const fileType = filename.split(".").pop();
        formData.append("profile", {
          uri: image,
          name: filename,
          type: `image/${fileType}`,
        });
      }

      formData.append("username", username);
      formData.append("email", email);
      formData.append("phone", phone);

      await axios.put(`${baseUrl}/api/users/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });
      Toast.show({
        type: "success",
        text1: "Success ✅",
        text2: "Profile updated successfully",
      });
      setEditProfile(false);
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error ❌",
        text2: "Profile update failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    if (selectedDeliveryOption === null && selectedPaymentMethod === null) {
      setDeliveryOptionsError(true);
      setPaymentMethodError(true);
      setLoading(false);
    } else if (selectedDeliveryOption === null) {
      setDeliveryOptionsError(true);
      setLoading(false);
    } else if (selectedPaymentMethod === null) {
      setPaymentMethodError(true);
      setLoading(false);
    } else if (selectedPaymentMethod === "gcash") {
      try {
        const amount =
          parseFloat(cart?.totalAmount.toFixed(2)) + parseFloat(deliveryFee);
        const paymentIntent = await createPaymentIntent(amount);
        const paymentMethodResponse = await createPaymentMethod(
          phone,
          email,
          username
        );

        const data = {
          restaurant: restaurant?._id,
          supplier: supplier?._id,
          orderItems: cart?.cartItems,
          deliveryOption: selectedDeliveryOption,
          deliveryAddress:
            selectedDeliveryOption === "standard" && selectedAddress === null
              ? {
                  address: address.formattedAddress,
                  coordinates: {
                    latitude: location?.coords?.latitude,
                    longitude: location?.coords?.longitude,
                  },
                }
              : {
                  address: selectedAddress,
                  coordinates: {
                    latitude: selectedAddressLat,
                    longitude: selectedAddressLng,
                  },
                },
          subTotal: cart?.totalAmount.toFixed(2),
          deliveryFee,
          totalAmount: amount.toFixed(2),
          paymentMethod: selectedPaymentMethod,
          paymentStatus: "Paid",
          orderStatus: "Pending",
          orderNote,
        };
        const payment = await attachPaymentMethod(
          paymentIntent.data.id,
          paymentMethodResponse.data.id
        );

        if (payment.data.attributes.next_action.redirect.url) {
          Linking.openURL(payment.data.attributes.next_action.redirect.url);
          navigation.navigate("payment-confirmation", {
            payment,
            data,
            user,
          });
        }
      } catch (error) {
        console.log("Error processing payment:", error.message);
        setLoading(false);
      }
    } else {
      try {
        const token = await AsyncStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };

        const data = {
          paymentId: "No online payment",
          restaurant: restaurant?._id,
          supplier: supplier?._id,
          orderItems: cart?.cartItems,
          deliveryOption: selectedDeliveryOption,
          deliveryAddress:
            selectedDeliveryOption === "standard" && selectedAddress === null
              ? {
                  address: address.formattedAddress,
                  coordinates: {
                    latitude: location?.coords?.latitude,
                    longitude: location?.coords?.longitude,
                  },
                }
              : {
                  address: selectedAddress,
                  coordinates: {
                    latitude: selectedAddressLat,
                    longitude: selectedAddressLng,
                  },
                },
          subTotal: cart?.totalAmount.toFixed(2),
          deliveryFee,
          totalAmount:
            parseFloat(cart?.totalAmount.toFixed(2)) + parseFloat(deliveryFee),
          paymentMethod: selectedPaymentMethod,
          paymentStatus: "Pending",
          orderStatus: "Pending",
          orderNote,
        };

        const response = await axios.post(
          `${baseUrl}/api/orders/check-out`,
          data,
          config
        );
        if (response.status === 200) {
          navigation.navigate("order-page");
          Toast.show({
            type: "success",
            text1: "Payment Successful ✅",
            text2: "Your order has been placed.",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Error ❌",
            text2: "Failed to place order",
          });
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error ❌",
          text2: error.message,
        });
        console.log(error.message);
        setLoading(false);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getUserAddresses();
      {
        user.userType === "Vendor" ? fetchSupplier() : fetchRestaurant();
      }
    }, [cart, user])
  );

  useEffect(() => {
    if (location !== null) {
      reverseGeoCode(location?.coords?.latitude, location?.coords?.longitude);
    }
  }, [location]);

  useEffect(() => {
    setLoading(true);
    const origin =
      user?.userType === "Vendor" ? supplier?.coords : restaurant?.coords;
    const userOriginLat =
      selectedAddressLat === null
        ? location?.coords?.latitude
        : selectedAddressLat;
    const userOriginLng =
      selectedAddressLng === null
        ? location?.coords?.longitude
        : selectedAddressLng;
    GoogleApiServices.calculateDistanceAndTime(
      origin?.latitude,
      origin?.longitude,
      userOriginLat,
      userOriginLng
    ).then((result) => {
      if (result) {
        setDistanceTime(result);
        setLoading(false);
      }
    });
  }, [supplier, restaurant, selectedAddress]);

  const totalTime =
    distanceTime.duration +
    GoogleApiServices.extractNumbers(
      user.userType === "Vendor" ? supplier?.time : restaurant?.time
    )[0];

  const isUserDetailsChanged = () => {
    return (
      username !== user?.username ||
      email !== user?.email ||
      phone !== user?.phone ||
      image !== user?.profile?.url
    );
  };

  return (
    <SafeAreaView>
      {loading ? (
        <Loader />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginHorizontal: 20, marginTop: 15 }}
        >
          <BackBtn onPress={() => navigation.goBack()} />
          <Text
            style={{
              fontFamily: "bold",
              fontSize: 24,
              textAlign: "center",
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            Check Out
          </Text>

          {selectedDeliveryOption === "pickup" ? (
            <PickupLocation restaurant={restaurant} supplier={supplier} />
          ) : (
            <DeliveryAddress
              region={region}
              selectedAddress={selectedAddress}
              address={address}
              orderNote={orderNote}
              setShowAddresses={setShowAddresses}
            />
          )}

          <OrderSummary
            selectedDeliveryOption={selectedDeliveryOption}
            distanceTime={distanceTime}
            deliveryFee={deliveryFee}
            restaurant={restaurant}
            supplier={supplier}
            user={user}
            cart={cart}
          />

          <SpecialRemarks orderNote={orderNote} setOrderNote={setOrderNote} />

          {(restaurant?.delivery === true || supplier?.delivery === true) && (
            <DeliveryOptions
              deliveryOptionsError={deliveryOptionsError}
              setDeliveryFee={setDeliveryFee}
              selectedDeliveryOption={selectedDeliveryOption}
              setSelectedDeliveryOption={setSelectedDeliveryOption}
              restaurant={restaurant}
              supplier={supplier}
              totalTime={totalTime}
              distanceTime={distanceTime}
              setDeliveryOptionsError={setDeliveryOptionsError}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
            />
          )}

          <PersonalDetails
            isUserDetailsChanged={isUserDetailsChanged}
            editProfile={editProfile}
            setEditProfile={setEditProfile}
            setUsername={setUsername}
            setEmail={setEmail}
            setPhone={setPhone}
            setImage={setImage}
            username={username}
            email={email}
            phone={phone}
            image={image}
            loading={loading}
            handleSubmitForm={handleSubmitForm}
          />

          {selectedDeliveryOption === "pickup" ? (
            <View
              style={{
                marginBottom: 20,
              }}
            >
              <Text style={{ fontFamily: "bold", fontSize: 18 }}>
                Payment Method:
              </Text>
              <Divider />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Image
                  source={require("../assets/images/gcash.png")}
                  style={{ width: 27, height: 22, marginLeft: 2.5 }}
                />
                <Text
                  style={{
                    fontFamily: "medium",
                    fontSize: 16,
                    marginLeft: 10,
                    color: COLORS.black,
                  }}
                >
                  GCash
                </Text>
              </View>
            </View>
          ) : (
            <PaymentMethod
              setPaymentMethodError={setPaymentMethodError}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
              paymentMethodError={paymentMethodError}
              selectedPaymentMethod={selectedPaymentMethod}
              selectedDeliveryOption={selectedDeliveryOption}
            />
          )}

          <PaymentDetails
            cart={cart}
            selectedDeliveryOption={selectedDeliveryOption}
            distanceTime={distanceTime}
            deliveryFee={deliveryFee}
          />

          {/* <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: "regular",
                fontSize: 14,
                color: COLORS.gray,
              }}
            >
              Subtotal:
            </Text>
            <Text
              style={{
                fontFamily: "regular",
                fontSize: 14,
                color: COLORS.gray,
              }}
            >
              ₱ {cart?.totalAmount.toFixed(2)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: "regular",
                fontSize: 14,
                color: COLORS.gray,
              }}
            >
              Delivery Fee:
            </Text>
            <Text
              style={{
                fontFamily: "regular",
                fontSize: 14,
                color: COLORS.gray,
              }}
            >
              ₱{" "}
              {selectedDeliveryOption === "standard"
                ? distanceTime.finalPrice
                : 0}
            </Text>
          </View>
          <Divider />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontFamily: "bold", fontSize: 24 }}>Total:</Text>
            <Text style={{ fontFamily: "bold", fontSize: 24 }}>
              ₱{" "}
              {(
                parseFloat(cart?.totalAmount.toFixed(2)) +
                parseFloat(deliveryFee)
              ).toFixed(2)}
            </Text>
          </View> */}

          <Button
            title="P L A C E   O R D E R"
            onPress={handlePlaceOrder}
            isValid={true}
            loader={loading}
          />
        </ScrollView>
      )}

      <AddressBottomModal
        showAddresses={showAddresses}
        addresses={addresses}
        selectedAddress={selectedAddress}
        setShowAddresses={setShowAddresses}
        setSelectedAddress={setSelectedAddress}
        selectedAddressLat={selectedAddressLat}
        setSelectedAddressLat={setSelectedAddressLat}
        selectedAddressLng={selectedAddressLng}
        setSelectedAddressLng={setSelectedAddressLng}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

export default CheckoutPage;

const styles = StyleSheet.create({});

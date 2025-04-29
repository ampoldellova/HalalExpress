import {
  FlatList,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
import { SIZES, COLORS } from "../styles/theme";
import MapView, { Marker } from "react-native-maps";
import { UserLocationContext } from "../contexts/UserLocationContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { UserReversedGeoCode } from "../contexts/UserReversedGeoCode";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BottomModal, ModalContent, SlideAnimation } from "react-native-modals";
import Button from "../components/Button";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import GoogleApiServices from "../hook/GoogleApiServices";
import Toast from "react-native-toast-message";
import Divider from "../components/Divider";
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
      setPaymentMethodError(true);
      setDeliveryOptionsError(true);
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
          restaurant:
            user?.userType === "Vendor" ? supplier?._id : restaurant?._id,
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
          navigation.navigate("payment-confirmation", { payment, data, user });
        }
      } catch (error) {
        console.error("Error processing payment:", error);
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
          restaurant:
            user?.userType === "Vendor" ? supplier?._id : restaurant?._id,
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

        const endpoint =
          user?.userType === "Vendor"
            ? `${baseUrl}/api/vendor/orders/check-out`
            : `${baseUrl}/api/orders/check-out`;

        const response = await axios.post(endpoint, data, config);
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
          text2: error,
        });
        console.error(error);
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
          <Text style={styles.heading}>Check Out</Text>

          <DeliveryAddress
            region={region}
            selectedAddress={selectedAddress}
            address={address}
            orderNote={orderNote}
            setShowAddresses={setShowAddresses}
          />

          <DeliveryOptions
            deliveryOptionsError={deliveryOptionsError}
            setDeliveryFee={setDeliveryFee}
            selectedDeliveryOption={selectedDeliveryOption}
            setSelectedDeliveryOption={setSelectedDeliveryOption}
            restaurant={restaurant}
            totalTime={totalTime}
            setDeliveryOptionsError={setDeliveryOptionsError}
          />

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

          <PaymentMethod
            setPaymentMethodError={setPaymentMethodError}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            paymentMethodError={paymentMethodError}
            selectedPaymentMethod={selectedPaymentMethod}
            selectedDeliveryOption={selectedDeliveryOption}
          />

          <View
            style={{
              borderColor: COLORS.gray2,
              height: "auto",
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Text style={{ fontFamily: "bold", fontSize: 18 }}>
                Your order from:
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Image
                source={{
                  uri:
                    user?.userType === "Vendor"
                      ? supplier?.logoUrl?.url
                      : restaurant?.logoUrl?.url,
                }}
                style={{ width: 20, height: 20, borderRadius: 5 }}
              />
              <Text
                style={{ fontFamily: "regular", fontSize: 14, marginLeft: 5 }}
              >
                {user?.userType === "Vendor"
                  ? supplier?.title
                  : restaurant?.title}
              </Text>
            </View>

            <FlatList
              style={{ marginBottom: 20 }}
              data={cart?.cartItems}
              keyExtractor={(item) => item?._id}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={{
                        uri:
                          user?.userType === "Vendor"
                            ? item?.productId?.imageUrl?.url
                            : item?.foodId?.imageUrl?.url,
                      }}
                      style={{ width: 50, height: 50, borderRadius: 10 }}
                    />
                    <View style={{ flexDirection: "column", marginLeft: 10 }}>
                      <Text
                        style={{
                          fontFamily: "regular",
                          fontSize: 14,
                          color: COLORS.gray,
                        }}
                      >
                        {item?.quantity}x{" "}
                        {user?.userType === "Vendor"
                          ? item?.productId?.title
                          : item?.foodId?.title}
                      </Text>

                      {item?.productId ? (
                        <></>
                      ) : (
                        <>
                          {item?.additives.length > 0 ? (
                            <FlatList
                              data={item?.additives}
                              keyExtractor={(item) => item._id}
                              renderItem={({ item }) => (
                                <Text
                                  style={{
                                    fontFamily: "regular",
                                    fontSize: 14,
                                    color: COLORS.gray,
                                    marginLeft: 10,
                                  }}
                                >
                                  + {item?.title}
                                </Text>
                              )}
                            />
                          ) : (
                            <Text
                              style={{
                                fontFamily: "regular",
                                fontSize: 14,
                                color: COLORS.gray,
                                marginLeft: 10,
                              }}
                            >
                              - No additives
                            </Text>
                          )}
                        </>
                      )}
                    </View>
                  </View>
                  <Text
                    style={{
                      fontFamily: "regular",
                      fontSize: 14,
                      color: COLORS.gray,
                    }}
                  >
                    ₱ {item?.totalPrice.toFixed(2)}
                  </Text>
                </View>
              )}
            />

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
                marginBottom: 20,
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
            </View>
          </View>

          <Button
            title="P L A C E   O R D E R"
            onPress={handlePlaceOrder}
            isValid={true}
            loader={loading}
          />
        </ScrollView>
      )}

      <BottomModal
        visible={showAddresses}
        onTouchOutside={() => setShowAddresses(false)}
        swipeThreshold={100}
        modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
        onHardwareBackPress={() => setShowAddresses(false)}
      >
        <View
          style={{
            height: 10,
            backgroundColor: COLORS.primary,
            width: SIZES.width,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: 3,
              backgroundColor: COLORS.white,
              width: SIZES.width / 5,
              borderRadius: 10,
            }}
          />
        </View>
        <ModalContent style={{ height: SIZES.height / 2, width: "100%" }}>
          <Text style={{ fontFamily: "bold", fontSize: 20, marginBottom: 5 }}>
            {" "}
            Saved Addresses
          </Text>

          <FlatList
            data={addresses}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedAddress(
                    selectedAddress === item.address ? null : item.address
                  );
                  setSelectedAddressLat(
                    selectedAddressLat === item.latitude ? null : item.latitude
                  );
                  setSelectedAddressLng(
                    selectedAddressLng === item.longitude
                      ? null
                      : item.longitude
                  );
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 10,
                  borderColor:
                    selectedAddress === item.address
                      ? COLORS.primary
                      : COLORS.gray2,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={require("../assets/images/location.png")}
                    style={{ width: 30, height: 30, marginLeft: 5 }}
                  />
                  <View
                    style={{ flex: 1, height: 60, justifyContent: "center" }}
                  >
                    <Text
                      style={{
                        fontFamily: "regular",
                        fontSize: 14,
                        marginLeft: 10,
                        color: COLORS.gray,
                      }}
                      numberOfLines={3}
                      ellipsizeMode="tail"
                    >
                      {item.address}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("add-address-page");
              setShowAddresses(false);
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: COLORS.gray2,
              marginBottom: -15,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 10,
              }}
            >
              <MaterialIcons name="add" size={30} color={COLORS.gray2} />
              <View style={{ flex: 1, height: 50, justifyContent: "center" }}>
                <Text
                  style={{
                    fontFamily: "regular",
                    fontSize: 14,
                    marginLeft: 10,
                    color: COLORS.gray,
                  }}
                >
                  Add New Address
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </ModalContent>
      </BottomModal>
    </SafeAreaView>
  );
};

export default CheckoutPage;

const styles = StyleSheet.create({
  heading: {
    fontFamily: "bold",
    fontSize: 24,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  mapContainer: {
    width: "100%",
    height: "auto",
    borderColor: COLORS.gray2,
    borderWidth: 1,
    borderRadius: 15,
    overflow: "hidden",
  },
  label: {
    fontFamily: "regular",
    fontSize: SIZES.xSmall,
    marginBottom: 5,
    marginEnd: 5,
    textAlign: "right",
  },
  textInput: {
    flex: 1,
    fontFamily: "regular",
    marginTop: 2,
  },
  notesInputWrapper: (borderColor) => ({
    borderColor: borderColor,
    backgroundColor: COLORS.lightWhite,
    borderWidth: 1,
    height: 80,
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "flex-start",
  }),
  inputWrapper: (borderColor) => ({
    borderColor: borderColor,
    backgroundColor: COLORS.lightWhite,
    borderWidth: 1,
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
  }),
});

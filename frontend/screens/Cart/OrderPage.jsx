import {
  BackHandler,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import BackBtn from "../../components/BackBtn";
import { getProfile } from "../../hook/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import baseUrl from "../../assets/common/baseUrl";
import { COLORS, SIZES } from "../../styles/theme";
import Loader from "../../components/Loader";
import { RatingInput } from "react-native-stock-star-rating";
import Heading from "../../components/Heading";
import ActiveOrders from "../../components/Cart/ActiveOrders";
import PreviousOrders from "../../components/Cart/PreviousOrders";

const OrderPage = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [vendorOrders, setVendorOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState("Active");

  const fetchProfile = async () => {
    const profile = await getProfile();
    setUser(profile);
  };

  const fetchUserOrders = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };

        const response = await axios.get(`${baseUrl}/api/orders/`, config);
        setVendorOrders(response.data.vendorOrders);
        setOrders(response.data.orders);
        setLoading(false);
      } else {
        Toast.show({
          type: "error",
          text1: "Authentication token not found ❌",
          text2: "Please login first.",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error ❌",
        text2: error.message,
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
      fetchUserOrders();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        navigation.navigate("bottom-navigation", { screen: "ProfilePage" });
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [navigation])
  );

  const pendingOrders =
    orders?.filter(
      (order) =>
        order.orderStatus === "Pending" ||
        order.orderStatus === "Preparing" ||
        order.orderStatus === "Ready for pickup" ||
        order.orderStatus === "Out for delivery"
    ) || [];

  const pastOrders =
    orders?.filter(
      (order) =>
        order.orderStatus === "Delivered" || order.orderStatus === "Completed"
    ) || [];

  const cancelledOrders =
    orders?.filter((order) => order.orderStatus === "cancelled by customer") ||
    [];

  return (
    <View>
      {loading ? (
        <Loader />
      ) : (
        <ScrollView style={{ marginTop: 15 }}>
          <View style={{ marginHorizontal: 20 }}>
            <BackBtn
              onPress={() =>
                navigation.navigate("bottom-navigation", {
                  screen: "ProfilePage",
                })
              }
            />
            <Text style={styles.heading}>Your Orders</Text>
          </View>

          {orders.length === 0 ? (
            <>
              <View style={styles.container}>
                <Image
                  style={styles.image}
                  source={require("../../assets/images/emptyOrder.png")}
                />
                <Text style={styles.text}>
                  You havent made a single order yet. Go to home page to start
                  browsing.
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    navigation.navigate("bottom-navigation", {
                      screen: "HomePage",
                    })
                  }
                >
                  <Text style={styles.buttonText}>Browse Items</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                  justifyContent: "center",
                  marginHorizontal: 20,
                  marginBottom: 20,
                }}
              >
                <TouchableOpacity onPress={() => setOrderType("Active")}>
                  <Text
                    style={{
                      fontFamily: "regular",
                      color:
                        orderType === "Active" ? COLORS.primary : COLORS.gray,
                    }}
                  >
                    Active
                  </Text>
                </TouchableOpacity>
                <Text style={{ marginHorizontal: 10 }}>|</Text>
                <TouchableOpacity onPress={() => setOrderType("Previous")}>
                  <Text
                    style={{
                      fontFamily: "regular",
                      color:
                        orderType === "Previous" ? COLORS.primary : COLORS.gray,
                    }}
                  >
                    Previous
                  </Text>
                </TouchableOpacity>
                <Text style={{ marginHorizontal: 10 }}>|</Text>
                <TouchableOpacity onPress={() => setOrderType("Cancelled")}>
                  <Text
                    style={{
                      fontFamily: "regular",
                      color:
                        orderType === "Cancelled"
                          ? COLORS.primary
                          : COLORS.gray,
                    }}
                  >
                    Cancelled
                  </Text>
                </TouchableOpacity>
              </View>

              {orderType === "Active" && (
                <>
                  {pendingOrders.length > 0 && (
                    <>
                      <ActiveOrders
                        pendingOrders={pendingOrders}
                        navigation={navigation}
                      />
                    </>
                  )}

                  {pendingOrders.length === 0 && (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        height: SIZES.height / 1.5,
                      }}
                    >
                      <Image
                        source={require("../../assets/images/emptyOrder.png")}
                        style={{ width: 200, height: 200 }}
                      />
                      <Text style={styles.text}>
                        You have no active orders.
                      </Text>
                    </View>
                  )}
                </>
              )}

              {orderType === "Previous" && (
                <>
                  {pastOrders.length > 0 && (
                    <>
                      <PreviousOrders
                        pastOrders={pastOrders}
                        navigation={navigation}
                      />
                    </>
                  )}

                  {pastOrders.length === 0 && (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        height: SIZES.height / 1.5,
                      }}
                    >
                      <Image
                        source={require("../../assets/images/emptyOrder.png")}
                        style={{ width: 200, height: 200 }}
                      />
                      <Text style={styles.text}>
                        You have no previous orders.
                      </Text>
                    </View>
                  )}
                </>
              )}

              {orderType === "Cancelled" && (
                <>
                  {cancelledOrders.length > 0 && (
                    <>
                      <FlatList
                        data={cancelledOrders}
                        scrollEnabled={false}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate("order-details-page", {
                                order: item,
                              })
                            }
                            style={{
                              marginBottom: 10,
                              borderRadius: 15,
                              boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.1)",
                              padding: 10,
                              flexDirection: "row",
                              justifyContent: "space-between",
                              backgroundColor: COLORS.white,
                              marginHorizontal: 20,
                            }}
                          >
                            <View style={{ flexDirection: "row" }}>
                              <Image
                                source={{
                                  uri: item?.restaurant
                                    ? item?.restaurant?.logoUrl?.url
                                    : item?.supplier?.logoUrl?.url,
                                }}
                                style={{
                                  height: 70,
                                  width: 70,
                                  borderRadius: 10,
                                }}
                              />
                              <View
                                style={{
                                  marginLeft: 10,
                                  flexDirection: "column",
                                }}
                              >
                                <Text
                                  style={{ fontFamily: "bold", fontSize: 16 }}
                                >
                                  {item?.restaurant
                                    ? item?.restaurant?.title
                                    : item?.supplier?.title}
                                </Text>
                                <View>
                                  <Text
                                    style={{
                                      color: COLORS.gray,
                                      fontSize: 12,
                                      fontFamily: "regular",
                                    }}
                                  >
                                    Ordered on:
                                  </Text>
                                  <Text
                                    style={{
                                      color: COLORS.gray,
                                      fontSize: 12,
                                      fontFamily: "regular",
                                    }}
                                  >
                                    {new Date(
                                      item?.createdAt
                                    ).toLocaleDateString("en-US", {
                                      month: "long",
                                      day: "numeric",
                                    })}{" "}
                                    at{" "}
                                    {new Date(
                                      item?.createdAt
                                    ).toLocaleTimeString("en-US", {
                                      hour: "numeric",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}
                                  </Text>
                                </View>

                                <FlatList
                                  data={item?.orderItems}
                                  style={{ marginTop: 5 }}
                                  keyExtractor={(item) => item._id}
                                  renderItem={({ item }) => (
                                    <View>
                                      <Text
                                        style={{
                                          color: COLORS.gray,
                                          fontSize: 14,
                                          fontFamily: "regular",
                                        }}
                                      >
                                        x{item?.quantity}{" "}
                                        {item?.foodId
                                          ? item?.foodId?.title
                                          : item?.productId?.title}
                                      </Text>
                                    </View>
                                  )}
                                />
                              </View>
                            </View>
                            <Text style={{ fontFamily: "bold", fontSize: 16 }}>
                              ₱{(item?.totalAmount).toFixed(2)}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    </>
                  )}

                  {cancelledOrders.length === 0 && (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        height: SIZES.height / 1.5,
                      }}
                    >
                      <Image
                        source={require("../../assets/images/emptyOrder.png")}
                        style={{ width: 200, height: 200 }}
                      />
                      <Text style={styles.text}>
                        You have no cancelled orders.
                      </Text>
                    </View>
                  )}
                </>
              )}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default OrderPage;

const styles = StyleSheet.create({
  heading: {
    fontFamily: "bold",
    fontSize: 24,
    textAlign: "center",
    marginTop: 10,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: SIZES.height / 1.3,
  },
  text: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.gray,
    textAlign: "center",
    width: "70%",
    marginTop: 10,
  },
  image: {
    width: 200,
    height: 200,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 15,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontFamily: "regular",
  },
});

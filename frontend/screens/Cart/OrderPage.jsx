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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import BackBtn from "../../components/BackBtn";
import { getProfile } from "../../hook/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import baseUrl from "../../assets/common/baseUrl";
import { COLORS, SIZES } from "../../styles/theme";
import Loader from "../../components/Loader";
import ActiveOrders from "../../components/Cart/ActiveOrders";
import PreviousOrders from "../../components/Cart/PreviousOrders";
import CancelledOrders from "../../components/Cart/CancelledOrders";

const OrderPage = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState("Active");

  const fetchUserOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };

        const response = await axios.get(`${baseUrl}/api/orders/`, config);
        setOrders(response.data.orders);
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
      fetchUserOrders();
    }, [orders])
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
    orders?.filter((order) => order.orderStatus === "Cancelled by customer") ||
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
                    Completed
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
                    <ActiveOrders
                      pendingOrders={pendingOrders}
                      navigation={navigation}
                    />
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
                    <PreviousOrders
                      pastOrders={pastOrders}
                      navigation={navigation}
                    />
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
                    <CancelledOrders
                      cancelledOrders={cancelledOrders}
                      navigation={navigation}
                    />
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

import {
  BackHandler,
  FlatList,
  Image,
  SafeAreaView,
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

const OrderPage = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <SafeAreaView>
      {loading ? (
        <Loader />
      ) : (
        <View style={{ marginHorizontal: 20, marginTop: 15 }}>
          <BackBtn
            onPress={() =>
              navigation.navigate("bottom-navigation", {
                screen: "ProfilePage",
              })
            }
          />
          <Text style={styles.heading}>Your Orders</Text>
          <Text style={{ fontFamily: "bold", fontSize: 16, marginTop: 10 }}>
            Active Orders
          </Text>
          <FlatList
            data={orders}
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: SIZES.height * 0.125 }}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  marginVertical: 10,
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: COLORS.gray2,
                  padding: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: COLORS.white,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={{ uri: item?.restaurant?.logoUrl?.url }}
                    style={{
                      height: 70,
                      width: 70,
                      borderRadius: 10,
                    }}
                  />
                  <View style={{ marginLeft: 10, flexDirection: "column" }}>
                    <Text style={{ fontFamily: "bold", fontSize: 16 }}>
                      {item?.restaurant?.title}
                    </Text>
                    {item?.orderStatus === "Pending" && (
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
                          {new Date(item?.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                            }
                          )}{" "}
                          at{" "}
                          {new Date(item?.createdAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}
                        </Text>
                      </View>
                    )}

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
                            x{item?.quantity} {item?.foodId?.title}
                          </Text>
                        </View>
                      )}
                    />
                  </View>
                </View>
                <Text style={{ fontFamily: "bold", fontSize: 16 }}>
                  ₱{item?.totalAmount}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </SafeAreaView>
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
});

import {
  FlatList,
  Image,
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
import baseUrl from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, SIZES } from "../../styles/theme";
import PendingVendorOrders from "../../components/Orders/PendingVendorOrders";
import Heading from "../../components/Heading";
import Loader from "../../components/Loader";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

const ManageOrderPage = () => {
  const route = useRoute();
  const item = route.params;
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurantOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };

      const response = await fetch(
        `${baseUrl}/api/orders/restaurant/${item._id}/orders`,
        config
      );
      const data = await response.json();
      setOrders(data.orders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRestaurantOrders();
    }, [orders])
  );

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <View>
          <View style={{ marginHorizontal: 20, marginTop: 15 }}>
            <BackBtn onPress={() => navigation.goBack()} />
            <Text style={styles.heading}>Manage Orders</Text>
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 20,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.primary,
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderRadius: 5,
                marginTop: 10,
              }}
              onPress={() => {}}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <AntDesign name="checkcircleo" size={16} color={COLORS.white} />
                <Text
                  style={{
                    fontFamily: "bold",
                    color: COLORS.white,
                    textAlign: "center",
                    marginLeft: 5,
                    marginTop: 2,
                  }}
                >
                  Completed Orders
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.gray,
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderRadius: 5,
                marginTop: 10,
              }}
              onPress={() => {}}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome name="trash-o" size={16} color={COLORS.white} />
                <Text
                  style={{
                    fontFamily: "bold",
                    color: COLORS.white,
                    textAlign: "center",
                    marginLeft: 5,
                    marginTop: 2,
                  }}
                >
                  Cancelled Orders
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <FlatList
            data={orders}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <>
                {item?.orderStatus === "Pending" ? (
                  <>
                    <Heading heading={"Pending Orders"} />
                    <PendingVendorOrders item={item} />
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
            style={{
              marginTop: 10,
              marginBottom: SIZES.height / 12,
            }}
          />
        </View>
      )}
    </>
  );
};

export default ManageOrderPage;

const styles = StyleSheet.create({
  heading: {
    fontFamily: "bold",
    fontSize: 24,
    textAlign: "center",
    marginTop: 10,
  },
});

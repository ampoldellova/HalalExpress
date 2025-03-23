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
import { COLORS } from "../../styles/theme";

const OrderPage = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  const fetchProfile = async () => {
    const profile = await getProfile();
    setUser(profile);
  };

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
  console.log(orders);
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
      <View style={{ marginHorizontal: 20, marginTop: 15 }}>
        <BackBtn
          onPress={() =>
            navigation.navigate("bottom-navigation", { screen: "ProfilePage" })
          }
        />
        <Text style={styles.heading}>Your Orders</Text>
        <FlatList
          data={orders}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                marginVertical: 10,
                borderRadius: 15,
                borderWidth: 1,
                borderColor: COLORS.gray2,
                padding: 10,
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
                <Text style={{ fontFamily: "bold", fontSize: 18 }}>
                  {item?.restaurant?.title}
                </Text>
                <Text style={{ fontFamily: "bold", fontSize: 18 }}>
                  ₱{item?.totalAmount}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
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

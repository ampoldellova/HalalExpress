import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import pages from "../../styles/page.style";
import { COLORS, SIZES } from "../../styles/theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import baseUrl from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackBtn from "../../components/BackBtn";
import CartProducts from "../../components/Cart/CartProducts";
import Button from "../../components/Button";
import { getProfile } from "../../hook/helpers";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";

const CartPage = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.user);
  const [cart, setCart] = useState({});
  const [vendorCart, setVendorCart] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [vendorCartItems, setVendorCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCartItems = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };

        const endpoint =
          user?.userType === "Vendor"
            ? `${baseUrl}/api/cart/vendor/`
            : `${baseUrl}/api/cart/`;

        const response = await axios.get(endpoint, config);
        setVendorCartItems(response.data.cartItems);
        setCartItems(response.data.cartItems);
        setVendorCart(response.data.vendorCart);
        setCart(response.data.cart);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getCartItems();
    }, [cartItems, vendorCartItems])
  );

  return (
    <SafeAreaView>
      {loading ? (
        <Loader />
      ) : !user ? (
        <View style={pages.viewOne}>
          <View style={pages.viewTwo}>
            <View style={styles.container}>
              <Image
                style={styles.image}
                source={require("../../assets/images/cart.png")}
              />
              <Text style={styles.text}>
                You havent added anything to your cart yet.
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate("HomePage");
                }}
              >
                <Text style={styles.buttonText}>Browse Items</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={pages.viewOne}>
          <View style={pages.viewTwo}>
            {cartItems.length > 0 || vendorCartItems.length > 0 ? (
              <View style={{ marginHorizontal: 20, marginTop: 15 }}>
                <BackBtn onPress={() => navigation.goBack()} />
                <Text style={styles.heading}>Your Cart</Text>

                <FlatList
                  data={
                    user?.userType === "Vendor" ? vendorCartItems : cartItems
                  }
                  keyExtractor={(item) => item._id}
                  style={{ height: SIZES.height / 1.5 }}
                  renderItem={({ item }) => (
                    <CartProducts item={item} getCartItems={getCartItems} />
                  )}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "bold",
                      fontSize: 18,
                      textAlign: "center",
                      marginTop: 10,
                    }}
                  >
                    Total:
                  </Text>
                  <Text
                    style={{
                      fontFamily: "bold",
                      fontSize: 18,
                      textAlign: "center",
                      marginTop: 10,
                    }}
                  >
                    ₱ {cart.totalAmount.toFixed(2)}
                  </Text>
                </View>

                <Button
                  title="C H E C K O U T"
                  isValid={true}
                  onPress={() => {
                    navigation.navigate("checkout-page", {
                      cart,
                      vendorCart,
                      user,
                    });
                  }}
                />
              </View>
            ) : (
              <View style={styles.container}>
                <Image
                  style={styles.image}
                  source={require("../../assets/images/cart.png")}
                />
                <Text style={styles.text}>
                  You havent added anything to your cart yet.
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    navigation.navigate("HomePage");
                  }}
                >
                  <Text style={styles.buttonText}>Browse Items</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CartPage;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: SIZES.height / 1.15,
  },
  image: {
    width: 200,
    height: 200,
  },
  text: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.gray,
    textAlign: "center",
    width: "50%",
    marginTop: 10,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 15,
    marginTop: 10,
    textAlign: "center",
  },
  buttonText: {
    color: "white",
    fontFamily: "regular",
  },
  heading: {
    fontFamily: "bold",
    fontSize: 24,
    textAlign: "center",
    marginTop: 10,
  },
});

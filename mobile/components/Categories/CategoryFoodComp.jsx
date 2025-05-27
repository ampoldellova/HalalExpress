import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { COLORS, SIZES } from "../../styles/theme";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseUrl from "../../assets/common/baseUrl";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Toast from "react-native-toast-message";
import AntDesign from "@expo/vector-icons/AntDesign";
import { updateCartCount } from "../../redux/UserReducer";

const CategoryFoodComp = ({ item }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { cartCount } = useSelector((state) => state.user);

  const handleConfirmClearCart = async (cartItem, config) => {
    try {
      await axios.delete(`${baseUrl}/api/cart/clear-cart`, config);
      await axios.post(`${baseUrl}/api/cart/`, cartItem, config);
      Toast.show({
        type: "success",
        text1: "Success ✅",
        text2: "Food has been added to your cart 🛒",
      });
      dispatch(updateCartCount(1));
    } catch (error) {
      console.error("Error clearing cart or adding food:", error);
      Toast.show({
        type: "error",
        text1: "Error ❌",
        text2: "Failed to add the food to your cart.",
      });
    }
  };

  const addProductToCart = async () => {
    const cartItem = {
      foodId: item?._id,
      restaurantId: item?.restaurant?._id,
      instructions: "",
      quantity: 1,
      totalPrice: item?.price,
    };

    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };

        const response = await axios.post(
          `${baseUrl}/api/cart/`,
          cartItem,
          config
        );

        if (response.data.cartConflict) {
          Alert.alert(
            "Warning ⚠️",
            "Food from different restaurants cannot exist in the same cart. Do you want to clear your cart to add this food?",
            [
              {
                text: "Cancel",
                onPress: () => {},
                style: "cancel",
              },
              {
                text: "Confirm",
                onPress: () => handleConfirmClearCart(cartItem, config),
              },
            ]
          );
        } else {
          Toast.show({
            type: "success",
            text1: "Success ✅",
            text2: "Product has been added to your cart 🛒",
          });
          dispatch(updateCartCount(cartCount + 1));
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Error ❌",
          text2: "You need to logged in first to add food to cart",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.wrapper}
        onPress={() => navigation.navigate("food-page", item)}
      >
        <Image
          source={{ uri: item?.imageUrl?.url }}
          style={{
            width: "100%",
            height: 100,
            borderRadius: 10,
          }}
        />

        <Text
          style={{
            fontFamily: "regular",
            textAlign: "left",
            marginTop: 5,
            fontSize: 12,
            color: COLORS.gray,
          }}
        >
          {item?.category?.title}
        </Text>
        <Text
          style={{
            fontFamily: "regular",
            textAlign: "left",
            fontSize: 16,
          }}
        >
          {item?.title}
        </Text>

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
              textAlign: "left",
              fontSize: 16,
              marginTop: 5,
            }}
          >
            {`₱ ${item.price.toFixed(2)}`}
          </Text>
          <TouchableOpacity
            onPress={addProductToCart}
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: 99,
              padding: 5,
            }}
          >
            <AntDesign name="pluscircleo" size={16} color={COLORS.lightWhite} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* <ConfirmationModal
        open={confirmationModal}
        onClose={() => {
          setConfirmationModal(false);
          setUserConfirmed(false);
        }}
      /> */}
    </>
  );
};

export default CategoryFoodComp;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.lightWhite,
    width: SIZES.width / 2.3,
    height: "auto",
    marginBottom: 10,
    borderRadius: 12,
    padding: 5,
  },
});

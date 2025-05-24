import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../../styles/theme";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import baseUrl from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import { updateCartCount } from "../../redux/UserReducer";

const CategoryIngredientComp = ({ item }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { cartCount } = useSelector((state) => state.user);

  const addProductToCart = async () => {
    const cartItem = {
      productId: item?._id,
      supplierId: item?.supplier?._id,
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
        await axios.post(`${baseUrl}/api/cart/`, cartItem, config);
        Toast.show({
          type: "success",
          text1: "Success ✅",
          text2: "Product has been added to your cart 🛒",
        });
        dispatch(updateCartCount(cartCount + 1));
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
    <TouchableOpacity
      style={styles.wrapper}
      onPress={() => navigation.navigate("product-page", item)}
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
  );
};

export default CategoryIngredientComp;

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

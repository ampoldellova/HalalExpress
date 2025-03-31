import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { COLORS, SIZES } from "../../styles/theme";
import { Entypo, AntDesign } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Counter from "../../components/Cart/Counter";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseUrl from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

const FoodPage = ({ route, navigation }) => {
  const item = route.params.item;
  const [additives, setAdditives] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [count, setCount] = useState(1);
  const [preference, setPreference] = useState("");
  const dispatch = useDispatch();
  const { cartCount } = useSelector((state) => state.user);

  const handleAdditives = (newAdditives) => {
    setAdditives((prevAdditives) => {
      const exists = prevAdditives.some(
        (additives) => additives._id === newAdditives._id
      );

      if (exists) {
        return prevAdditives.filter(
          (additives) => additives._id !== newAdditives._id
        );
      } else {
        return [...prevAdditives, newAdditives];
      }
    });
  };

  useEffect(() => {
    calculatePrice();
  }, [additives]);

  const calculatePrice = () => {
    const total = additives.reduce((sum, additive) => {
      return sum + parseFloat(additive.price);
    }, 0);
    setTotalPrice(total);
  };

  const addFoodToCart = async () => {
    const cartItem = {
      foodId: item._id,
      restaurantId: item.restaurant._id,
      additives: additives,
      instructions: preference,
      quantity: count,
      totalPrice: (item.price + totalPrice) * count,
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
        navigation.goBack();
        Toast.show({
          type: "success",
          text1: "Success ✅",
          text2: "Food has been added to your cart 🛒",
        });
        dispatch(updateCartCount(cartCount + 1));
      } else {
        navigation.goBack();
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

  const total = (item.price + totalPrice) * count;

  return (
    <ScrollView
      style={{ backgroundColor: COLORS.offwhite, height: SIZES.height }}
    >
      <View>
        <Image
          source={{ uri: item.imageUrl.url }}
          style={{
            width: SIZES.width,
            height: SIZES.height / 3.4,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
          }}
        />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backbtn}
        >
          <Entypo name="chevron-small-left" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.title, { width: 250 }]}>{item.title}</Text>
          <Text style={styles.title}>
            ₱ {total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}
          </Text>
        </View>

        <Text style={styles.small}>{item.description}</Text>

        <FlatList
          data={item.foodTags}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          style={{ marginTop: 10 }}
          horizontal
          scrollEnabled
          renderItem={({ item }) => (
            <View style={styles.tags}>
              <Text style={{ paddingHorizontal: 4, color: COLORS.lightWhite }}>
                {item}
              </Text>
            </View>
          )}
        />

        <Text style={[styles.title, { marginBottom: 10, marginTop: 20 }]}>
          {" "}
          Additives and Toppings
        </Text>

        <FlatList
          data={item.additives}
          keyExtractor={(item) => item.id}
          style={{ marginTop: 10 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <BouncyCheckbox
                  size={20}
                  unfillColor="#FFFFFF"
                  fillColor={COLORS.primary}
                  innerIconStyle={{ borderWidth: 1 }}
                  onPress={() => {
                    handleAdditives(item);
                  }}
                />
                <Text style={styles.small}>{item.title}</Text>
              </View>
              <Text style={[styles.small]}>₱ {item.price}</Text>
            </View>
          )}
        />

        <Text style={[styles.title, { marginBottom: 10, marginTop: 20 }]}>
          Preferences
        </Text>
        <View style={styles.input}>
          <TextInput
            placeholder="Add specific instructions"
            value={preference}
            onChangeText={(value) => setPreference(value)}
            autoCapitalize={false}
            autoCorrect={false}
            style={{ flex: 1, fontFamily: "regular", color: COLORS.black }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <Text style={[styles.title, { marginBottom: 10 }]}>Quantity</Text>
          <Counter count={count} setCount={setCount} />
        </View>
      </View>

      <View style={{ alignItems: "center", width: "100%", marginVertical: 10 }}>
        <View style={styles.suspended}>
          <View style={styles.cart}>
            <View style={styles.cartRow}>
              <TouchableOpacity onPress={addFoodToCart} style={styles.cartBtn}>
                <AntDesign
                  name="pluscircleo"
                  size={24}
                  color={COLORS.lightWhite}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("bottom-navigation", {
                    screen: "CartPage",
                  })
                }
                style={{
                  backgroundColor: COLORS.primary,
                  paddingHorizontal: 60,
                  borderRadius: 30,
                }}
              >
                <Text
                  style={[
                    styles.title,
                    {
                      color: COLORS.lightWhite,
                      marginTop: 5,
                      alignItems: "center",
                    },
                  ]}
                >
                  View Cart
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {}} style={styles.cartBtn}>
                <Text
                  style={[
                    styles.title,
                    {
                      color: COLORS.lightWhite,
                      marginTop: 5,
                      alignItems: "center",
                    },
                  ]}
                >
                  {0}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default FoodPage;

const styles = StyleSheet.create({
  backbtn: {
    marginLeft: 12,
    alignItems: "center",
    zIndex: 999,
    position: "absolute",
    top: SIZES.large,
    backgroundColor: COLORS.primary,
    borderRadius: 99,
  },
  btnText: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.white,
  },
  restbtn: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  container: {
    marginHorizontal: 12,
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: "medium",
    color: COLORS.black,
  },
  small: {
    fontSize: 13,
    fontFamily: "regular",
    color: COLORS.gray,
    textAlign: "left",
  },
  tags: {
    right: 10,
    marginHorizontal: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    padding: 5,
  },
  input: {
    borderColor: COLORS.primary1,
    borderWidth: 1,
    backgroundColor: COLORS.offwhite,
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    flexDirection: "row",
  },
  suspended: {
    width: "100%",
    alignItems: "center",
  },
  cart: {
    width: SIZES.width - 24,
    height: 60,
    justifyContent: "center",
    backgroundColor: COLORS.primary1,
    borderRadius: 30,
  },
  cartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 12,
  },
  cartBtn: {
    width: 40,
    height: 40,
    borderRadius: 99,
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
});

import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext, useRef, useState } from "react";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import CategoryFoodComp from "../../components/Categories/CategoryFoodComp";
import axios from "axios";
import baseUrl from "../../assets/common/baseUrl";
import ClosedWindow from "../../components/Vendor/ClosedWindow";
import LottieView from "lottie-react-native";
import { SIZES, COLORS } from "../../styles/theme";

const Menu = () => {
  const route = useRoute();
  const [foods, setFoods] = useState([]);
  const item = route.params;
  const [loading, setLoading] = useState(false);
  const animation = useRef(null);

  const fetchRestaurantFoods = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${baseUrl}/api/foods/restaurant/${item._id}`,
        {}
      );
      setFoods(response.data);
      setLoading(false);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Unable to toggle availability."
      );
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRestaurantFoods();
    }, [])
  );

  return (
    <View style={{ marginBottom: 80 }}>
      {loading && (
        <View
          style={{
            width: SIZES.width,
            height: SIZES.height / 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LottieView
            autoPlay
            ref={animation}
            style={{ width: "20%", height: "20%" }}
            source={require("../../assets/anime/loading.json")}
          />
          <Text
            style={{
              fontFamily: "regular",
              color: COLORS.gray,
              position: "absolute",
              bottom: 120,
            }}
          >
            Loading...
          </Text>
        </View>
      )}

      {!loading && (
        <>
          {item.isAvailable ? (
            <FlatList
              key={2}
              numColumns={2}
              data={foods}
              showsVerticalScrollIndicator={false}
              style={{ marginTop: 5 }}
              scrollEnabled
              keyExtractor={(item) => item._id}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginHorizontal: 10,
              }}
              renderItem={({ item }) => (
                <View key={item._id} style={{ flex: 1, alignItems: "center" }}>
                  <CategoryFoodComp item={item} />
                </View>
              )}
            />
          ) : (
            <ClosedWindow />
          )}
        </>
      )}
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({});

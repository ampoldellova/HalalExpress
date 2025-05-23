import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import axios from "axios";
import baseUrl from "../../assets/common/baseUrl";
import CategoryIngredientComp from "../../components/Categories/CategoryIngredientComp";
import LottieView from "lottie-react-native";
import { COLORS, SIZES } from "../../styles/theme";

const Products = () => {
  const route = useRoute();
  const item = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const animation = useRef(null);

  const fetchSupplierProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${baseUrl}/api/ingredients/supplier/${item._id}`
      );
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchSupplierProducts();
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
              data={products}
              key={2}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              style={{ marginTop: 5 }}
              scrollEnabled
              keyExtractor={(item) => item._id}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginHorizontal: 10,
              }}
              renderItem={({ item }) => (
                <View style={{ flex: 1, alignItems: "center" }}>
                  <CategoryIngredientComp item={item} />
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

export default Products;

const styles = StyleSheet.create({});

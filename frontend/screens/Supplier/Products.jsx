import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import axios from "axios";
import baseUrl from "../../assets/common/baseUrl";
import CategoryIngredientComp from "../../components/Categories/CategoryIngredientComp";

const Products = () => {
  const route = useRoute();
  const item = route.params;
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);

  const fetchSupplierProducts = async () => {
    try {
      const response = await axios.patch(
        `${baseUrl}/api/ingredients/supplier/${item._id}`
      );
      setProducts(response.data);
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
    <View style={{ marginTop: 5, marginBottom: 80 }}>
      {item.isAvailable ? (
        <FlatList
          data={products}
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 5 }}
          scrollEnabled
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={{ alignItems: "center" }}>
              <CategoryIngredientComp
                item={item}
                onPress={() => navigation.navigate("product-navigator", item)}
              />
            </View>
          )}
        />
      ) : (
        <ClosedWindow />
      )}
    </View>
  );
};

export default Products;

const styles = StyleSheet.create({});

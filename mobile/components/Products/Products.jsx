import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import ProductComponent from "./ProductComponent";

const Products = ({ ingredients }) => {
  const navigation = useNavigation();

  return (
    <View style={{ marginLeft: 12, marginBottom: 10 }}>
      <FlatList
        data={ingredients}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 5, rowGap: 10 }}
        scrollEnabled
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ProductComponent
            key={item._id}
            item={item}
            onPress={() => navigation.navigate("product-page", item)}
          />
        )}
      />
    </View>
  );
};

export default Products;

const styles = StyleSheet.create({});

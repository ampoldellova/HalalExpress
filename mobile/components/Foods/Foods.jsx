import { View, FlatList } from "react-native";
import React from "react";
import FoodComponent from "./FoodComponent";

const Foods = ({ foods }) => {
  return (
    <View style={{ marginLeft: 12, marginBottom: 10 }}>
      <FlatList
        data={foods}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 5, rowGap: 10 }}
        scrollEnabled
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <FoodComponent key={item._id} item={item} />}
      />
    </View>
  );
};

export default Foods;

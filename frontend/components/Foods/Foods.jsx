import { View, FlatList } from "react-native";
import React, { useState } from "react";
import FoodComponent from "./FoodComponent";
import { useNavigation } from "@react-navigation/native";

const Foods = ({ foods }) => {
  const navigation = useNavigation();
  const [visibleFoods, setVisibleFoods] = useState(foods.slice(0, 3));
  const [currentIndex, setCurrentIndex] = useState(3);

  const loadMoreFoods = () => {
    if (currentIndex < foods.length) {
      const nextIndex = Math.min(currentIndex + 3, foods.length);
      setVisibleFoods((prevFoods) => [
        ...prevFoods,
        ...foods.slice(currentIndex, nextIndex),
      ]);
      setCurrentIndex(nextIndex);
    }
  };

  return (
    <View style={{ marginLeft: 12, marginBottom: 10 }}>
      <FlatList
        data={visibleFoods}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 5 }}
        scrollEnabled
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <FoodComponent
            item={item}
            onPress={() => navigation.navigate("food-navigator", item)}
          />
        )}
        onEndReached={loadMoreFoods}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default Foods;

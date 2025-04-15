import { FlatList, StyleSheet, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import RestaurantStoreComponent from "./RestaurantStoreComponent";

const UserRestaurants = ({ restaurants }) => {
  const navigation = useNavigation();

  return (
    <View style={{ marginLeft: 12 }}>
      <FlatList
        data={restaurants}
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 5, rowGap: 10 }}
        scrollEnabled
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <RestaurantStoreComponent
            item={item}
            onPress={() => {
              navigation.navigate("user-restaurant-page", item);
            }}
          />
        )}
      />
    </View>
  );
};

export default UserRestaurants;

const styles = StyleSheet.create({});

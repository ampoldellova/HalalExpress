import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import baseUrl from "../../assets/common/baseUrl";
import axios from "axios";

const Reviews = ({ item }) => {
  const navigation = useNavigation();
  const [reviews, setReviews] = useState([]);

  const fetchRestaurantReviews = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/orders/restaurant/${item._id}/reviews`
      );

      const data = await response.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRestaurantReviews();
    }, [])
  );

  return (
    <ScrollView>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View
            style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.userId.username}</Text>
            <Text>{item.rating.stars}</Text>
            <Text>{item.rating.feedback}</Text>
            <Text style={{ color: "#888" }}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </ScrollView>
  );
};

export default Reviews;

const styles = StyleSheet.create({});

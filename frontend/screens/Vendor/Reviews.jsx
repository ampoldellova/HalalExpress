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

  console.log(reviews);
  useFocusEffect(
    React.useCallback(() => {
      fetchRestaurantReviews();
    }, [])
  );

  return <ScrollView></ScrollView>;
};

export default Reviews;

const styles = StyleSheet.create({});

import { FlatList, StyleSheet, View } from "react-native";
import React, { useRef, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseUrl from "../../assets/common/baseUrl";
import axios from "axios";
import RestaurantStoreComponent from "./RestaurantStoreComponent";
import LottieView from "lottie-react-native";
import { SIZES } from "../../styles/theme";

const UserRestaurants = ({ user }) => {
  const navigation = useNavigation();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const animation = useRef(null);

  const getRestaurantsByOwner = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };

        const response = await axios.get(
          `${baseUrl}/api/restaurant/owner/${user?._id}`,
          config
        );
        setRestaurants(response.data.data);
        setLoading(false);
      } else {
        console.log("Authentication token not found");
      }
    } catch (err) {
      console.error("Error fetching user restaurants:", err);
      setError(err.message || "Failed to fetch restaurants.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getRestaurantsByOwner();
    }, [])
  );

  return (
    <View style={{ marginLeft: 12 }}>
      {loading ? (
        <View
          style={{
            width: SIZES.width,
            height: SIZES.height / 2,
            justifyContent: "center",
            alignItems: "center",
            top: 0,
          }}
        >
          <LottieView
            autoPlay
            ref={animation}
            style={{ width: "50%", height: "50%" }}
            source={require("../../assets/anime/loading.json")}
          />
        </View>
      ) : (
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
      )}
    </View>
  );
};

export default UserRestaurants;

const styles = StyleSheet.create({});

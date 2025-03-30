import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import BackBtn from "../../components/BackBtn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseUrl from "../../assets/common/baseUrl";
import Loader from "../../components/Loader";
import ManageFoodCard from "../../components/Foods/ManageFoodCard";
import { SafeAreaView } from "react-native-safe-area-context";

const ManageFoodPage = () => {
  const route = useRoute();
  const restaurantId = route.params;
  const navigation = useNavigation();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurantFoods = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };
        const response = await axios.patch(
          `${baseUrl}/api/foods/restaurant/${restaurantId}`,
          {},
          config
        );
        setFoods(response.data);
        setLoading(false);
      } else {
        console.log("Authentication token not found");
      }
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
    <ScrollView>
      {loading ? (
        <Loader />
      ) : (
        <>
          <View style={{ marginHorizontal: 20, marginTop: 15 }}>
            <BackBtn onPress={() => navigation.goBack()} />
            <Text style={styles.heading}>Manage Foods</Text>
          </View>
          <FlatList
            data={foods}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            key={2}
            contentContainerStyle={{
              alignItems: "center",
            }}
            renderItem={({ item }) => (
              <ManageFoodCard
                item={item}
                onPress={() => {
                  navigation.navigate("vendor-food-page", item);
                }}
              />
            )}
          />
        </>
      )}
    </ScrollView>
  );
};

export default ManageFoodPage;

const styles = StyleSheet.create({
  heading: {
    fontFamily: "bold",
    fontSize: 24,
    textAlign: "center",
    marginTop: 10,
  },
});

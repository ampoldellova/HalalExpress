import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useRef, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import baseUrl from "../../assets/common/baseUrl";
import { COLORS, SIZES } from "../../styles/theme";
import { RatingInput } from "react-native-stock-star-rating";
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
import LottieView from "lottie-react-native";

const Reviews = ({ item }) => {
  const navigation = useNavigation();
  const [reviews, setReviews] = useState([]);
  const animation = useRef(null);

  const fetchRestaurantReviews = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/orders/restaurant/${item._id}/reviews`
      );

      const data = await response.json();
      setReviews(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const getTimeDifference = (date) => {
    const now = new Date();
    const createdAt = new Date(date);

    const years = differenceInYears(now, createdAt);
    if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;

    const months = differenceInMonths(now, createdAt);
    if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;

    const days = differenceInDays(now, createdAt);
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;

    return "Today";
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRestaurantReviews();
    }, [])
  );

  return (
    <>
      {reviews ? (
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
            source={require("../../assets/anime/emptyOrders.json")}
          />
          <Text
            style={{
              fontSize: 16,
              fontFamily: "regular",
              marginTop: -20,
              color: COLORS.gray,
            }}
          >
            No reviews yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          style={{
            marginTop: 10,
            marginBottom: 80,
          }}
          renderItem={({ item }) => (
            <View
              style={{
                marginHorizontal: 10,
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.white,
                  padding: 10,
                  borderRadius: 15,
                  marginBottom: 10,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={{ uri: item?.userId?.profile?.url }}
                    style={{ width: 20, height: 20, borderRadius: 25 }}
                  />
                  <Text
                    style={{ fontFamily: "bold", marginLeft: 5, marginTop: 2 }}
                  >
                    {item?.userId?.username}
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 5,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <RatingInput
                    rating={item?.rating?.stars}
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text
                    style={{
                      fontFamily: "regular",
                      marginLeft: 5,
                      color: COLORS.gray,
                      fontSize: 12,
                      marginTop: 6,
                    }}
                  >
                    - {getTimeDifference(item.createdAt)}
                  </Text>
                </View>

                <Text
                  style={{
                    fontFamily: "regular",
                    marginTop: 5,
                    fontSize: 12,
                  }}
                >
                  {item.rating.feedback}
                </Text>

                <FlatList
                  showsHorizontalScrollIndicator={false}
                  data={item?.orderItems}
                  horizontal
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <View
                      key={item?._id}
                      style={{
                        flexDirection: "row",
                        marginTop: 10,
                        backgroundColor: COLORS.offwhite,
                        borderRadius: 5,
                        alignItems: "center",
                        marginRight: 10,
                        paddingRight: 10,
                      }}
                    >
                      <Image
                        source={{ uri: item?.foodId?.imageUrl?.url }}
                        style={{ width: 50, height: 50, borderRadius: 5 }}
                      />

                      <View style={{ flexDirection: "column", marginLeft: 10 }}>
                        <Text
                          style={{
                            fontFamily: "bold",
                            fontSize: 12,
                          }}
                        >
                          {item?.foodId?.title}
                        </Text>

                        <Text
                          style={{
                            fontFamily: "bold",
                            fontSize: 12,
                            color: COLORS.gray,
                          }}
                        >
                          ₱ {item?.foodId?.price}
                        </Text>
                      </View>
                    </View>
                  )}
                />
              </View>
            </View>
          )}
        />
      )}
    </>
  );
};

export default Reviews;

const styles = StyleSheet.create({});

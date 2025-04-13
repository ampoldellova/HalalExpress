import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React from "react";
import { COLORS, SIZES } from "../../styles/theme";
import { Rating } from "react-native-stock-star-rating";
import { useNavigation } from "@react-navigation/native";

const CategoryFoodComp = ({ item }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={() => navigation.navigate("food-page", item)}
    >
      <View style={styles.innerRow}>
        <Image
          source={{ uri: item.imageUrl.url }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 15,
          }}
        />
        <View
          style={{
            position: "absolute",
            right: 10,
            bottom: 10,
            backgroundColor: COLORS.secondary,
            borderRadius: 8,
          }}
        >
          <Text
            style={[
              styles.restaurant,
              { color: COLORS.lightWhite, marginHorizontal: 5 },
            ]}
          >{` \₱ ${item.price}`}</Text>
        </View>

        <View style={styles.row}>
          <View>
            <Text style={styles.restaurant}>{item.title}</Text>

            <FlatList
              data={item.foodTags.slice(0, 2)}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item}
              style={{ marginTop: 5, marginBottom: 5 }}
              horizontal
              scrollEnabled
              renderItem={({ item }) => (
                <View
                  style={{
                    marginHorizontal: 2,
                    backgroundColor: COLORS.gray2,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      marginHorizontal: 5,
                      color: COLORS.lightWhite,
                      fontFamily: "regular",
                      fontSize: 11,
                    }}
                  >
                    {item}
                  </Text>
                </View>
              )}
            />

            <Text style={styles.reviews}>{item.ratingCount} Reviews</Text>
            <Rating
              rating={item.rating}
              color={COLORS.secondary}
              size={20}
              maxStars={5}
              bordered={false}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryFoodComp;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.lightWhite,
    width: SIZES.width - 26,
    height: 120,
    marginBottom: 10,
    borderRadius: 12,
  },
  innerRow: {
    flexDirection: "row",
    margin: 10,
    backgroundColor: COLORS.offwhite,
    borderRadius: 16,
  },
  row: {
    marginLeft: 10,
    marginTop: 10,
  },
  restaurant: { fontFamily: "medium", fontSize: 14 },
  reviews: {
    fontFamily: "regular",
    fontSize: 12,
    color: COLORS.gray,
  },
  price: {
    paddingLeft: 18,
    paddingTop: 5,
    fontFamily: "bold",
    fontSize: 17,
    color: COLORS.lightWhite,
  },
  reOrderTxt: {
    fontFamily: "medium",
    fontSize: 16,
    color: COLORS.lightWhite,
  },
});

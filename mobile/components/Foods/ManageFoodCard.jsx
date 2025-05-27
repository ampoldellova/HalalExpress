import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { RatingInput } from "react-native-stock-star-rating";
import { COLORS, SIZES } from "../../styles/theme";

const ManageFoodCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress}>
      <Image
        source={{ uri: item.imageUrl.url }}
        style={{
          width: "100%",
          height: 100,
          borderRadius: 10,
        }}
      />
      <Text style={styles.heading}>{item.title}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: SIZES.width / 2.5,
        }}
      >
        <Text style={styles.small}>Availability:</Text>
        <View
          style={{
            backgroundColor: item.isAvailable
              ? COLORS.primary
              : COLORS.secondary,
            borderRadius: 30,
          }}
        >
          <Text
            style={[
              styles.small,
              {
                color: "white",
                marginHorizontal: 5,
              },
            ]}
          >
            {item?.isAvailable ? "Available" : "Not Available"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ManageFoodCard;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.lightWhite,
    width: SIZES.width / 2.3,
    height: "auto",
    marginBottom: 10,
    borderRadius: 12,
    padding: 5,
  },
  heading: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.black,
    marginTop: 10,
  },
  small: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.gray,
  },
});

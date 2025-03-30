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
          width: SIZES.width / 2.5,
          height: SIZES.height / 5.8,
          borderRadius: 15,
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
    borderColor: COLORS.lightWhite,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
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

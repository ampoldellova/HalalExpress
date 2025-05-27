import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../../styles/theme";
import { RatingInput } from "react-native-stock-star-rating";

const ManageProductCard = ({ item, onPress }) => {
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
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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

export default ManageProductCard;

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

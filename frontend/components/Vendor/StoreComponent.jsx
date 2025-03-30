import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../../styles/theme";
import { RatingInput } from "react-native-stock-star-rating";

const StoreComponent = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress}>
      <Image
        source={{ uri: item.imageUrl.url }}
        style={{
          width: SIZES.width - 80,
          height: SIZES.height / 5.8,
          borderRadius: 15,
          borderWidth: 1,
          borderColor: COLORS.gray2,
        }}
      />
      <View style={{ flexDirection: "row", marginTop: 5 }}>
        <Image
          source={{ uri: item.logoUrl.url }}
          style={{
            width: 20,
            height: 20,
            borderRadius: 5,
          }}
        />
        <Text style={styles.heading}>{item.title}</Text>
        <View style={{ flex: 1 }} />
        <View
          style={{
            backgroundColor: item.isAvailable ? COLORS.primary : "red",
            borderRadius: 30,
            justifyContent: "center",
            paddingHorizontal: 10,
          }}
        >
          <Text
            style={[styles.small, { color: "white", fontFamily: "medium" }]}
          >
            {item.isAvailable ? "Open" : "Closed"}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.small}>Delivery under:</Text>
        <Text style={styles.small}>{item.time}</Text>
      </View>
      <View
        pointerEvents="none"
        style={{ flexDirection: "row", justifyContent: "space-between" }}
      >
        <RatingInput rating={item.rating} size={14} color={COLORS.primary} />
        <Text style={styles.small}>{item.ratingCount} + ratings</Text>
      </View>
    </TouchableOpacity>
  );
};

export default StoreComponent;

const styles = StyleSheet.create({
  wrapper: {
    marginRight: 15,
    borderColor: COLORS.lightWhite,
    padding: 8,
    borderRadius: 16,
  },
  heading: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.black,
    marginTop: 2,
    marginLeft: 5,
  },
  small: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.gray,
  },
});

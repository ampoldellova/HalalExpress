import { Text, View, Image } from "react-native";
import React from "react";
import { COLORS, SHADOWS } from "../../styles/theme";

const CategoryItem = ({ category, selected }) => {
  return (
    <View
      style={{
        marginLeft: 12,
        padding: 5,
        alignItems: "center",
        width: 80,
        justifyContent: "center",
        borderRadius: 15,
        borderWidth: 0.5,
        borderColor:
          category.value == selected ? COLORS.gray2 : "transparent",
        shadowColor: SHADOWS.small,
      }}
    >
      <View
        style={{
          width: 45,
          height: 45,
          backgroundColor: COLORS.gray3,
          borderRadius: 99,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: category.imageUrl.url }}
          style={{ width: 30, height: 30 }}
        />
      </View>
      <Text
        style={{ fontSize: 13, fontFamily: "regular", textAlign: "center" }}
      >
        {category.title}
      </Text>
    </View>
  );
};

export default CategoryItem;

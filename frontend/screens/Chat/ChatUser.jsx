import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../../styles/theme";
import Divider from "../../components/Divider";

const ChatUser = ({ restaurant, onPress }) => {
  return (
    <TouchableOpacity style={styles.profile} onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 20,
          marginBottom: 10,
        }}
      >
        <Image
          alt=""
          source={{
            uri: restaurant?.user?.avatar,
          }}
          style={styles.profileAvatar}
        />
        <View>
          <Text style={styles.profileName}>{restaurant?.user?.name}</Text>
          <Text
            style={{
              fontFamily: "regular",
              color: COLORS.gray,
              width: SIZES.width / 1.5,
            }}
          >
            {restaurant?.text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatUser;

const styles = StyleSheet.create({
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 99,
    marginRight: 12,
  },
  profileName: {
    fontSize: 18,
    color: COLORS.black,
    fontFamily: "bold",
  },
});

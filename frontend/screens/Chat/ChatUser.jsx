import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../../styles/theme";

const ChatUser = ({ restaurant, onPress }) => {
  return (
    <TouchableOpacity style={styles.profile} onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 20,
          marginBottom: 20,
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={styles.profileName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {restaurant?.user?.name}
            </Text>
            <Text
              style={{
                fontFamily: "regular",
                color: COLORS.gray,
                marginLeft: 5,
              }}
            >
              {restaurant?.timeAgo}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
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
    width: 60,
    height: 60,
    borderRadius: 99,
    marginRight: 12,
    borderColor: COLORS.gray3,
    borderWidth: 1,
  },
  profileName: {
    fontSize: 18,
    color: COLORS.black,
    fontFamily: "bold",
    // width: SIZES.width / 2,
  },
});

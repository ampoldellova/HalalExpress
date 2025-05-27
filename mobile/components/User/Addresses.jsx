import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS } from "../../styles/theme";
import Divider from "../Divider";
import DeleteAddress from "./DeleteAddress";
import EditAddress from "./EditAddress";

const Addresses = ({ item, getUserAddresses }) => {
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={require("../../assets/images/location.png")}
          style={{ width: 30, height: 30, marginLeft: 5 }}
        />
        <View style={{ flex: 1, height: 60, justifyContent: "center" }}>
          <Text
            style={{
              fontFamily: "regular",
              fontSize: 14,
              marginLeft: 10,
              color: COLORS.gray,
            }}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {item.address}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <EditAddress address={item} />
          <DeleteAddress
            addressId={item._id}
            getUserAddresses={getUserAddresses}
          />
        </View>
      </View>
      <Divider />
    </View>
  );
};

export default Addresses;

const styles = StyleSheet.create({});

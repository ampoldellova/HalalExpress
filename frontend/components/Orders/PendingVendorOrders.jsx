import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS } from "../../styles/theme";

const PendingVendorOrders = ({ item }) => {
  return (
    <TouchableOpacity
      style={{
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#f8f8f8",
        marginBottom: 10,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          source={{ uri: item?.userId?.profile?.url }}
          style={{
            width: 30,
            height: 30,
            borderRadius: 5,
            marginRight: 10,
          }}
        />
        <View>
          <Text style={{ fontSize: 16, fontFamily: "bold" }}>
            Order #: {item?._id ? `${item._id.substring(0, 15)}...` : ""}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "bold",
              color: COLORS.gray,
            }}
          >
            Customer: {item?.userId?.username}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "regular",
              color: COLORS.gray,
            }}
          >
            Payment method: {item?.paymentMethod}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "regular",
                color: COLORS.gray,
              }}
            >
              Payment status:
            </Text>

            <View
              style={{
                borderRadius: 99,
                backgroundColor:
                  item.paymentStatus === "Pending"
                    ? COLORS.secondary
                    : COLORS.primary,
                width: 10,
                height: 10,
                marginLeft: 5,
                marginBottom: 2,
              }}
            />
            <Text
              style={{
                fontSize: 12,
                fontFamily: "bold",
                color: COLORS.gray,
                marginLeft: 2,
              }}
            >
              {item?.paymentStatus}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 12,
              fontFamily: "regular",
              color: COLORS.gray,
            }}
          >
            Ordered on:{" "}
            {new Date(item?.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric", // Added year
            })}{" "}
            at{" "}
            {new Date(item?.createdAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PendingVendorOrders;

const styles = StyleSheet.create({});

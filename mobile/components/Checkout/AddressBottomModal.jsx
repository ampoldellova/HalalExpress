import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React from "react";
import { BottomModal, ModalContent, SlideAnimation } from "react-native-modals";
import { COLORS, SIZES } from "../../styles/theme";
import { MaterialIcons } from "@expo/vector-icons";

const AddressBottomModal = ({
  showAddresses,
  addresses,
  selectedAddress,
  setSelectedAddress,
  selectedAddressLat,
  setSelectedAddressLat,
  selectedAddressLng,
  setSelectedAddressLng,
  navigation,
  setShowAddresses,
}) => {
  return (
    <BottomModal
      visible={showAddresses}
      onTouchOutside={() => setShowAddresses(false)}
      swipeThreshold={100}
      modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
      onHardwareBackPress={() => setShowAddresses(false)}
    >
      <View
        style={{
          height: 10,
          backgroundColor: COLORS.primary,
          width: SIZES.width,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: 3,
            backgroundColor: COLORS.white,
            width: SIZES.width / 5,
            borderRadius: 10,
          }}
        />
      </View>
      <ModalContent style={{ height: SIZES.height / 2, width: "100%" }}>
        <Text style={{ fontFamily: "bold", fontSize: 20, marginBottom: 5 }}>
          {" "}
          Saved Addresses
        </Text>

        <FlatList
          data={addresses}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedAddress(
                  selectedAddress === item.address ? null : item.address
                );
                setSelectedAddressLat(
                  selectedAddressLat === item.latitude ? null : item.latitude
                );
                setSelectedAddressLng(
                  selectedAddressLng === item.longitude ? null : item.longitude
                );
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
                borderWidth: 1,
                padding: 10,
                borderRadius: 10,
                borderColor:
                  selectedAddress === item.address
                    ? COLORS.primary
                    : COLORS.gray2,
              }}
            >
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
              </View>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("add-address-page");
            setShowAddresses(false);
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: COLORS.gray2,
            marginBottom: -15,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 10,
            }}
          >
            <MaterialIcons name="add" size={30} color={COLORS.gray2} />
            <View style={{ flex: 1, height: 50, justifyContent: "center" }}>
              <Text
                style={{
                  fontFamily: "regular",
                  fontSize: 14,
                  marginLeft: 10,
                  color: COLORS.gray,
                }}
              >
                Add New Address
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </ModalContent>
    </BottomModal>
  );
};

export default AddressBottomModal;

const styles = StyleSheet.create({});

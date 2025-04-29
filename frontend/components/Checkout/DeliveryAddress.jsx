import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { COLORS, SIZES } from "../../styles/theme";
import { Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const DeliveryAddress = ({
  region,
  selectedAddress,
  address,
  orderNote,
  setShowAddresses,
}) => {
  const formatAddress = (address) => {
    const parts = address.split(",");
    return parts.slice(0, 2).join(",");
  };

  const formatCity = (address) => {
    const parts = address.split(",");
    if (parts.length > 1) {
      const cityParts = parts[1].trim().split(" ");
      return cityParts[0];
    }
    return parts[0];
  };
  return (
    <View
      style={{
        borderColor: COLORS.gray2,
        height: "auto",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
          width: "100%",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../../assets/images/location.png")}
            style={{ width: 25, height: 25 }}
          />
          <Text style={{ fontFamily: "bold", fontSize: 18, marginLeft: 5 }}>
            Delivery Address
          </Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => setShowAddresses(true)}>
            <FontAwesome
              name="pencil"
              size={20}
              color={COLORS.black}
              style={{ marginRight: 5 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapContainer}>
        {region && (
          <MapView
            style={{ height: SIZES.height / 5.2 }}
            region={{
              latitude: region?.latitude,
              longitude: region?.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              title="Your Location"
              coordinate={{
                latitude: region?.latitude,
                longitude: region?.longitude,
              }}
            />
          </MapView>
        )}
      </View>

      <View style={{ flexDirection: "column" }}>
        <Text style={{ fontFamily: "bold", fontSize: 16, marginTop: 5 }}>
          {formatAddress(
            selectedAddress === null
              ? address.formattedAddress
              : selectedAddress
          )}
        </Text>
        <Text style={{ fontFamily: "regular", fontSize: 14, marginTop: -5 }}>
          {formatCity(
            selectedAddress === null ? address.city : selectedAddress
          )}
        </Text>
      </View>

      <Text style={styles.label}>Delivery note</Text>
      <View style={styles.notesInputWrapper(COLORS.offwhite)}>
        <MaterialIcons
          name="notes"
          size={20}
          color={COLORS.gray}
          style={{ marginTop: 10, marginRight: 5 }}
        />
        <TextInput
          multiline
          numberOfLines={3}
          placeholder="Add your note here..."
          autoCapitalize="none"
          autoCorrect={false}
          value={orderNote}
          onChangeText={(text) => setOrderNote(text)}
          style={[styles.textInput, { marginTop: 10 }]}
        />
      </View>
    </View>
  );
};

export default DeliveryAddress;

const styles = StyleSheet.create({
  heading: {
    fontFamily: "bold",
    fontSize: 24,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  mapContainer: {
    width: "100%",
    height: "auto",
    borderColor: COLORS.gray2,
    borderWidth: 1,
    borderRadius: 15,
    overflow: "hidden",
  },
  label: {
    fontFamily: "regular",
    fontSize: SIZES.xSmall,
    marginBottom: 5,
    marginEnd: 5,
    textAlign: "right",
  },
  textInput: {
    flex: 1,
    fontFamily: "regular",
    marginTop: 2,
  },
  notesInputWrapper: (borderColor) => ({
    borderColor: borderColor,
    backgroundColor: COLORS.lightWhite,
    borderWidth: 1,
    height: 80,
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "flex-start",
  }),
  inputWrapper: (borderColor) => ({
    borderColor: borderColor,
    backgroundColor: COLORS.lightWhite,
    borderWidth: 1,
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
  }),
});

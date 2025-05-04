import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  MaterialCommunityIcons,
  Feather,
  FontAwesome,
} from "@expo/vector-icons";
import { COLORS, SIZES } from "../../styles/theme";
import Button from "../Button";
import Divider from "../Divider";

const PersonalDetails = ({
  isUserDetailsChanged,
  editProfile,
  setEditProfile,
  setUsername,
  setEmail,
  setPhone,
  setImage,
  username,
  email,
  phone,
  image,
  loading,
  handleSubmitForm,
}) => {
  return (
    <View
      style={{
        marginBottom: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontFamily: "bold", fontSize: 18 }}>
          Personal Details
        </Text>
        <TouchableOpacity
          onPress={() =>
            editProfile ? setEditProfile(false) : setEditProfile(true)
          }
        >
          {editProfile ? (
            <Text
              style={{
                fontFamily: "bold",
                fontSize: 16,
                color: COLORS.black,
              }}
            >
              Cancel
            </Text>
          ) : (
            <FontAwesome
              name="pencil"
              size={20}
              color={COLORS.black}
              style={{ marginRight: 5 }}
            />
          )}
        </TouchableOpacity>
      </View>

      <Divider />

      {editProfile ? (
        <View style={{ marginTop: 10 }}>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputWrapper(COLORS.offwhite)}>
              <Feather
                name="user"
                size={20}
                color={COLORS.gray}
                style={{ marginRight: 10 }}
              />
              <TextInput
                placeholder="Enter your username"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.textInput}
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
            </View>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper(COLORS.offwhite)}>
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color={COLORS.gray}
                style={{ marginRight: 10 }}
              />
              <TextInput
                placeholder="Enter your username"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.textInput}
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </View>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Phone number</Text>
            <View style={styles.inputWrapper(COLORS.offwhite)}>
              <Feather
                name="phone"
                size={20}
                color={COLORS.gray}
                style={{ marginRight: 10 }}
              />
              <TextInput
                placeholder="Enter your username"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.textInput}
                value={phone}
                onChangeText={(text) => setPhone(text)}
              />
            </View>
          </View>

          <Button
            title="S U B M I T"
            onPress={isUserDetailsChanged() ? handleSubmitForm : null}
            isValid={isUserDetailsChanged()}
            loader={loading}
          />
        </View>
      ) : (
        <View style={{ marginBottom: 5, marginLeft: 5 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Feather name="user" size={20} color={COLORS.gray} />
            <Text
              style={{
                fontFamily: "regular",
                fontSize: 14,
                marginLeft: 5,
              }}
            >
              {username}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <MaterialCommunityIcons
              name="email-outline"
              size={20}
              color={COLORS.gray}
            />
            <Text
              style={{
                fontFamily: "regular",
                fontSize: 14,
                marginLeft: 5,
              }}
            >
              {email}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Feather name="phone" size={20} color={COLORS.gray} />
            <Text
              style={{
                fontFamily: "regular",
                fontSize: 14,
                marginLeft: 5,
              }}
            >
              +{phone}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default PersonalDetails;

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

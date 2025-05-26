import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { COLORS } from "../../styles/theme";
import { OtpInput } from "react-native-otp-entry";
import LottieView from "lottie-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import baseUrl from "../../assets/common/baseUrl";
import axios from "axios";

const VerificationPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const animation = useRef(null);
  const { values } = route.params || {};
  const [loader, setLoader] = useState(false);
  const [otp, setOtp] = useState("");

  const verifyUser = async () => {
    setLoader(true);

    try {
      const endpoint = `${baseUrl}/verify-otp`;
      const data = {
        email: values.email,
        otp: otp,
      };

      const response = await axios.post(endpoint, data);

      if (response.status === 201) {
        setLoader(false);
        Toast.show({
          type: "success",
          text1: "Verification Successful ✅",
          text2: "Your account has been verified successfully.",
        });
        navigation.navigate("bottom-navigation", { screen: "ProfilePage" });
      } else {
        setLoader(false);
        Toast.show({
          type: "error",
          text1: "Verification Failed",
          text2: response.data.error || "Please try again.",
        });
      }
    } catch (error) {
      setLoader(false);
      Toast.show({
        type: "error",
        text1: "Error ❌",
        text2: error.message,
      });
    }
  };

  return (
    <View
      style={{ flex: 1, justifyContent: "flex-start", marginHorizontal: 20 }}
    >
      <LottieView
        autoPlay
        ref={animation}
        style={{ width: "100%", height: 200, marginTop: 20 }}
        source={require("../../assets/anime/mail.json")}
      />

      <Text style={{ fontSize: 20, marginTop: 10, fontFamily: "bold" }}>
        Verification Code
      </Text>
      <Text
        style={{
          marginTop: 10,
          marginBottom: 20,
          fontSize: 14,
          fontFamily: "regular",
          color: COLORS.gray,
        }}
      >
        We have sent a verification code to your email address. Please enter the
        code to verify your account.
      </Text>

      <OtpInput
        focusColor={COLORS.primary}
        numberOfDigits={6}
        onTextChange={(text) => setOtp(text)}
      />

      <TouchableOpacity
        style={{
          backgroundColor: COLORS.primary,
          paddingVertical: 10,
          borderRadius: 10,
          marginTop: 20,
          alignItems: "center",
        }}
        onPress={() => verifyUser()}
      >
        {loader ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text
            style={{ color: COLORS.white, fontSize: 16, fontFamily: "bold" }}
          >
            V E R I F Y
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default VerificationPage;

const styles = StyleSheet.create({});

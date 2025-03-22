import { Linking, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { retrievePaymentIntent } from "../hook/paymongoService";
import Toast from "react-native-toast-message";
import Loader from "../components/Loader";
import { getProfile } from "../hook/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseUrl from "../assets/common/baseUrl";
import axios from "axios";

const PaymentConfirmationPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [user, setUser] = useState(null);
  const { payment, data } = route.params;
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const fetchProfile = async () => {
    const profile = await getProfile();
    setUser(profile);
  };

  const paymentStatus = async () => {
    try {
      const response = await retrievePaymentIntent(payment.data.id);

      if (response.data.attributes.status === "succeeded") {
        try {
          const token = await AsyncStorage.getItem("token");
          const config = {
            headers: {
              Authorization: `Bearer ${JSON.parse(token)}`,
            },
          };

          if (user?.userType === "Vendor") {
            const response = await axios.post(
              `${baseUrl}/api/vendor/orders/check-out`,
              data,
              config
            );
            if (response.status === 200) {
              setIsPaymentSuccessful(true);
              navigation.navigate("bottom-navigation");
              Toast.show({
                type: "success",
                text1: "Payment Successful ✅",
                text2: "Your order has been placed.",
              });
            } else {
              Toast.show({
                type: "error",
                text1: "Error ❌",
                text2: "Failed to place order",
              });
            }
          } else {
            const response = await axios.post(
              `${baseUrl}/api/orders/check-out`,
              data,
              config
            );
            if (response.status === 200) {
              setIsPaymentSuccessful(true);
              navigation.navigate("bottom-navigation");
              Toast.show({
                type: "success",
                text1: "Payment Successful ✅",
                text2: "Your order has been placed.",
              });
            } else {
              Toast.show({
                type: "error",
                text1: "Error ❌",
                text2: "Failed to place order",
              });
            }
          }
        } catch (error) {
          console.log(error);
        }
      } else if (response.data.attributes.status === "failed") {
        navigation.navigate("HomePage");
        Toast.show({
          type: "error",
          text1: "Payment Failed",
          text2: "Please try again.",
        });
      }
      console.log(response.data.attributes.status);
    } catch (error) {
      console.error("Error retrieving payment status:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, [])
  );

  useEffect(() => {
    if (!isPaymentSuccessful) {
      const interval = setInterval(() => {
        paymentStatus();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPaymentSuccessful]);

  return <Loader />;
};

export default PaymentConfirmationPage;

const styles = StyleSheet.create({});

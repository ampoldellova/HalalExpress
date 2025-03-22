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

const PaymentConfirmationPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { payment, data } = route.params;
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const paymentStatus = async () => {
    try {
      const response = await retrievePaymentIntent(payment.data.id);

      if (response.data.attributes.status === "succeeded") {
        setIsPaymentSuccessful(true);
        navigation.navigate("bottom-navigation");
        Toast.show({
          type: "success",
          text1: "Payment Successful",
          text2: "Your order has been placed.",
        });
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

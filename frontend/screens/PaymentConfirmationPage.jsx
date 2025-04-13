import { Linking, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useRef } from "react";
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
import { addDoc, collection } from "@react-native-firebase/firestore";
import { database } from "../config/firebase";
import { useSelector } from "react-redux";

const PaymentConfirmationPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useSelector((state) => state.user);
  const { payment, data } = route.params;
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const intervalRef = useRef(null);
  let parsedData = {};

  const fetchProfile = async () => {
    const profile = await getProfile();
    setUser(profile);
  };

  const paymentStatus = async () => {
    try {
      const response = await retrievePaymentIntent(payment.data.id);
      parsedData = { ...data };

      if (response.data.attributes.status === "succeeded") {
        parsedData.paymentId = response.data.attributes.payments[0].id;
        console.log(parsedData);
        clearInterval(intervalRef.current);
        setIsPaymentSuccessful(true);

        try {
          const token = await AsyncStorage.getItem("token");
          const config = {
            headers: {
              Authorization: `Bearer ${JSON.parse(token)}`,
            },
          };

          const endpoint =
            user?.userType === "Vendor"
              ? `${baseUrl}/api/vendor/orders/check-out`
              : `${baseUrl}/api/orders/check-out`;

          const response = await axios.post(endpoint, parsedData, config);
          if (response.status === 200) {
            const order = response.data.order;
            const restaurantDetails = order.restaurant;

            if (
              restaurantDetails?._id &&
              restaurantDetails?.title &&
              restaurantDetails?.logoUrl?.url
            ) {
              const message = {
                _id: new Date().getTime().toString(),
                text: `Thank you for placing your order! Your order is being processed.`,
                createdAt: new Date(),
                user: {
                  _id: restaurantDetails?._id,
                  name: restaurantDetails?.title,
                  avatar: restaurantDetails?.logoUrl?.url,
                },
                receiverId: user?._id,
              };

              try {
                await addDoc(collection(database, "chats"), message);
                console.log("Message sent to Firestore successfully.");
              } catch (error) {
                console.error("Error sending message to Firestore:", error);
              }
            } else {
              console.error(
                "Restaurant details are incomplete. Message not sent."
              );
            }

            navigation.navigate("order-page");
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
        } catch (error) {
          console.log(error);
        }
      } else if (response.data.attributes.status === "failed") {
        clearInterval(intervalRef.current);
        navigation.navigate("bottom-navigation");
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
      intervalRef.current = setInterval(() => {
        paymentStatus();
      }, 1000);

      return () => clearInterval(intervalRef.current);
    }
  }, [isPaymentSuccessful]);

  return <Loader />;
};

export default PaymentConfirmationPage;

const styles = StyleSheet.create({});

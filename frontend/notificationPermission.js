import * as Notifications from "expo-notifications";
import axios from "axios";
import baseUrl from "./assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerForPushNotificationsAsync = async (login) => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Failed to get push token for push notification!");
    return null;
  }

  if (login === true) {
    console.log("login is true");
    let currentPushToken = null;
    const userToken = await AsyncStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${JSON.parse(userToken)}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}/api/users/get/token`,
        config
      );
      currentPushToken = response.data.expoPushToken;
    } catch (error) {
      console.error("Error fetching current push token:", error);
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;

    if (token !== currentPushToken || !currentPushToken) {
      try {
        await axios.put(
          `${baseUrl}/api/users/update/token`,
          {
            expoPushToken: token,
          },
          config
        );
        console.log("Push token updated successfully");
      } catch (error) {
        console.error("Error updating push token:", error);
      }
    } else {
      console.log("Push token is already up-to-date");
    }
  } else {
    console.log("login is false");
  }

  return token;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

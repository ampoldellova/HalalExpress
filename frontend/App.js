import "react-native-gesture-handler";
import "react-native-reanimated";
import { Linking, StyleSheet, Text, View, StatusBar } from "react-native";
import {
  NavigationContainer,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import BottomTab from "./navigations/BottomTab";
import { useCallback, useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import { UserLocationContext } from "./contexts/UserLocationContext";
import { UserReversedGeoCode } from "./contexts/UserReversedGeoCode";
import { RestaurantContext } from "./contexts/RestaurantContext";
import { SupplierContext } from "./contexts/SupplierContext";
import { LoginContext } from "./contexts/LoginContext";
import { CartCountContext } from "./contexts/CartCountContext";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserRestaurantPage from "./screens/Vendor/UserRestaurantPage";
import ManageFoodPage from "./screens/Food/ManageFoodPage";
import VendorFoodPage from "./screens/Food/VendorFoodPage";
import AddFoodPage from "./screens/Food/AddFoodPage";
import EditRestaurantPage from "./screens/Vendor/EditRestaurantPage";
import EditProfile from "./screens/User/EditProfilePage";
import ChatList from "./screens/Chat/ChatList";
import ChatRoom from "./screens/Chat/ChatRoom";
import SignUp from "./screens/User/SignUp";
import UserSupplierPage from "./screens/Supplier/UserSupplierPage";
import ManageProductPage from "./screens/Product/ManageProductPage";
import ProductPage from "./screens/Product/ProductPage";
import AddProductPage from "./screens/Product/AddProductPage";
import EditSupplierPage from "./screens/Supplier/EditSupplierPage";
import Restaurant from "./screens/Vendor/Restaurant";
import Supplier from "./screens/Supplier/Supplier";
import ProductNavigator from "./navigations/ProductNavigator";
import FoodNavigator from "./navigations/FoodNavigator";
import AddressesPage from "./screens/User/AddressesPage";
import AddAddressPage from "./screens/User/AddAddressPage";
import EditAddressPage from "./screens/User/EditAddressPage";
import LoginPage from "./screens/User/LoginPage";
import Toast from "react-native-toast-message";
import CheckoutPage from "./screens/CheckoutPage";
import { ModalPortal } from "react-native-modals";
import PaymentConfirmationPage from "./screens/PaymentConfirmationPage";
import OrderPage from "./screens/Cart/OrderPage";
import OrderDetails from "./screens/Order/OrderDetails";

const Stack = createNativeStackNavigator();

export default function App() {
  const [login, setLogin] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [restaurantObj, setRestaurantObj] = useState(null);
  const [supplierObj, setSupplierObj] = useState(null);
  const [error, setErrorMsg] = useState(null);

  const defaultAddresss = {
    city: "Shanghai",
    country: "China",
    district: "Pudong",
    isoCountryCode: "CN",
    name: "33 East Nanjing Rd",
    postalCode: "94108",
    region: "SH",
    street: "Stockton St",
    streetNumber: "1",
    subregion: "San Francisco County",
    timezone: "America/Los_Angeles",
  };

  const [fontsLoaded] = useFonts({
    regular: require("./assets/fonts/Poppins-Regular.ttf"),
    light: require("./assets/fonts/Poppins-Light.ttf"),
    bold: require("./assets/fonts/Poppins-Bold.ttf"),
    medium: require("./assets/fonts/Poppins-Medium.ttf"),
    extrabold: require("./assets/fonts/Poppins-ExtraBold.ttf"),
    semibold: require("./assets/fonts/Poppins-SemiBold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    (async () => {
      setAddress(defaultAddresss);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location as denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      loginStatus();
    })();
  }, []);

  const loginStatus = async () => {
    const userToken = await AsyncStorage.getItem("token");
    if (userToken !== null) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  };

  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F8" />
      <UserLocationContext.Provider value={{ location, setLocation }}>
        <UserReversedGeoCode.Provider value={{ address, setAddress }}>
          <RestaurantContext.Provider
            value={{ restaurantObj, setRestaurantObj }}
          >
            <SupplierContext.Provider value={{ supplierObj, setSupplierObj }}>
              <LoginContext.Provider value={{ login, setLogin }}>
                <CartCountContext.Provider value={{ cartCount, setCartCount }}>
                  <NavigationContainer>
                    <Stack.Navigator>
                      <Stack.Screen
                        name="bottom-navigation"
                        component={BottomTab}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="food-navigation"
                        component={FoodNavigator}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="register-page"
                        component={SignUp}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="login-page"
                        component={LoginPage}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="user-restaurant-page"
                        component={UserRestaurantPage}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="user-supplier-page"
                        component={UserSupplierPage}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="manage-food-page"
                        component={ManageFoodPage}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="manage-product-page"
                        component={ManageProductPage}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="vendor-food-page"
                        component={VendorFoodPage}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="supplier-product-page"
                        component={ProductPage}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="add-food-page"
                        component={AddFoodPage}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="add-product-page"
                        component={AddProductPage}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="edit-restaurant-page"
                        component={EditRestaurantPage}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="edit-supplier-page"
                        component={EditSupplierPage}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="edit-profile-page"
                        component={EditProfile}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="chat-list"
                        component={ChatList}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="chat-page"
                        component={ChatRoom}
                        options={{ headerTitle: "" }}
                      />
                      <Stack.Screen
                        name="restaurant-page"
                        component={Restaurant}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="supplier-page"
                        component={Supplier}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="product-navigator"
                        component={ProductNavigator}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="food-navigator"
                        component={FoodNavigator}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="address-page"
                        component={AddressesPage}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="add-address-page"
                        component={AddAddressPage}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="edit-address-page"
                        component={EditAddressPage}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="checkout-page"
                        component={CheckoutPage}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="payment-confirmation"
                        component={PaymentConfirmationPage}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="order-page"
                        component={OrderPage}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="order-details-page"
                        component={OrderDetails}
                        options={{ headerShown: false }}
                      />
                    </Stack.Navigator>
                    <ModalPortal />
                  </NavigationContainer>
                </CartCountContext.Provider>
              </LoginContext.Provider>
            </SupplierContext.Provider>
          </RestaurantContext.Provider>
        </UserReversedGeoCode.Provider>
      </UserLocationContext.Provider>
      <Toast />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

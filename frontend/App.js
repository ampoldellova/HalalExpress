import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import BottomTab from './navigations/BottomTab';
import { useCallback, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import { UserLocationContext } from './contexts/UserLocationContext';
import { UserReversedGeoCode } from './contexts/UserReversedGeoCode';
import { RestaurantContext } from './contexts/RestaurantContext';
import { SupplierContext } from './contexts/SupplierContext';
import { LoginContext } from './contexts/LoginContext';
import { CartCountContext } from './contexts/CartCountContext';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserRestaurantPage from './screens/Vendor/UserRestaurantPage';
import ManageFoodPage from './screens/Food/ManageFoodPage';
import VendorFoodPage from './screens/Food/VendorFoodPage';
import AddFoodPage from './screens/Food/AddFoodPage';
import EditRestaurantPage from './screens/Vendor/EditRestaurantPage';


const Stack = createNativeStackNavigator();

export default function App() {
  const [login, setLogin] = useState(null)
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [restaurantObj, setRestaurantObj] = useState(null);
  const [supplierObj, setSupplierObj] = useState(null);
  const [error, setErrorMsg] = useState(null);

  const defaultAddresss = { "city": "Shanghai", "country": "China", "district": "Pudong", "isoCountryCode": "CN", "name": "33 East Nanjing Rd", "postalCode": "94108", "region": "SH", "street": "Stockton St", "streetNumber": "1", "subregion": "San Francisco County", "timezone": "America/Los_Angeles" }
  const [fontsLoaded] = useFonts({
    regular: require('./assets/fonts/Poppins-Regular.ttf'),
    light: require('./assets/fonts/Poppins-Light.ttf'),
    bold: require('./assets/fonts/Poppins-Bold.ttf'),
    medium: require('./assets/fonts/Poppins-Medium.ttf'),
    extrabold: require('./assets/fonts/Poppins-ExtraBold.ttf'),
    semibold: require('./assets/fonts/Poppins-SemiBold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    (async () => {
      setAddress(defaultAddresss)

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location as denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      loginStatus();
    })();
  }, [])

  const loginStatus = async () => {
    const userToken = await AsyncStorage.getItem('token')
    if (userToken !== null) {
      setLogin(true)
    } else {
      setLogin(false)
    }
  };

  return (
    <Provider store={store}>
      <UserLocationContext.Provider value={{ location, setLocation }}>
        <UserReversedGeoCode.Provider value={{ address, setAddress }}>
          <RestaurantContext.Provider value={{ restaurantObj, setRestaurantObj }}>
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
                        name="user-restaurant-page"
                        component={UserRestaurantPage}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name='manage-food-page'
                        component={ManageFoodPage}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name='vendor-food-page'
                        component={VendorFoodPage}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name='add-food-page'
                        component={AddFoodPage}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name='edit-restaurant-page'
                        component={EditRestaurantPage}
                        options={{ headerShown: false }}
                      />
                    </Stack.Navigator>
                  </NavigationContainer>
                </CartCountContext.Provider>
              </LoginContext.Provider>
            </SupplierContext.Provider>
          </RestaurantContext.Provider>
        </UserReversedGeoCode.Provider>
      </UserLocationContext.Provider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

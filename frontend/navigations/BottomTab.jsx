import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../styles/theme';
import HomePage from '../screens/HomePage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import SearchPage from '../screens/Search/SearchPage';
import CartPage from '../screens/Cart/CartPage';
import ProfilePage from '../screens/User/ProfilePage';
import { useDispatch, useSelector } from 'react-redux';
import LoginPage from '../screens/User/LoginPage';
import VendorHomePage from '../screens/VendorHomePage';
import VendorSearchPage from '../screens/Search/VendorSearchPage';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from '../assets/common/baseUrl';
import { useFocusEffect } from '@react-navigation/native';
import { updateCartCount } from '../redux/UserReducer';

const Tab = createBottomTabNavigator();

const tabBarStyle = {
    backgroundColor: COLORS.primary,
    borderTopWidth: 0,
};

const BottomTab = () => {
    const { user, cartCount } = useSelector(state => state.user)
    const [cartItems, setCartItems] = useState([]);
    const dispatch = useDispatch();


    const getCartItems = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            const config = {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                }
            }

            const response = await axios.get(`${baseUrl}/api/cart/`, config)
            setCartItems(response.data.cartItems)
            dispatch(updateCartCount(response.data.cartItems.length))
        } catch (error) {
            console.log(error.message)
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            getCartItems();
        }, [])
    );

    return (
        <Tab.Navigator
            initialRouteName="HomePage"
            activeColor={COLORS.secondary}
            tabBarHideKeyBoard={true}
            headerShown={false}
            inactiveColor="#3e2465"
        >
            <Tab.Screen
                name="HomePage"
                component={user ? (user.userType === 'Vendor' ? VendorHomePage : HomePage) : HomePage}
                options={{
                    tabBarStyle: tabBarStyle,
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name={focused ? "grid" : "grid-outline"}
                            color={focused ? COLORS.secondary : COLORS.secondary1}
                            size={26}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="SearchPage"
                component={user ? (user.userType === 'Vendor' ? VendorSearchPage : SearchPage) : SearchPage}
                options={{
                    tabBarStyle: tabBarStyle,
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name={focused ? "search" : "search"}
                            color={focused ? COLORS.secondary : COLORS.secondary1}
                            size={26}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="CartPage"
                component={CartPage}
                options={{
                    tabBarStyle: tabBarStyle,
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <View>
                            <FontAwesome
                                name={focused ? "opencart" : "opencart"}
                                color={focused ? COLORS.secondary : COLORS.secondary1}
                                size={26}
                            />

                            {cartCount > 0 && (
                                <View style={{
                                    position: 'absolute',
                                    height: 15,
                                    width: 20,
                                    borderRadius: 99,
                                    backgroundColor: COLORS.red,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    right: -15,
                                    bottom: 15
                                }}>
                                    <Text style={{ color: COLORS.white, fontSize: 12, fontFamily: 'medium' }}>{cartCount}</Text>
                                </View>
                            )}
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="ProfilePage"
                component={user ? ProfilePage : LoginPage}
                options={{
                    tabBarStyle: tabBarStyle,
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name={focused ? "person" : "person-outline"}
                            color={focused ? COLORS.secondary : COLORS.secondary1}
                            size={26}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default BottomTab

const styles = StyleSheet.create({})
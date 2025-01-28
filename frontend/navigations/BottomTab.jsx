import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '../styles/theme';
import HomePage from '../screens/HomePage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import SearchPage from '../screens/Search/SearchPage';
import CartPage from '../screens/Cart/CartPage';
import ProfilePage from '../screens/User/ProfilePage';
import { useSelector } from 'react-redux';
import LoginPage from '../screens/User/LoginPage';

const Tab = createBottomTabNavigator();

const tabBarStyle = {
    backgroundColor: COLORS.primary,
    borderTopWidth: 0,
};

const BottomTab = () => {
    const { user } = useSelector(state => state.user)

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
                component={HomePage}
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
                component={SearchPage}
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
                        <FontAwesome
                            name={focused ? "opencart" : "opencart"}
                            color={focused ? COLORS.secondary : COLORS.secondary1}
                            size={26}
                        />
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
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useRoute } from '@react-navigation/native'
import OrderPage from '../screens/Cart/OrderPage'
import 'react-native-gesture-handler'
import Product from '../screens/Product/Product'

const Stack = createNativeStackNavigator();
const ProductNavigator = () => {
    const route = useRoute();
    const item = route.params;
    return (
        <Stack.Navigator initialRouteName='product-page'>
            <Stack.Screen
                name='product-page'
                component={Product}
                options={{ headerShown: false }}
                initialParams={{ item: item }}
            />
            <Stack.Screen
                name='order-page'
                component={OrderPage}
                options={{ headerShown: false, presentation: 'modal' }}
            />
        </Stack.Navigator>
    )
}

export default ProductNavigator

const styles = StyleSheet.create({})
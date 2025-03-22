import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';

const PaymentConfirmationPage = () => {
    const route = useRoute();
    const { data } = route.params;
    console.log(data);
    
    return (
        <View>
            <Text>PaymentConfirmationPage</Text>
        </View>
    )
}

export default PaymentConfirmationPage

const styles = StyleSheet.create({})
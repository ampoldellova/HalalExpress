import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import { COLORS } from '../../styles/theme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const ManageProducts = ({ supplierId }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }} onPress={() => navigation.navigate('manage-product-page', supplierId)}>
            <MaterialCommunityIcons name="food-halal" size={20} color={COLORS.gray} />
            <Text style={styles.text}>Manage Products</Text>
            <Entypo name="chevron-thin-right" size={20} color={COLORS.gray} />
        </TouchableOpacity>
    )
}

export default ManageProducts

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontFamily: "regular",
        left: -65
    }
})
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../styles/theme';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

const ManageFood = ({ restaurantId }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }} onPress={() => navigation.navigate('manage-food-page', restaurantId)}>
            <Ionicons name="fast-food" size={20} color={COLORS.gray} />
            <Text style={styles.text}>Manage Menu</Text>
            <Entypo name="chevron-thin-right" size={20} color={COLORS.gray} />
        </TouchableOpacity>
    )
}

export default ManageFood

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontFamily: "regular",
        left: -77
    }
})
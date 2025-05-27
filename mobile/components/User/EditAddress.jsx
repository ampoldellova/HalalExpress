import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';

const EditAddress = ({ address }) => {
    const navigation = useNavigation();
    
    return (
        <TouchableOpacity onPress={() => navigation.navigate('edit-address-page', address)}>
            <Feather name="edit" size={24} color={COLORS.secondary} style={{ marginLeft: 5 }} />
        </TouchableOpacity>
    )
}

export default EditAddress

const styles = StyleSheet.create({})
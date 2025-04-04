import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { MaterialIcons, Entypo } from '@expo/vector-icons'
import React from 'react'
import { COLORS } from '../../styles/theme'
import { useNavigation } from '@react-navigation/native'

const EditSupplierButton = ({ details, address }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 }} onPress={() => { navigation.navigate('edit-supplier-page', details, address) }}>
            <MaterialIcons name="edit-document" size={20} color={COLORS.gray} />
            <Text style={styles.text}>Edit Supplier Details</Text>
            <Entypo name="chevron-thin-right" size={20} color={COLORS.gray} />
        </TouchableOpacity>
    )
}

export default EditSupplierButton

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontFamily: "regular",
        left: -59
    }
})
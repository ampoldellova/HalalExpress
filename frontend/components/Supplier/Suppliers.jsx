import { FlatList, StyleSheet, View } from 'react-native'
import React, { useContext } from 'react'
import StoreComponent from './StoreComponent'
import { useNavigation } from '@react-navigation/native'
import { SupplierContext } from '../../contexts/SupplierContext'

const Suppliers = ({ suppliers }) => {
    const navigation = useNavigation();
    const { supplierObj, setSupplierObj } = useContext(SupplierContext);

    return (
        <View style={{ marginLeft: 12 }}>
            <FlatList
                data={suppliers}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 5, rowGap: 10 }}
                scrollEnabled
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                    <StoreComponent item={item} onPress={() => { navigation.navigate('supplier', item), setSupplierObj(item) }} />
                )}
            />
        </View>
    )
}

export default Suppliers

const styles = StyleSheet.create({})
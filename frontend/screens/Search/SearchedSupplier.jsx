import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { RatingInput } from 'react-native-stock-star-rating'
import React, { useContext } from 'react'
import { COLORS, SIZES } from '../../styles/theme'
import { useNavigation } from '@react-navigation/native'
import { SupplierContext } from '../../contexts/SupplierContext'

const SearchedSupplier = ({ item }) => {
    const navigation = useNavigation();
    const { supplierObj, setSupplierObj } = useContext(SupplierContext);

    return (
        <TouchableOpacity style={styles.wrapper} onPress={() => { navigation.navigate('supplier', item), setSupplierObj(item) }}>
            <Image
                source={{ uri: item.imageUrl.url }}
                style={{
                    width: SIZES.width - 35,
                    height: SIZES.height / 5.8,
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: COLORS.gray2
                }}
            />
            <Text style={styles.heading}>{item.title}</Text>
            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                <Text style={styles.small}>Delivery under:</Text>
                <Text style={styles.small}>{item.time}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                <RatingInput
                    rating={item.rating}
                    size={14}
                    maxStars={5}
                    setRating={item.rating}
                    bordered={false}
                    color={COLORS.primary}
                />
                <Text style={styles.small}>{item.ratingCount} + ratings</Text>
            </View>
        </TouchableOpacity>
    )
}

export default SearchedSupplier

const styles = StyleSheet.create({
    wrapper: {
        borderColor: COLORS.lightWhite,
        padding: 8,
        borderRadius: 16,
        marginHorizontal: 10
    },
    heading: {
        fontSize: 14,
        fontFamily: "regular",
        color: COLORS.black,
        marginTop: 5
    },
    small: {
        fontSize: 12,
        fontFamily: "regular",
        color: COLORS.gray
    }
})
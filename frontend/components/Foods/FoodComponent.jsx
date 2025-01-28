import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../../styles/theme'

const FoodComponent = ({ item, onPress }) => {
    return (
        <TouchableOpacity style={styles.wrapper} onPress={onPress}>
            <Image
                source={{ uri: item.imageUrl.url }}
                style={{
                    width: SIZES.width - 230,
                    height: SIZES.height / 5.8,
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: COLORS.gray2
                }}
            />

            <Text style={styles.small}>{item.restaurant.title}</Text>
            <Text style={styles.heading}>{item.title}</Text>
            <Text style={styles.small}>₱ {item.price}</Text>
        </TouchableOpacity>
    )
}

export default FoodComponent

const styles = StyleSheet.create({
    wrapper: {
        marginRight: 15,
        borderColor: COLORS.lightWhite,
        padding: 8,
        borderRadius: 16
    },
    heading: {
        fontSize: 14,
        fontFamily: "regular",
        color: COLORS.black,
        width: 120
    },
    small: {
        fontSize: 12,
        fontFamily: "regular",
        color: COLORS.gray,
        marginTop: 5
    }
})
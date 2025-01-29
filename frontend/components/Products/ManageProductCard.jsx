import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../../styles/theme'
import { RatingInput } from 'react-native-stock-star-rating'

const ManageProductCard = ({ item, onPress }) => {
    return (
        <TouchableOpacity style={styles.wrapper} onPress={onPress}>
            <Image
                source={{ uri: item.imageUrl.url }}
                style={{
                    width: SIZES.width - 38,
                    height: SIZES.height / 5.8,
                    borderRadius: 15,
                }}
            />
            <Text style={styles.heading}>{item.title}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.small}>Food Availability:</Text>
                <View style={{ backgroundColor: item.isAvailable ? 'green' : 'red', borderRadius: 30 }}>
                    <Text
                        style={[
                            styles.small, {
                                color: 'white',
                                marginHorizontal: 5
                            }
                        ]}
                    >
                        {item?.isAvailable ? 'Available' : 'Not Available'}
                    </Text>
                </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: 'space-between', pointerEvents: 'none' }}>
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

export default ManageProductCard

const styles = StyleSheet.create({
    wrapper: {
        borderColor: COLORS.lightWhite,
        borderRadius: 16,
        marginTop: 10,
        marginBottom: 10
    },
    heading: {
        fontSize: 14,
        fontFamily: "regular",
        color: COLORS.black,
        marginTop: 10
    },
    small: {
        fontSize: 12,
        fontFamily: "regular",
        color: COLORS.gray,
    }
})
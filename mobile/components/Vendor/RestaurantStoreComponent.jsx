import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { RatingInput } from 'react-native-stock-star-rating'
import { COLORS, SIZES } from '../../styles/theme'

const RestaurantStoreComponent = ({ item, onPress }) => {

    return (
        <TouchableOpacity onPress={onPress} style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row' }}>
                <Image
                    source={{ uri: item.logoUrl.url }}
                    style={{
                        height: 60,
                        width: 60,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: COLORS.gray2
                    }}
                />
                <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                    <Text style={styles.heading}>{item.title}</Text>
                    <View style={{ flexDirection: "row", justifyContent: 'space-between', width: SIZES.width - 100 }}>
                        <Text style={styles.small}>Service Availability:</Text>
                        <View style={{ flex: 1 }} />
                        <View style={{ backgroundColor: item.isAvailable ? 'green' : 'red', borderRadius: 30 }}>
                            <Text
                                style={[
                                    styles.small, {
                                        color: 'white',
                                        marginHorizontal: 5
                                    }
                                ]}
                            >
                                {item.isAvailable ? 'Open' : 'Closed'}
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
                </View>
            </View>

            {/* <Divider /> */}
        </TouchableOpacity>
    )
}

export default RestaurantStoreComponent

const styles = StyleSheet.create({
    heading: {
        fontSize: 14,
        fontFamily: "regular",
        color: COLORS.black,
        marginTop: 3,
    },
    badge: {
        borderRadius: 15
    },
    small: {
        fontSize: 12,
        fontFamily: "regular",
        color: COLORS.gray,
    }
})
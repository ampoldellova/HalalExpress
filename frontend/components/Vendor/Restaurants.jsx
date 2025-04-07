import { FlatList, StyleSheet, View } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { RestaurantContext } from '../../contexts/RestaurantContext'
import StoreComponent from './StoreComponent'

const Restaurants = ({ restaurants }) => {
    const navigation = useNavigation();
    const { restaurantObj, setRestaurantObj } = useContext(RestaurantContext);

    return (
        <View style={{ marginLeft: 12 }}>
            <FlatList
                data={restaurants}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 5, rowGap: 10 }}
                scrollEnabled
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <StoreComponent item={item} onPress={() => { navigation.navigate('restaurant-page', item), setRestaurantObj(item) }} />
                )}
            />
        </View>
    )
}

export default Restaurants

const styles = StyleSheet.create({})
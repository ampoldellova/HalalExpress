import { View, FlatList } from 'react-native'
import React from 'react'
import FoodComponent from './FoodComponent'
import { useNavigation } from '@react-navigation/native'

const Foods = ({ foods }) => {
    const navigation = useNavigation();

    return (
        <View style={{ marginLeft: 12, marginBottom: 10 }}>
            <FlatList
                data={foods}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 5, rowGap: 10 }}
                scrollEnabled
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                    <FoodComponent item={item} onPress={() => navigation.navigate('food-nav', item)} />
                )}
            />
        </View>
    )
}

export default Foods
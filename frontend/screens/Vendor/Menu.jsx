import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import CategoryFoodComp from '../../components/Categories/CategoryFoodComp'
import axios from 'axios'
import baseUrl from '../../assets/common/baseUrl'
import ClosedWindow from '../../components/Vendor/ClosedWindow'

const Menu = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [foods, setFoods] = useState([]);
    const item = route.params;

    const fetchRestaurantFoods = async () => {
        try {
            const response = await axios.patch(`${baseUrl}/api/foods/restaurant/${item._id}`, {});
            setFoods(response.data);
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Unable to toggle availability.');
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchRestaurantFoods()
        }, [])
    );
    
    return (
        <View style={{ marginTop: 5, marginBottom: 80 }}>
            {item.isAvailable ? (
                <FlatList
                    data={foods}
                    showsVerticalScrollIndicator={false}
                    style={{ marginTop: 5 }}
                    scrollEnabled
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={{ alignItems: 'center' }}>
                            <CategoryFoodComp item={item} onPress={() => navigation.navigate('food-nav', item)} />
                        </View>
                    )}
                />
            ) : (
                <ClosedWindow />
            )}
        </View>
    )
}

export default Menu

const styles = StyleSheet.create({})
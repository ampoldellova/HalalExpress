import { FlatList, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import baseUrl from '../../assets/common/baseUrl'
import axios from 'axios'
import Loader from '../Loader'
import RestaurantStoreComponent from './RestaurantStoreComponent'

const UserRestaurants = ({ user }) => {
    const navigation = useNavigation();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    const getRestaurantsByOwner = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                const config = {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    },
                };

                const response = await axios.get(`${baseUrl}/api/restaurant/owner/${user?._id}`, config);
                setRestaurants(response.data.data);
                setLoading(false)
            } else {
                console.log("Authentication token not found");
            }
        } catch (err) {
            console.error("Error fetching user restaurants:", err);
            setError(err.message || "Failed to fetch restaurants.");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getRestaurantsByOwner()
        }, [])
    );

    return (
        <View style={{ marginLeft: 12 }}>
            {loading ? (
                <Loader />
            ) : (
                <FlatList
                    data={restaurants}
                    showsVerticalScrollIndicator={false}
                    style={{ marginTop: 5, rowGap: 10 }}
                    scrollEnabled
                    renderItem={({ item }) => (
                        <RestaurantStoreComponent item={item} onPress={() => { navigation.navigate('user-restaurant-page', item) }} />
                    )} />
            )}
        </View>
    )
}

export default UserRestaurants

const styles = StyleSheet.create({})
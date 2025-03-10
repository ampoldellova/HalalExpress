import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useState } from 'react'
import { COLORS, SIZES } from '../../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from '../../assets/common/baseUrl';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const CartProducts = ({ item, getCartItems }) => {
    const [user, setUser] = useState({});

    const getUser = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                const config = {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    },
                };

                const response = await axios.get(`${baseUrl}/api/users/profile`, config);
                setUser(response.data)
            } else {
                console.log("Authentication token not found");
            }
        } catch (error) {
            console.log("Error fetching profile:", error);
        }
    };


    const increment = async (foodId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,

                }
            };

            await axios.patch(`${baseUrl}/api/cart/increment/${foodId}`, {}, config);
            getCartItems();
        } catch (error) {
            console.log(error);
        }
    };

    const decrement = async (foodId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,

                }
            };

            await axios.patch(`${baseUrl}/api/cart/decrement/${foodId}`, {}, config);
            getCartItems();
        } catch (error) {
            console.log(error);
        }
    };

    const removeItem = async (foodId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(token)}`,
                }
            };
            await axios.delete(`${baseUrl}/api/cart/remove-food?userId=${user._id}&foodId=${foodId}`, config);
            getCartItems();
        } catch (error) {
            console.log(error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getUser()
        }, [])
    );

    return (
        <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: item.foodId.imageUrl.url }} style={styles.image} />
            <View style={{ flexDirection: 'column', marginLeft: 10, width: SIZES.width / 1.6 }}>
                <Text style={{ fontFamily: 'bold' }}>{item.foodId.title}</Text>
                {item.additives.length > 0 ? (
                    <FlatList
                        data={item.additives}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ rowGap: 10 }}
                        scrollEnabled
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={({ item: additive, index }) => (
                            <Text style={{ fontFamily: 'regular', color: COLORS.gray, fontSize: 12 }}>
                                {additive.title}{index < item.additives.length - 1 ? ', ' : ''}
                            </Text>
                        )}
                    />
                ) : (
                    <Text style={{ fontFamily: 'regular', color: COLORS.gray, fontSize: 12 }}>No additives</Text>
                )}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                    <View style={{ padding: 5, borderWidth: 1, borderColor: COLORS.gray, borderRadius: 15, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => { }}>
                            {item.quantity === 1 ? (
                                <TouchableOpacity onPress={() => removeItem(item.foodId._id)}>
                                    <FontAwesome name="trash-o" size={18} color="black" />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={() => decrement(item.foodId._id)}>
                                    <AntDesign name="minuscircleo" size={18} color="black" />
                                </TouchableOpacity>
                            )}
                        </TouchableOpacity>
                        <Text style={{ fontFamily: 'regular', marginHorizontal: 15 }}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => increment(item.foodId._id)}>
                            <AntDesign name="pluscircleo" size={18} color="black" />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontFamily: 'regular', marginLeft: 10 }}>₱ {item.totalPrice.toFixed(2)}</Text>
                </View>
            </View>
        </View>
    )
}

export default CartProducts

const styles = StyleSheet.create({
    image: {
        height: 80,
        width: 80,
        borderRadius: 15
    },
})
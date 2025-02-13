import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react'
import { COLORS, SIZES } from '../../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from '../../assets/common/baseUrl';
import axios from 'axios';

const CartProducts = ({ item, getCartItems }) => {
    const increment = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            };

            console.log('Incrementing foodId:', item.foodId._id);
            console.log('Base URL:', baseUrl);

            const response = await axios.get(`${baseUrl}/api/cart/increment/${item.foodId._id}`, config);
            console.log('Response:', response.data);
            // getCartItems();
        } catch (error) {
            console.log('Error:', error.message);
        }
    };



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
                                <FontAwesome name="trash-o" size={18} color="black" />
                            ) : (
                                <AntDesign name="minuscircleo" size={18} color="black" />
                            )}
                        </TouchableOpacity>
                        <Text style={{ fontFamily: 'regular', marginHorizontal: 15 }}>{item.quantity}</Text>
                        <TouchableOpacity onPress={increment}>
                            <AntDesign name="pluscircleo" size={18} color="black" />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontFamily: 'regular', marginLeft: 10 }}>₱ {item.totalPrice}</Text>
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
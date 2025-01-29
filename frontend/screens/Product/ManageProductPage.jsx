import { Alert, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import BackBtn from '../../components/BackBtn'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import baseUrl from '../../assets/common/baseUrl'
import Loader from '../../components/Loader'
import ManageProductCard from '../../components/Products/ManageProductCard'

const ManageProductPage = () => {
    const route = useRoute();
    const supplierId = route.params;
    const navigation = useNavigation();
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log(supplierId)

    const fetchRestaurantFoods = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                const config = {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    },
                };
                const response = await axios.patch(`${baseUrl}/api/ingredients/supplier/${supplierId}`, {}, config);
                setIngredients(response.data);
                setLoading(false)
            } else {
                console.log("Authentication token not found");
            }
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
        <SafeAreaView>
            {loading ? (
                <Loader />
            ) : (
                <View style={{ marginHorizontal: 20, marginTop: 30 }}>
                    <BackBtn onPress={() => navigation.goBack()} />
                    <Text style={styles.heading}>Manage Products</Text>
                    <FlatList
                        data={ingredients}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled
                        style={{ marginBottom: 100 }}
                        renderItem={({ item }) => (
                            <ManageProductCard item={item} onPress={() => { navigation.navigate('supplier-product-page', item) }} />
                        )} />
                </View>
            )}
        </SafeAreaView>
    )
}

export default ManageProductPage

const styles = StyleSheet.create({
    heading: {
        fontFamily: 'bold',
        fontSize: 24,
        textAlign: 'center',
        marginTop: 10
    }
})
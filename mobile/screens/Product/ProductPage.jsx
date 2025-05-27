import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import BackBtn from '../../components/BackBtn';
import DeleteButton from '../../components/DeleteButton';
import { COLORS, SIZES } from '../../styles/theme';
import baseUrl from '../../assets/common/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ProductAvailability from '../../components/Products/ProductAvailability';

const ProductPage = () => {
    const [loader, setLoader] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const route = useRoute();
    const item = route.params
    const navigation = useNavigation();

    const consentForm = async () => {
        Alert.alert('Warning ⚠️', 'Are you sure you want to delete this product?', [
            {
                text: 'Cancel',
                onPress: () => { },
            },
            {
                text: 'OK',
                onPress: () => deleteProduct()
            }
        ]);
    }

    const deleteProduct = async () => {
        setLoader(true);
        try {
            const token = await AsyncStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                }
            }
            await axios.delete(`${baseUrl}/api/ingredients/${item._id}`, config);
            Alert.alert('Success ✅', 'Product deleted successfully!', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack()
                }]);
            setLoader(false);
            setIsValid(false);
        } catch (error) {
            console.log(error.response.data.message);
        }
    }

    return (
        <View style={{ marginHorizontal: 20, marginTop: 15 }}>
            <BackBtn onPress={() => navigation.goBack()} />
            <Text style={styles.heading}>Product Details</Text>
            <Image
                source={{ uri: item.imageUrl.url }}
                style={styles.imageUrl}
            />
            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                <Text style={styles.title}>{item.title}</Text>
            </View>
            <Text style={styles.small}>{item.description}</Text>
            <Text style={styles.options}>Options</Text>
            <ProductAvailability availability={item.isAvailable} id={item._id} />
            <DeleteButton title="D E L E T E   P R O D U C T" loader={loader} isValid={isValid} onPress={() => consentForm()} />
        </View>
    )
}

export default ProductPage

const styles = StyleSheet.create({
    heading: {
        fontFamily: 'bold',
        fontSize: 24,
        textAlign: 'center',
        marginTop: 10
    },
    imageUrl: {
        height: SIZES.height / 5.8,
        width: SIZES.width - 38,
        borderRadius: 15,
        marginTop: 10,
    },
    title: {
        fontFamily: 'medium',
        fontSize: 22,
        marginTop: 10
    },
    small: {
        fontSize: 13,
        fontFamily: 'regular',
        color: COLORS.gray,
        textAlign: "left",
    },
    options: {
        fontFamily: "bold",
        fontSize: 18,
        marginTop: 35
    },
    icon: {
        marginTop: 15
    },
    deleteBtn: {
        fontSize: 16,
        fontFamily: "regular",
        marginTop: 15,
        left: -50
    }
})
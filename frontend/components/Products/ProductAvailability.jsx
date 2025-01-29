import { Alert, StyleSheet, Switch, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { COLORS, SIZES } from '../../styles/theme';
import baseUrl from '../../assets/common/baseUrl';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const ProductAvailability = ({ availability, id }) => {
    const [isAvailable, setIsAvailable] = useState(false);

    useEffect(() => {
        setIsAvailable(availability);
    }, [availability]);

    const toggleAvailability = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                const config = {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    },
                };
                const response = await axios.patch(`${baseUrl}/api/ingredients/${id}`, {}, config);
                setIsAvailable(response.data.isAvailable);
                Alert.alert('Success ✅', response.data.message);
            } else {
                console.log("Authentication token not found");
            }
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Unable to toggle availability.');
        }
    };

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: SIZES.width - 38 }}>
            <View style={{ flexDirection: 'column' }}>
                <MaterialCommunityIcons name="food-halal" size={20} color={COLORS.gray} style={styles.icon} />
            </View>
            <Text style={styles.isAvailable}>Product Availability</Text>
            <Switch
                value={isAvailable}
                onValueChange={toggleAvailability}
                trackColor={{ false: COLORS.red, true: COLORS.primary }}
                thumbColor={isAvailable ? COLORS.primary : COLORS.red}
            />
        </View>
    )
}

export default ProductAvailability

const styles = StyleSheet.create({
    icon: {
        marginTop: 15
    },
    isAvailable: {
        fontSize: 16,
        fontFamily: "regular",
        marginTop: 15,
        left: -50
    }
})
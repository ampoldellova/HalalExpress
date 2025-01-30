import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import baseUrl from '../../assets/common/baseUrl';
import { COLORS } from '../../styles/theme';

const DeleteAddress = ({ addressId, getUserAddresses }) => {
    const [loader, setLoader] = useState(false);

    const consentForm = () => {
        Alert.alert('Warning ⚠️', 'Are you sure you want to delete this address?', [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'OK',
                onPress: () => deleteAddress()
            }
        ]);
    }

    const deleteAddress = async () => {
        setLoader(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const config = {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    }
                }

                await axios.delete(`${baseUrl}/api/users/address/${addressId}`, config);
                Alert.alert('Success ✅', 'Address deleted successfully!');
                getUserAddresses();
                setLoader(false);
            } else {
                console.log("Authentication token not found");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <TouchableOpacity onPress={consentForm}>
            <Feather name="trash-2" size={24} color={COLORS.red} style={{ marginLeft: 5 }} />
        </TouchableOpacity>
    )
}

export default DeleteAddress;

const styles = StyleSheet.create({});
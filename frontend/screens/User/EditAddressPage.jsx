import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../styles/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { UserLocationContext } from '../../contexts/UserLocationContext';
import Button from '../../components/Button';
import * as Location from 'expo-location';
import * as Yup from 'yup';
import AddressSuggestions from '../../components/AddressSuggestions';
import baseUrl from '../../assets/common/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Formik } from 'formik';

const validationSchema = Yup.object().shape({
    coords: Yup.object().shape({
        address: Yup.string().required('Address is required'),
    })
});

const EditAddressPage = () => {
    const router = useRoute();
    const item = router.params;
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loader, setLoader] = useState(false);
    const [address, setAddress] = useState(item?.address);
    const navigation = useNavigation();
    const [region, setRegion] = useState({
        latitude: item?.latitude,
        longitude: item?.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const handleSuggestionPress = (suggestion) => {
        setAddress(suggestion.formatted);
        setSuggestions([]);
        setRegion({
            latitude: suggestion.lat,
            longitude: suggestion.lon,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
        });
    };

    const handleAddressChange = async (text) => {
        setAddress(text);
        fetchSuggestions(text);
        setFieldValue('coords.address', text);
    };

    const inValidForm = () => {
        Alert.alert("Invalid Form 🚨", "Please provide all required fields", [
            {
                text: "Continue",
                onPress: () => { },
            },
        ]);
    };

    const fetchSuggestions = async (text) => {
        const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&format=json&apiKey=7540990e27fa4d198afeb6d69d3c048e`);
        const data = await response.json();
        setSuggestions(data.results);
    };

    const useCurrentLocation = async () => {
        setLoader(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });

        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=a153a349ad474d8bb67e62bf4dadfa04`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.results && data.results.length > 0) {
                    const currentAddress = data.results[0].formatted;
                    handleAddressChange(currentAddress);
                    setAddress(currentAddress);
                } else {
                    throw new Error('No results found');
                }
            })
            .catch(error => {
                console.error('Error fetching geocoding data:', error);
            })
            .finally(() => {
                setLoader(false);
            });
    };

    const editAddress = async (values) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    },
                };

                const data = {
                    addressId: item._id,
                    newAddress: {
                        address: values.coords.address,
                        latitude: region.latitude,
                        longitude: region.longitude,
                    },
                };

                await axios.put(`${baseUrl}/api/users/address`, data, config);
                Alert.alert('Success ✅', 'Address edited successfully!', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);
            } else {
                console.log('Authorization token not found');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <SafeAreaView style={{ marginHorizontal: 20 }}>
                <Text style={styles.heading}>Edit Address</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: -32 }}>
                    <Ionicons
                        name='chevron-back-circle'
                        size={30}
                        color={COLORS.primary}
                    />
                </TouchableOpacity>
                <Formik
                    initialValues={{
                        coords: {
                            address: address,
                        },
                    }}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        editAddress(values);
                    }}
                >
                    {({
                        touched,
                        handleSubmit,
                        errors,
                        isValid,
                        values,
                        setFieldTouched,
                        setFieldValue
                    }) => (
                        <View>
                            <View style={[styles.inputWrapper(touched.coords?.address ? COLORS.secondary : COLORS.offwhite), { height: 'auto' }]}>
                                {loader ? (
                                    <ActivityIndicator size="small" color={COLORS.primary} style={{ marginRight: 5 }} />
                                ) : (
                                    <TouchableOpacity onPress={useCurrentLocation}>
                                        <FontAwesome6
                                            style={styles.iconStyle}
                                            color={COLORS.primary}
                                            name="location-crosshairs"
                                            size={20}
                                        />
                                    </TouchableOpacity>
                                )}
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Search for your address..."
                                    placeholderTextColor={COLORS.gray}
                                    value={address}
                                    onChangeText={(text) => {
                                        handleAddressChange(text)
                                        setFieldValue('coords.address', text)
                                    }}
                                    onFocus={() => {
                                        setFieldTouched('coords.address', '');
                                    }}
                                    onBlur={() => {
                                        setFieldTouched('coords.address');
                                    }}
                                />
                            </View>
                            {touched.coords?.address && errors.coords?.address && (
                                <Text style={styles.errorMessage}>{errors.coords?.address}</Text>
                            )}
                            <AddressSuggestions suggestions={suggestions} onSuggestionPress={handleSuggestionPress} />

                            <View style={styles.container}>
                                <MapView style={{ height: SIZES.height / 2 }} region={{ latitude: region?.latitude, longitude: region?.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }}>
                                    <Marker coordinate={{ latitude: region?.latitude, longitude: region?.longitude }} />
                                </MapView>
                            </View>

                            <Button
                                loader={loading}
                                title="E D I T   A D D R E S S"
                                onPress={isValid ? handleSubmit : inValidForm}
                                isValid={isValid}
                            />
                        </View>
                    )}
                </Formik>
            </SafeAreaView>
        </ScrollView >
    )
}

export default EditAddressPage

const styles = StyleSheet.create({
    heading: {
        fontFamily: 'bold',
        fontSize: 24,
        textAlign: 'center',
        marginTop: 5
    },
    textInput: {
        flex: 1,
        fontFamily: 'regular',
        marginTop: 2
    },
    inputWrapper: (borderColor) => ({
        borderColor: borderColor,
        backgroundColor: COLORS.lightWhite,
        borderWidth: 1,
        height: 50,
        borderRadius: 12,
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: "center",
        marginTop: 10
    }),
    iconStyle: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    container: {
        borderWidth: 1,
        marginTop: 10,
        borderColor: COLORS.gray2,
        borderRadius: 15,
        overflow: 'hidden',
    },
    errorMessage: {
        color: COLORS.red,
        fontFamily: "regular",
        marginTop: 5,
        marginLeft: 5,
        fontSize: SIZES.xSmall
    },
})
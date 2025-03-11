import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBtn from '../components/BackBtn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from '../assets/common/baseUrl';
import axios from 'axios';
import { SIZES, COLORS } from '../styles/theme';
import MapView, { Marker } from 'react-native-maps';
import { UserLocationContext } from '../contexts/UserLocationContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { UserReversedGeoCode } from '../contexts/UserReversedGeoCode';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BottomModal, ModalContent, SlideAnimation } from 'react-native-modals';

const CheckoutPage = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { cart } = route.params;
    const [addresses, setAddresses] = useState([]);
    const { address, setAddress } = useContext(UserReversedGeoCode);
    const { location, setLocation } = useContext(UserLocationContext);
    const [showAddresses, setShowAddresses] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedAddressLat, setSelectedAddressLat] = useState(null);
    const [selectedAddressLng, setSelectedAddressLng] = useState(null);

    const getUserAddresses = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const config = {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    }
                }

                const response = await axios.get(`${baseUrl}/api/users/address/list`, config);
                setAddresses(response.data.addresses);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getUserAddresses();
        }, [])
    );

    useEffect(() => {
        if (location !== null) {
            reverseGeoCode(location?.coords?.latitude, location?.coords?.longitude)
        }
    }, [location]);

    const reverseGeoCode = async (latitude, longitude) => {
        const reverseGeoCodedAddress = await Location.reverseGeocodeAsync({
            longitude: longitude,
            latitude: latitude
        });
        setAddress(reverseGeoCodedAddress[0]);
    };

    const formatAddress = (address) => {
        const parts = address.split(',');
        return parts.slice(0, 2).join(',');
    };

    const formatCity = (address) => {
        const parts = address.split(',');
        if (parts.length > 1) {
            const cityParts = parts[1].trim().split(' ');
            return cityParts[0];
        }
        return parts[0];
    };

    return (
        <SafeAreaView>
            <View style={{ marginHorizontal: 20, marginTop: 15 }}>
                <BackBtn onPress={() => navigation.goBack()} />
                <Text style={styles.heading}>Check Out</Text>

                <View style={{ borderColor: COLORS.gray2, height: 'auto', borderWidth: 1, borderRadius: 10, marginTop: 20, padding: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, width: '100%', justifyContent: 'space-between', marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../assets/images/location.png')} style={{ width: 25, height: 25 }} />
                            <Text style={{ fontFamily: 'bold', fontSize: 18, marginLeft: 5 }}>Delivery Address</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => setShowAddresses(true)}>
                                <FontAwesome name="pencil" size={20} color={COLORS.black} style={{ marginRight: 5 }} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.mapContainer}>
                        <MapView
                            style={{ height: SIZES.height / 5.2 }}
                            region={{
                                latitude: selectedAddressLat === null ? location?.coords?.latitude : selectedAddressLat,
                                longitude: selectedAddressLng === null ? location?.coords?.longitude : selectedAddressLng,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01
                            }}>
                            <Marker
                                title='Your Location'
                                coordinate={{
                                    latitude: selectedAddressLat === null ? location?.coords?.latitude : selectedAddressLat,
                                    longitude: selectedAddressLng === null ? location?.coords?.longitude : selectedAddressLng,
                                }} />
                        </MapView>
                    </View>

                    <View style={{ flexDirection: 'column', marginBottom: 10 }}>
                        <Text style={{ fontFamily: 'bold', fontSize: 16, marginTop: 5 }}>{formatAddress(selectedAddress === null ? address.formattedAddress : selectedAddress)}</Text>
                        <Text style={{ fontFamily: 'regular', fontSize: 14, marginTop: -5 }}>{formatCity(selectedAddress === null ? address.city : selectedAddress)}</Text>
                    </View>

                    <Text style={styles.label}>Delivery note</Text>
                    <View style={styles.inputWrapper(COLORS.offwhite)}>
                        <MaterialIcons name="notes" size={20} color={COLORS.gray} style={{ marginTop: 10, marginRight: 5 }} />
                        <TextInput
                            multiline
                            numberOfLines={3}
                            placeholder="Add your note here..."
                            autoCapitalize="none"
                            autoCorrect={false}
                            style={styles.textInput}
                        />
                    </View>
                </View>
            </View>

            <BottomModal
                visible={showAddresses}
                onTouchOutside={() => setShowAddresses(false)}
                swipeThreshold={100}
                modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
                onHardwareBackPress={() => setShowAddresses(false)}
            >
                <ModalContent style={{ height: 300, width: '100%' }}>
                    <Text style={{ fontFamily: 'bold', fontSize: 20, marginBottom: 5 }}> Saved Addresses</Text>

                    <FlatList
                        data={addresses}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedAddress(selectedAddress === item.address ? null : item.address);
                                    setSelectedAddressLat(selectedAddressLat === item.latitude ? null : item.latitude);
                                    setSelectedAddressLng(selectedAddressLng === item.longitude ? null : item.longitude);
                                }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 10,
                                    borderWidth: 1,
                                    padding: 10,
                                    borderRadius: 10,
                                    borderColor: selectedAddress === item.address ? COLORS.primary : COLORS.gray2
                                }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={require('../assets/images/location.png')} style={{ width: 30, height: 30, marginLeft: 5 }} />
                                    <View style={{ flex: 1, height: 60, justifyContent: 'center' }}>
                                        <Text style={{ fontFamily: 'regular', fontSize: 14, marginLeft: 10, color: COLORS.gray }} numberOfLines={3} ellipsizeMode='tail'>{item.address}</Text>
                                    </View>
                                </View>
                                {console.log(selectedAddress)}
                                {console.log(selectedAddressLat)}
                                {console.log(selectedAddressLng)}
                            </TouchableOpacity>
                        )}
                        ListFooterComponent={
                            <TouchableOpacity onPress={() => { navigation.navigate('add-address-page'); setShowAddresses(false) }} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, borderWidth: 1, borderRadius: 10, borderColor: COLORS.gray2 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                                    <MaterialIcons name="add" size={30} color={COLORS.gray2} />
                                    <View style={{ flex: 1, height: 50, justifyContent: 'center' }}>
                                        <Text style={{ fontFamily: 'regular', fontSize: 14, marginLeft: 10, color: COLORS.gray }}>Add New Address</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        }
                    />

                </ModalContent>
            </BottomModal>
        </SafeAreaView>
    )
}

export default CheckoutPage

const styles = StyleSheet.create({
    heading: {
        fontFamily: 'bold',
        fontSize: 24,
        textAlign: 'center',
        marginTop: 10
    },
    mapContainer: {
        width: "100%",
        height: "auto",
        borderColor: COLORS.gray2,
        borderWidth: 1,
        borderRadius: 15,
        overflow: 'hidden',
    },
    label: {
        fontFamily: "regular",
        fontSize: SIZES.xSmall,
        marginBottom: 5,
        textAlign: 'right'
    },
    textInput: {
        flex: 1,
        fontFamily: 'regular',
        marginTop: 2,
        marginTop: 10,
    },
    inputWrapper: (borderColor) => ({
        borderColor: borderColor,
        backgroundColor: COLORS.lightWhite,
        borderWidth: 1,
        height: 80,
        borderRadius: 12,
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: 'flex-start',
    }),
})
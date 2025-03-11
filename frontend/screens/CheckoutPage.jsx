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
import { Feather } from '@expo/vector-icons';
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

    return (
        <SafeAreaView>
            <View style={{ marginHorizontal: 20, marginTop: 15 }}>
                <BackBtn onPress={() => navigation.goBack()} />
                <Text style={styles.heading}>Check Out</Text>

                <View style={{ borderColor: COLORS.gray2, height: SIZES.height / 2.1, borderWidth: 1, borderRadius: 10, marginTop: 20, padding: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, width: '100%', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../assets/images/location.png')} style={{ width: 25, height: 25 }} />
                            <Text style={{ fontFamily: 'bold', fontSize: 18, marginLeft: 5 }}>Delivery Address</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => setShowAddresses(true)}>
                                <FontAwesome name="pencil" size={20} color={COLORS.black} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.mapContainer}>
                        <MapView style={{ height: SIZES.height / 5.2 }} region={{ latitude: location?.coords?.latitude, longitude: location?.coords?.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }}>
                            <Marker title='Your Location' coordinate={{ latitude: location?.coords?.latitude, longitude: location?.coords?.longitude }} />
                        </MapView>
                    </View>

                    <View style={{ flexDirection: 'column', marginBottom: 10 }}>
                        <Text style={{ fontFamily: 'bold', fontSize: 16, marginTop: 5 }}>{formatAddress(address.formattedAddress)}</Text>
                        <Text style={{ fontFamily: 'regular', fontSize: 14, marginTop: -5 }}>{address.city}</Text>
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
                swipeDirection={["up", "down"]}
                swipeThreshold={200}
                modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
                onHardwareBackPress={() => setShowAddresses(false)}>
                <ModalContent style={{ width: "100%", height: 400 }}>

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
        height: "40%",
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
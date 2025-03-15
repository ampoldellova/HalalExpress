import React, { useState, useEffect, useContext } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { UserReversedGeoCode } from '../contexts/UserReversedGeoCode';
import { UserLocationContext } from '../contexts/UserLocationContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from '../assets/common/baseUrl';
import axios from 'axios';
import { COLORS, SIZES } from '../styles/theme';
import { BottomModal, ModalContent, SlideAnimation } from 'react-native-modals';



const HomeHeader = () => {
    const [showAddresses, setShowAddresses] = useState(false);
    const { address, setAddress } = useContext(UserReversedGeoCode);
    const [addresses, setAddresses] = useState([]);
    const { location, setLocation } = useContext(UserLocationContext);
    const navigation = useNavigation();
    const [user, setUser] = useState(null);

    const getProfile = async () => {
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
            getProfile();
            getUserAddresses();
        }, [])
    )
    console.log(addresses);

    useEffect(() => {
        if (location !== null) {
            reverseGeoCode(location.coords.latitude, location.coords.longitude)
        }
    }, [location]);

    const reverseGeoCode = async (latitude, longitude) => {
        const reverseGeoCodedAddress = await Location.reverseGeocodeAsync({
            longitude: longitude,
            latitude: latitude
        });
        setAddress(reverseGeoCodedAddress[0]);
    };

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <TouchableOpacity onPress={() => setShowAddresses(true)} style={styles.outerStyle}>
                <Image
                    source={{
                        uri: user?.profile?.url
                            ? user.profile.url
                            : "https://res.cloudinary.com/dwkmutbz3/image/upload/v1736011952/HalalExpress/Profile/profile_nsvdbb.png",
                    }}
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 99,
                    }}
                />
                <View style={styles.headerStyle}>
                    <Text style={styles.heading}>Delivering to:</Text>
                    <Text style={styles.location}>{`${address?.city} ${address?.name}`}</Text>
                </View>
            </TouchableOpacity>

            {user && (
                <View style={styles.message}>
                    <TouchableOpacity onPress={() => navigation.navigate('chat-list')}>
                        <MaterialCommunityIcons name='message-reply-text' size={24} color={COLORS.secondary} />
                    </TouchableOpacity>
                </View>
            )}

            <BottomModal
                visible={showAddresses}
                onTouchOutside={() => setShowAddresses(false)}
                swipeThreshold={100}
                modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
                onHardwareBackPress={() => setShowAddresses(false)}
            >
                <View style={{ height: 10, backgroundColor: COLORS.primary, width: SIZES.width, justifyContent: 'center', alignItems:'center' }} >
                    <View style={{ height: 3, backgroundColor: COLORS.secondary, width: SIZES.width / 5, borderRadius: 10 }} />
                </View>
                <ModalContent style={{ height: SIZES.height / 2, width: '100%' }}>
                    {user ? (
                        <Text>Logined and have addresses</Text>
                    ) : (
                        <Text>Please login first</Text>
                    )}
                </ModalContent>
            </BottomModal>
        </View>
    )
}

export default HomeHeader

const styles = StyleSheet.create({
    outerStyle: {
        marginBottom: 10,
        marginHorizontal: 20,
        flexDirection: 'row'
    },
    headerStyle: {
        marginLeft: 15,
        justifyContent: "center"
    },
    heading: {
        fontFamily: 'medium',
        fontSize: SIZES.medium,
        color: COLORS.secondary
    },
    location: {
        fontFamily: 'regular',
        fontSize: SIZES.small + 2,
        color: COLORS.gray
    },
    message: {
        marginTop: 15,
        marginRight: 15
    }
})
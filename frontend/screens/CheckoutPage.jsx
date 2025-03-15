import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
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
import Button from '../components/Button';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import GoogleApiServices from '../hook/GoogleApiServices';
import Toast from 'react-native-toast-message';
import Divider from '../components/Divider';
import Loader from '../components/Loader';

const CheckoutPage = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { cart, vendorCart, user } = route.params;
    const [username, setUsername] = useState(user?.username);
    const [email, setEmail] = useState(user?.email);
    const [phone, setPhone] = useState(user?.phone);
    const [image, setImage] = useState(user?.profile?.url);
    const [supplier, setSupplier] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const { address, setAddress } = useContext(UserReversedGeoCode);
    const { location, setLocation } = useContext(UserLocationContext);
    const [showAddresses, setShowAddresses] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedAddressLat, setSelectedAddressLat] = useState(null);
    const [selectedAddressLng, setSelectedAddressLng] = useState(null);
    const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(null);
    const [distanceTime, setDistanceTime] = useState({});
    const [deliveryFee, setDeliveryFee] = useState(selectedDeliveryOption === 'standard' ? distanceTime.finalPrice : 0);
    const [editProfile, setEditProfile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

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

    const fetchRestaurant = async () => {
        if (cart?.cartItems.length > 0) {
            const restaurantId = cart.cartItems[0].foodId.restaurant;
            try {
                const response = await axios.get(`${baseUrl}/api/restaurant/byId/${restaurantId}`);
                setRestaurant(response.data.data);
            } catch (error) {
                console.error('Error fetching restaurant data:', error);
            }
        }
    };

    const fetchSupplier = async () => {
        if (vendorCart?.cartItems.length > 0) {
            const supplierId = vendorCart.cartItems[0].productId.supplier;
            try {
                const response = await axios.get(`${baseUrl}/api/supplier/byId/${supplierId}`);
                setSupplier(response.data.data);
            } catch (error) {
                console.error('Error fetching supplier data:', error);
            }
        }
    };

    const reverseGeoCode = async (latitude, longitude) => {
        const reverseGeoCodedAddress = await Location.reverseGeocodeAsync({
            longitude: longitude,
            latitude: latitude
        });
        setAddress(reverseGeoCodedAddress[0]);
    };

    const handleSubmitForm = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");

            const formData = new FormData();
            if (image.startsWith("file://")) {
                const filename = image.split('/').pop();
                const fileType = filename.split('.').pop();
                formData.append('profile', {
                    uri: image,
                    name: filename,
                    type: `image/${fileType}`,
                });
            }

            formData.append('username', username);
            formData.append('email', email);
            formData.append('phone', phone);

            await axios.put(`${baseUrl}/api/users/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${JSON.parse(token)}`,
                },
            });
            Toast.show({
                type: 'success',
                text1: 'Success ✅',
                text2: 'Profile updated successfully',
            });
            setEditProfile(false);
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Error ❌',
                text2: 'Profile update failed',
            });
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getUserAddresses();
            { user.userType === 'Vendor' ? fetchSupplier() : fetchRestaurant() }
        }, [cart, vendorCart, user])
    );

    useEffect(() => {
        if (location !== null) {
            reverseGeoCode(location?.coords?.latitude, location?.coords?.longitude)
        }
    }, [location]);

    useEffect(() => {
        setLoading(true);
        const origin = user?.userType === 'Vendor' ? supplier?.coords : restaurant?.coords
        const userOriginLat = selectedAddressLat === null ? location?.coords?.latitude : selectedAddressLat
        const userOriginLng = selectedAddressLng === null ? location?.coords?.longitude : selectedAddressLng
        GoogleApiServices.calculateDistanceAndTime(
            origin?.latitude,
            origin?.longitude,
            userOriginLat,
            userOriginLng
        ).then((result) => {
            if (result) {
                setDistanceTime(result);
                setLoading(false);
            }
        });
    }, [supplier, restaurant, selectedAddress]);

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

    const totalTime = distanceTime.duration + GoogleApiServices.extractNumbers(user.userType === 'Vendor' ? supplier?.time : restaurant?.time)[0];

    const isUserDetailsChanged = () => {
        return username !== user?.username || email !== user?.email || phone !== user?.phone || image !== user?.profile?.url;
    };

    return (
        <SafeAreaView>
            {loading ? (
                <Loader />
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} style={{ marginHorizontal: 20, marginTop: 15 }}>
                    <BackBtn onPress={() => navigation.goBack()} />
                    <Text style={styles.heading}>Check Out</Text>

                    {restaurant?.delivery || supplier?.delivery ? (
                        <View style={{ borderColor: COLORS.gray2, height: 'auto', borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 20 }}>
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

                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontFamily: 'bold', fontSize: 16, marginTop: 5 }}>{formatAddress(selectedAddress === null ? address.formattedAddress : selectedAddress)}</Text>
                                <Text style={{ fontFamily: 'regular', fontSize: 14, marginTop: -5 }}>{formatCity(selectedAddress === null ? address.city : selectedAddress)}</Text>
                            </View>

                            <Text style={styles.label}>Delivery note</Text>
                            <View style={styles.notesInputWrapper(COLORS.offwhite)}>
                                <MaterialIcons name="notes" size={20} color={COLORS.gray} style={{ marginTop: 10, marginRight: 5 }} />
                                <TextInput
                                    multiline
                                    numberOfLines={3}
                                    placeholder="Add your note here..."
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    style={[styles.textInput, { marginTop: 10 }]}
                                />
                            </View>
                        </View>
                    ) : (
                        <>
                        </>
                    )}

                    {error && <Text style={[styles.label, { color: COLORS.red, textAlign: 'left' }]}>*Please select a delivery option</Text>}
                    <View style={{ borderColor: COLORS.gray2, height: 'auto', borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Image source={require('../assets/images/options.png')} style={{ width: 25, height: 25 }} />
                            <Text style={{ fontFamily: 'bold', fontSize: 18, marginLeft: 5 }}>Delivery Options</Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                if (restaurant?.delivery) {
                                    setSelectedDeliveryOption('standard');
                                    setDeliveryFee(distanceTime.finalPrice);
                                    selectedDeliveryOption === 'standard' ? (setSelectedDeliveryOption(null), setDeliveryFee(0)) : (setSelectedDeliveryOption('standard'), setDeliveryFee(distanceTime.finalPrice));
                                    setError(false)
                                } else {
                                    setSelectedDeliveryOption(null);
                                    setError(true);
                                }
                            }}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 10,
                                borderWidth: 1,
                                padding: 10,
                                borderRadius: 10,
                                borderColor: selectedDeliveryOption === 'standard' ? COLORS.primary : COLORS.gray2,
                                opacity: restaurant?.delivery ? 1 : 0.5
                            }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', height: 30 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={require('../assets/images/delivery.png')} style={{ width: 20, height: 20, marginLeft: 2.5 }} />
                                        <Text style={{ fontFamily: 'medium', fontSize: 16, marginLeft: 10, color: COLORS.black }}>Standard</Text>
                                    </View>
                                    <Text style={{ fontFamily: 'regular', fontSize: 12, color: COLORS.gray, marginLeft: 5 }}>({totalTime.toFixed(0)} mins)</Text>
                                </View>

                                {restaurant?.delivery ? (
                                    <View style={{ backgroundColor: COLORS.secondary, paddingHorizontal: 5, borderRadius: 10 }}>
                                        <Text style={{ fontFamily: 'bold', fontSize: 12, color: COLORS.white }}>+ ₱{distanceTime.finalPrice}</Text>
                                    </View>
                                ) : (
                                    <Text style={{ fontFamily: 'bold', fontSize: 16, color: COLORS.red }}>Not Available</Text>
                                )}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setSelectedDeliveryOption('pickup');
                                setDeliveryFee(0);
                                selectedDeliveryOption === null ? setError(false) : setSelectedDeliveryOption('pickup');
                                selectedDeliveryOption === 'pickup' ? setSelectedDeliveryOption(null) : setSelectedDeliveryOption('pickup')
                            }}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 10,
                                borderWidth: 1,
                                padding: 10,
                                borderRadius: 10,
                                borderColor: selectedDeliveryOption === 'pickup' ? COLORS.primary : COLORS.gray2
                            }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={require('../assets/images/pickup.png')} style={{ width: 20, height: 20, marginLeft: 2.5 }} />
                                <View style={{ flex: 1, height: 30, justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: 'medium', fontSize: 16, marginLeft: 10, color: COLORS.black }}>Pickup</Text>
                                </View>
                                <Text style={{ fontFamily: 'bold', fontSize: 16, color: COLORS.primary }}>Free</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ borderColor: COLORS.gray2, height: 'auto', borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <Image source={require('../assets/images/persons.png')} style={{ width: 25, height: 25 }} />
                                <Text style={{ fontFamily: 'bold', fontSize: 18, marginLeft: 5 }}>Personal Details</Text>
                            </View>
                            <TouchableOpacity onPress={() => editProfile ? setEditProfile(false) : setEditProfile(true)}>
                                <FontAwesome name="pencil" size={20} color={COLORS.black} style={{ marginRight: 5 }} />
                            </TouchableOpacity>
                        </View>

                        {editProfile ? (
                            <View style={{ marginTop: 10 }}>
                                <View style={{ marginBottom: 10 }}>
                                    <Text style={styles.label}>Username</Text>
                                    <View style={styles.inputWrapper(COLORS.offwhite)}>
                                        <Feather name="user" size={20} color={COLORS.gray} style={{ marginRight: 10 }} />
                                        <TextInput
                                            placeholder="Enter your username"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            style={styles.textInput}
                                            value={username}
                                            onChangeText={(text) => setUsername(text)}
                                        />
                                    </View>
                                </View>

                                <View style={{ marginBottom: 10 }}>
                                    <Text style={styles.label}>Email</Text>
                                    <View style={styles.inputWrapper(COLORS.offwhite)}>
                                        <MaterialCommunityIcons name="email-outline" size={20} color={COLORS.gray} style={{ marginRight: 10 }} />
                                        <TextInput
                                            placeholder="Enter your username"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            style={styles.textInput}
                                            value={email}
                                            onChangeText={(text) => setEmail(text)}
                                        />
                                    </View>
                                </View>

                                <View style={{ marginBottom: 10 }}>
                                    <Text style={styles.label}>Phone number</Text>
                                    <View style={styles.inputWrapper(COLORS.offwhite)}>
                                        <Feather name="phone" size={20} color={COLORS.gray} style={{ marginRight: 10 }} />
                                        <TextInput
                                            placeholder="Enter your username"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            style={styles.textInput}
                                            value={phone}
                                            onChangeText={(text) => setPhone(text)}
                                        />
                                    </View>
                                </View>

                                <Button title="S U B M I T" onPress={isUserDetailsChanged() ? handleSubmitForm : null} isValid={isUserDetailsChanged()} loader={loading} />
                            </View>
                        ) : (
                            <View style={{ marginTop: 10, marginBottom: 5, marginLeft: 5 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                    <Feather name="user" size={20} color={COLORS.gray} />
                                    <Text style={{ fontFamily: 'regular', fontSize: 14, marginLeft: 5 }}>{username}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                    <MaterialCommunityIcons name="email-outline" size={20} color={COLORS.gray} />
                                    <Text style={{ fontFamily: 'regular', fontSize: 14, marginLeft: 5 }}>{email}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                    <Feather name="phone" size={20} color={COLORS.gray} />
                                    <Text style={{ fontFamily: 'regular', fontSize: 14, marginLeft: 5 }}>+{phone}</Text>
                                </View>
                            </View>
                        )}

                    </View>

                    <View style={{ borderColor: COLORS.gray2, height: 'auto', borderWidth: 1, borderRadius: 10, padding: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                            <Text style={{ fontFamily: 'bold', fontSize: 18 }}>Your order from:</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                            <Image source={{ uri: user?.userType === 'Vendor' ? supplier?.logoUrl?.url : restaurant?.logoUrl?.url }} style={{ width: 20, height: 20, borderRadius: 5 }} />
                            <Text style={{ fontFamily: 'regular', fontSize: 14, marginLeft: 5 }}>{user?.userType === 'Vendor' ? supplier?.title : restaurant?.title}</Text>
                        </View>

                        <FlatList
                            style={{ marginBottom: 20 }}
                            data={user?.userType === 'Vendor' ? vendorCart?.cartItems : cart?.cartItems}
                            keyExtractor={(item) => item?._id}
                            renderItem={({ item }) => (
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image source={{ uri: item.foodId.imageUrl.url }} style={{ width: 50, height: 50, borderRadius: 10 }} />
                                        <View style={{ flexDirection: 'column', marginLeft: 10, }}>
                                            <Text style={{ fontFamily: 'regular', fontSize: 14, color: COLORS.gray }}>
                                                {item?.quantity}x {vendorCart?.cartItems ? item?.productId?.title : item?.foodId?.title}
                                            </Text>
                                            {item?.additives.length > 0 ? (
                                                <FlatList
                                                    data={item?.additives}
                                                    keyExtractor={(item) => item._id}
                                                    renderItem={({ item }) => (
                                                        <Text style={{ fontFamily: 'regular', fontSize: 14, color: COLORS.gray, marginLeft: 10 }}>
                                                            + {item?.title}
                                                        </Text>
                                                    )}
                                                />
                                            ) : (
                                                <Text style={{ fontFamily: 'regular', fontSize: 14, color: COLORS.gray, marginLeft: 10 }}>
                                                    - No additives
                                                </Text>
                                            )}

                                        </View>
                                    </View>
                                    <Text style={{ fontFamily: 'regular', fontSize: 14, color: COLORS.gray }}>₱ {item?.totalPrice.toFixed(2)}</Text>
                                </View>
                            )}
                        />

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'regular', fontSize: 14, color: COLORS.gray }}>Subtotal:</Text>
                            <Text style={{ fontFamily: 'regular', fontSize: 14, color: COLORS.gray }}>₱ {cart?.totalAmount.toFixed(2)}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                            <Text style={{ fontFamily: 'regular', fontSize: 14, color: COLORS.gray }}>Delivery Fee:</Text>
                            <Text style={{ fontFamily: 'regular', fontSize: 14, color: COLORS.gray }}>₱ {deliveryFee}</Text>
                        </View>

                        <Divider />

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'bold', fontSize: 24 }}>Total:</Text>
                            <Text style={{ fontFamily: 'bold', fontSize: 24 }}>
                                ₱ {(parseFloat(user.userType === 'Vendor' ? vendorCart?.totalAmount.toFixed(2) : cart?.totalAmount.toFixed(2)) + parseFloat(deliveryFee)).toFixed(2)}
                            </Text>
                        </View>
                    </View>

                    <Button title="P L A C E   O R D E R" onPress={() => { }} />
                </ScrollView >
            )}

            <BottomModal
                visible={showAddresses}
                onTouchOutside={() => setShowAddresses(false)}
                swipeThreshold={100}
                modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
                onHardwareBackPress={() => setShowAddresses(false)}
            >
                <View style={{ height: 10, backgroundColor: COLORS.primary, width: SIZES.width, justifyContent: 'center', alignItems: 'center' }} >
                    <View style={{ height: 3, backgroundColor: COLORS.secondary, width: SIZES.width / 5, borderRadius: 10 }} />
                </View>
                <ModalContent style={{ height: SIZES.height / 2, width: '100%' }}>
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
                            </TouchableOpacity>
                        )}

                    />
                    <TouchableOpacity onPress={() => { navigation.navigate('add-address-page'); setShowAddresses(false) }} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, borderWidth: 1, borderRadius: 10, borderColor: COLORS.gray2, marginBottom: -15 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                            <MaterialIcons name="add" size={30} color={COLORS.gray2} />
                            <View style={{ flex: 1, height: 50, justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'regular', fontSize: 14, marginLeft: 10, color: COLORS.gray }}>Add New Address</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </ModalContent>
            </BottomModal>
        </SafeAreaView >
    )
}

export default CheckoutPage

const styles = StyleSheet.create({
    heading: {
        fontFamily: 'bold',
        fontSize: 24,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20
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
        marginEnd: 5,
        textAlign: "right"
    },
    textInput: {
        flex: 1,
        fontFamily: 'regular',
        marginTop: 2,
    },
    notesInputWrapper: (borderColor) => ({
        borderColor: borderColor,
        backgroundColor: COLORS.lightWhite,
        borderWidth: 1,
        height: 80,
        borderRadius: 12,
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: 'flex-start',
    }),
    inputWrapper: (borderColor) => ({
        borderColor: borderColor,
        backgroundColor: COLORS.lightWhite,
        borderWidth: 1,
        height: 50,
        borderRadius: 12,
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: 'center',
    }),
})
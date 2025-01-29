import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert, Modal, Pressable } from "react-native";
import React, { useState } from "react";
import { COLORS, SIZES } from "../../styles/theme";
import { AntDesign } from "@expo/vector-icons";
import ProfileTile from "../../components/User/ProfileTile";
import RegistrationTile from "../../components/User/RegistrationTile";
import { useDispatch } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { cleanUser } from "../../redux/UserReducer";
import baseUrl from "../../assets/common/baseUrl";
import Heading from "../../components/Heading";
import UserRestaurants from "../../components/Vendor/UserRestaurants";
import { SafeAreaView } from "react-native-safe-area-context";
import pages from "../../styles/page.style";
import SupplierStores from "../../components/Supplier/SupplierStores";


const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [user, setUser] = useState({});

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

    useFocusEffect(
        React.useCallback(() => {
            getProfile()
        }, [])
    );


    const handleLogout = async () => {
        await AsyncStorage.removeItem("id");
        await AsyncStorage.removeItem("token");
        Alert.alert("Logout", "You have been logged out");
        dispatch(cleanUser());
    };

    return (
        <SafeAreaView>
            <View style={pages.viewOne}>
                <View style={pages.viewTwo}>
                    <TouchableOpacity onPress={() => navigation.navigate('edit-profile-page', { user })} style={styles.profile}>
                        <View style={{ flexDirection: "row" }}>
                            <Image
                                source={{ uri: user?.profile?.url }}
                                style={{
                                    height: 45,
                                    width: 45,
                                    borderRadius: 99,
                                }}
                            />
                            <View style={{ marginLeft: 5, marginTop: 3 }}>
                                <Text style={styles.text}>
                                    {user === null ? "username" : user?.username}
                                </Text>
                                <Text style={styles.email}>
                                    {user === null ? "email" : user?.email}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity onPress={handleLogout}>
                            <AntDesign name="logout" size={24} color="red" />
                        </TouchableOpacity>
                    </TouchableOpacity>

                    {user.userType === 'Client' && (
                        <View>
                            <RegistrationTile
                                heading={"Register a restaurant"}
                                desc={
                                    "Join our community and showcase your culinary delights to a wider audience."
                                }
                            />
                            <View
                                style={{
                                    height: 92,
                                    backgroundColor: COLORS.lightWhite,
                                    margin: 10,
                                    borderRadius: 12,
                                }}
                            >
                                <ProfileTile title={"Orders"} icon={"fast-food-outline"} font={1} />
                                <ProfileTile title={"Payment History"} icon={"creditcard"} />
                            </View>
                        </View>
                    )}

                    {user.userType === 'Vendor' && (
                        <View>
                            <Heading heading={'Your Restaurants'} onPress={() => { }} />
                            <UserRestaurants user={user} />
                        </View>
                    )}

                    {user.userType === 'Supplier' && (
                        <View>
                            <Heading heading={'Your Stores'} onPress={() => { }} />
                            <SupplierStores user={user} />
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ProfilePage

const styles = StyleSheet.create({
    text: {
        marginLeft: 10,
        fontFamily: "medium",
        color: COLORS.black,
    },
    email: {
        marginLeft: 10,
        fontFamily: "regular",
        color: COLORS.gray,
    },
    profile: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 20,
        marginTop: 20
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '80%',
        height: '60%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonClose: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    wrapper: {
        marginBottom: 20,
    },
    label: {
        fontFamily: "regular",
        fontSize: SIZES.xSmall,
        marginBottom: 5,
        marginEnd: 5,
        textAlign: "right"
    },
    inputWrapper: (borderColor) => ({
        borderColor: borderColor,
        backgroundColor: COLORS.lightWhite,
        borderWidth: 1,
        height: 50,
        borderRadius: 12,
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: "center"

    }),
})
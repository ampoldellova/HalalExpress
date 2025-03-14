import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState } from 'react';
import { COLORS, SIZES } from '../../styles/theme';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Button from '../../components/Button';
import BackBtn from '../../components/BackBtn';
import baseUrl from '../../assets/common/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";

const validationSchema = Yup.object().shape({
    username: Yup.string().min(3, 'Provide a valid username').required('Required'),
    email: Yup.string().email('Provide a valid email address').required('Required'),
    phone: Yup.string()
        .matches(/^(09\d{9}|639\d{9}|\+639\d{9})$/, 'Provide a valid Philippine phone number')
        .required('Required'),
});

const EditProfilePage = ({ navigation, route }) => {
    const { user } = route.params;
    const [image, setImage] = useState(user.profile.url);
    const [loader, setLoader] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmitForm = async (values) => {
        try {
            setLoader(true);
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

            formData.append('username', values.username);
            formData.append('email', values.email);
            formData.append('phone', values.phone);

            await axios.put(`${baseUrl}/api/users/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${JSON.parse(token)}`,
                },
            });
            Alert.alert('Success ✅', 'Profile updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Error ❌', 'Failed to update profile. Please try again.');
        } finally {
            setLoader(false);
        }
    };

    return (
        <View style={{ marginHorizontal: 20, marginTop: 50 }}>
            <BackBtn onPress={() => navigation.goBack()} />
            <Formik
                initialValues={{
                    username: user.username || '',
                    email: user.email || '',
                    phone: user.phone || '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmitForm}
            >
                {({
                    handleChange,
                    touched,
                    handleSubmit,
                    values,
                    errors,
                    isValid,
                    setFieldTouched
                }) => (
                    <View>
                        <View style={styles.profile}>
                            <Image
                                source={image ? { uri: image } : require('../../assets/images/profile.png')}
                                style={styles.image}
                            />
                            <TouchableOpacity onPress={pickImage} style={styles.imageUpload}>
                                <Entypo
                                    color='white'
                                    name="camera"
                                    size={24}
                                />
                                <Text style={{ color: 'white', fontFamily: 'regular' }}>Edit Photo</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.wrapper}>
                            <Text style={styles.label}>Username</Text>
                            <View
                                style={styles.inputWrapper(
                                    touched.email ? COLORS.secondary : COLORS.offwhite
                                )}
                            >
                                <MaterialCommunityIcons
                                    name="face-man-profile"
                                    size={20}
                                    color={COLORS.gray}
                                    style={styles.iconStyle}
                                />

                                <TextInput
                                    style={{ flex: 1, fontFamily: 'regular' }}
                                    placeholder="Enter username"
                                    onChangeText={handleChange('username')}
                                    onFocus={() => { setFieldTouched('username', '') }}
                                    onBlur={() => { setFieldTouched('username') }}
                                    value={values.username}
                                />
                            </View>
                            {touched.username && errors.username && (
                                <Text style={styles.errorMessage}>{errors.username}</Text>
                            )}
                        </View>

                        {/* Email Field */}
                        <View style={styles.wrapper}>
                            <Text style={styles.label}>Email</Text>
                            <View
                                style={styles.inputWrapper(
                                    touched.email ? COLORS.secondary : COLORS.offwhite
                                )}
                            >
                                <MaterialCommunityIcons
                                    name="email-outline"
                                    size={20}
                                    color={COLORS.gray}
                                    style={styles.iconStyle}
                                />
                                <TextInput
                                    style={{ flex: 1, fontFamily: 'regular' }}
                                    placeholder="Enter email"
                                    onChangeText={handleChange('email')}
                                    onFocus={() => { setFieldTouched('email', '') }}
                                    onBlur={() => { setFieldTouched('email') }}
                                    value={values.email}
                                    keyboardType="email-address"
                                />
                            </View>
                            {touched.email && errors.email && (
                                <Text style={styles.errorMessage}>{errors.email}</Text>
                            )}
                        </View>

                        {/* Phone Field */}
                        <View style={styles.wrapper}>
                            <Text style={styles.label}>Phone</Text>
                            <View
                                style={styles.inputWrapper(
                                    touched.email ? COLORS.secondary : COLORS.offwhite
                                )}
                            >
                                <AntDesign
                                    name="phone"
                                    size={20}
                                    color={COLORS.gray}
                                    style={styles.iconStyle}
                                />
                                <TextInput
                                    style={{ flex: 1, fontFamily: 'regular' }}
                                    placeholder="Enter phone"
                                    onChangeText={handleChange('phone')}
                                    onFocus={() => { setFieldTouched('phone', '') }}
                                    onBlur={() => { setFieldTouched('phone') }}
                                    value={values.phone}
                                    keyboardType="phone-pad"
                                />
                            </View>
                            {touched.phone && errors.phone && (
                                <Text style={styles.errorMessage}>{errors.phone}</Text>
                            )}
                        </View>

                        {/* Submit Button */}
                        <Button
                            title="U P D A T E"
                            onPress={handleSubmit}
                            isValid={isValid}
                            loader={loader}
                        />
                    </View>
                )}
            </Formik>
        </View>
    );
};

export default EditProfilePage;

const styles = StyleSheet.create({
    profile: {
        alignItems: 'center',
        marginVertical: 20,
        position: 'relative',
    },
    image: {
        height: 150,
        width: 150,
        borderRadius: 99,
        borderWidth: 1,
        borderColor: COLORS.gray2,
        marginTop: 30
    },
    imageUpload: {
        position: 'absolute',
        height: 75,
        width: 150,
        borderBottomLeftRadius: 99,
        borderBottomRightRadius: 99,
        backgroundColor: 'rgba(0,0,0,0.5)',
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
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
    iconStyle: {
        marginRight: 10
    },
    errorMessage: {
        color: COLORS.red,
        fontFamily: "regular",
        marginTop: 5,
        marginLeft: 5,
        fontSize: SIZES.xSmall
    },
});

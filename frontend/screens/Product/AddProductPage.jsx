import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import BackBtn from '../../components/BackBtn'
import Button from '../../components/Button'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SIZES } from '../../styles/theme';
import { Entypo, Ionicons, MaterialIcons, FontAwesome6 } from '@expo/vector-icons';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { Formik } from 'formik';
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker';
import * as Yup from "yup";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import baseUrl from '../../assets/common/baseUrl';

const validationSchema = Yup.object().shape({
    title: Yup.string()
        .required('Product Name is required'),
    category: Yup.string()
        .required('Product Category is required'),
    code: Yup.string()
        .required('Product Code is required'),
    supplier: Yup.string()
        .required('Supplier is required'),
    description: Yup.string()
        .required('Product Description is required'),
    price: Yup.number().
        required('Product Price is required'),
    imageUrl: Yup.string()
        .required('Product Picture is required'),
});


const AddProductPage = () => {
    const route = useRoute();
    const supplierId = route.params;
    const navigation = useNavigation();
    const [loader, setLoader] = useState(false);
    const [image, setImage] = useState('');
    const [categories, setCategories] = useState([]);

    const addProductForm = async (values) => {
        setLoader(true);
        try {
            const token = await AsyncStorage.getItem("token");
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${JSON.parse(token)}`,
                },
            }

            const formData = new FormData();
            if (image.startsWith("file://")) {
                const filename = image.split('/').pop();
                const fileType = filename.split('.').pop();
                formData.append('imageUrl', {
                    uri: image,
                    name: filename,
                    type: `image/${fileType}`,
                });
            }

            formData.append('title', values.title);
            formData.append('category', values.category);
            formData.append('code', values.code);
            formData.append('supplier', values.supplier);
            formData.append('description', values.description);
            formData.append('price', values.price);

            await axios.post(`${baseUrl}/api/ingredients/`, formData, config)
            setLoader(false);
            Alert.alert(
                "Success ✅",
                "Product has been added to your menu",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate('manage-product-page', supplierId),
                    },
                ]
            );

        } catch (error) {
            console.log(error)
        }
    }

    const inValidForm = () => {
        Alert.alert("Invalid Form 🚨", "Please provide all required fields", [
            {
                text: "Continue",
                onPress: () => { },
            },
        ]);
    };


    const pickImage = async (setFieldValue) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.cancelled) {
            setFieldValue('imageUrl', result.assets[0].uri);
            setImage(result.assets[0].uri);
        }
    };

    const getCategories = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/supplyCategory/`);
            setCategories(response.data);
        } catch (error) {
            console.log("Error fetching restaurants:", error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getCategories();
        }, [])
    );


    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{ marginHorizontal: 20, marginTop: 15 }}>
                    <BackBtn onPress={() => navigation.goBack()} />
                    <Text style={styles.heading}>Add a Product</Text>
                    <Formik
                        initialValues={{
                            title: '',
                            category: '',
                            code: '',
                            supplier: supplierId,
                            description: '',
                            price: '',
                            imageUrl: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            addProductForm(values);
                            resetForm();
                        }}
                    >
                        {({
                            handleChange,
                            handleBlur,
                            touched,
                            handleSubmit,
                            values,
                            errors,
                            isValid,
                            setFieldTouched,
                            setFieldValue
                        }) => (
                            < View >
                                {console.log(errors)}
                                <Text style={styles.text}>Product Picture</Text>
                                <View style={{ position: 'relative' }}>
                                    <Image
                                        source={image ? { uri: image } : require('../../assets/images/rating_bk.jpg')}
                                        style={styles.image(touched.imageUrl ? COLORS.secondary : COLORS.offwhite)}
                                    />
                                    <TouchableOpacity
                                        style={styles.imageUpload}
                                        onFocus={() => { setFieldTouched('imageUrl') }}
                                        onBlur={() => { setFieldTouched('imageUrl', '') }}
                                        onPress={() => pickImage(setFieldValue)}
                                    >
                                        <Entypo
                                            color='white'
                                            name="camera"
                                            size={24}
                                        />
                                        <Text style={{ color: 'white', fontFamily: 'regular' }}>Upload a photo</Text>
                                    </TouchableOpacity>
                                </View>
                                {touched.imageUrl && errors.imageUrl && (
                                    <Text style={styles.errorMessage}>{errors.imageUrl}</Text>
                                )}

                                <Text style={styles.text}>Product Details</Text>
                                <View style={styles.wrapper}>
                                    <Text style={styles.label}>Product Name</Text>
                                    <View style={styles.inputWrapper(touched.title ? COLORS.secondary : COLORS.offwhite)}>
                                        <Ionicons
                                            style={styles.iconStyle}
                                            color={COLORS.gray}
                                            name="restaurant"
                                            size={20}
                                        />
                                        <TextInput
                                            style={styles.textInput}
                                            placeholderTextColor={COLORS.gray}
                                            placeholder="Enter product name"
                                            onChangeText={handleChange('title')}
                                            onFocus={() => { setFieldTouched('title') }}
                                            onBlur={() => { setFieldTouched('title', '') }}
                                            value={values.title}
                                        />
                                    </View>
                                    {touched.title && errors.title && (
                                        <Text style={styles.errorMessage}>{errors.title}</Text>
                                    )}
                                </View>

                                <View style={styles.wrapper}>
                                    <Text style={styles.label}>Product Description</Text>
                                    <View style={[styles.inputWrapper(touched.description ? COLORS.secondary : COLORS.offwhite), { height: 100, alignItems: 'flex-start' }]}>
                                        <MaterialIcons name="description" size={20} color={COLORS.gray} style={[styles.iconStyle, { marginTop: 15 }]} />
                                        <TextInput
                                            style={[styles.textInput, { marginVertical: 5 }]}
                                            placeholderTextColor={COLORS.gray}
                                            placeholder="Enter product description"
                                            onChangeText={handleChange('description')}
                                            onFocus={() => { setFieldTouched('description') }}
                                            onBlur={() => { setFieldTouched('description', '') }}
                                            value={values.description}
                                            numberOfLines={5}
                                            multiline
                                        />
                                    </View>
                                    {touched.description && errors.description && (
                                        <Text style={styles.errorMessage}>{errors.description}</Text>
                                    )}
                                </View>

                                <View style={styles.wrapper}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        {touched.category && errors.category && (
                                            <Text style={styles.errorMessage}>{errors.category}</Text>
                                        )}
                                        <Text style={styles.label}>Product Category</Text>
                                    </View>
                                    <Dropdown
                                        data={categories}
                                        style={styles.inputWrapper(touched.category ? COLORS.secondary : COLORS.offwhite)}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        placeholderStyle={styles.placeholderStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        iconStyle={styles.iconStyle}
                                        placeholder={'Select product category'}
                                        searchPlaceholder="Search..."
                                        labelField="title"
                                        valueField="_id"
                                        maxHeight={150}
                                        onChange={item => { setFieldValue('category', item._id) }}
                                        onFocus={() => setFieldTouched('category')}
                                        onBlur={() => setFieldTouched('category', '')}
                                        value={values.category}
                                        renderLeftIcon={() => (
                                            <MaterialIcons
                                                style={styles.iconStyle}
                                                color={COLORS.gray}
                                                name="category"
                                                size={20}
                                            />
                                        )}
                                    />
                                </View>

                                <View style={styles.wrapper}>
                                    <Text style={styles.label}>Product Code</Text>
                                    <View style={styles.inputWrapper(touched.code ? COLORS.secondary : COLORS.offwhite)}>
                                        <Entypo
                                            style={styles.iconStyle}
                                            color={COLORS.gray}
                                            name="code"
                                            size={20}
                                        />
                                        <TextInput
                                            style={styles.textInput}
                                            placeholderTextColor={COLORS.gray}
                                            placeholder="Enter product code"
                                            onBlur={() => setFieldTouched('code', '')}
                                            onFocus={() => setFieldTouched('code')}
                                            onChangeText={handleChange('code')}
                                            value={values.code}
                                        />
                                    </View>
                                    {touched.code && errors.code && (
                                        <Text style={styles.errorMessage}>{errors.code}</Text>
                                    )}
                                </View>

                                <View style={styles.wrapper}>
                                    <Text style={styles.label}>Product Price</Text>
                                    <View style={styles.inputWrapper(touched.price ? COLORS.secondary : COLORS.offwhite)}>
                                        <FontAwesome6
                                            style={styles.iconStyle}
                                            color={COLORS.gray}
                                            name="peso-sign"
                                            size={20}
                                        />
                                        <TextInput
                                            style={styles.textInput}
                                            placeholderTextColor={COLORS.gray}
                                            placeholder="Enter product price"
                                            onChangeText={handleChange('price')}
                                            onBlur={() => setFieldTouched('price', '')}
                                            onFocus={() => setFieldTouched('price')}
                                            keyboardType="phone-pad"
                                            value={values.phone}
                                        />
                                    </View>
                                    {touched.price && errors.price && (
                                        <Text style={styles.errorMessage}>{errors.price}</Text>
                                    )}
                                </View>

                                <Button
                                    loader={loader}
                                    title={"S U B M I T"}
                                    onPress={isValid ? handleSubmit : inValidForm}
                                    isValid={isValid}
                                />
                            </View>
                        )}
                    </Formik>
                </View >
            </ScrollView >
        </SafeAreaView>
    )
}

export default AddProductPage

const styles = StyleSheet.create({
    heading: {
        fontFamily: 'bold',
        fontSize: 24,
        textAlign: 'center',
        marginTop: 10
    },
    text: {
        fontFamily: 'bold',
        fontSize: 18,
        marginTop: 20
    },
    textInput: {
        flex: 1,
        fontFamily: 'regular',
        marginTop: 2
    },
    image: (borderColor) => ({
        height: 150,
        width: SIZES.width - 38,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: borderColor
    }),
    imageUpload: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: 75,
        width: SIZES.width - 38,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    wrapper: {
        marginBottom: 20,
    },
    label: {
        fontFamily: "regular",
        fontSize: SIZES.xSmall,
        marginBottom: 5,
        marginEnd: 5,
        textAlign: 'right'
    },
    btnStyle: {
        height: 50,
        width: "100%",
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
    },
    btnTxt: {
        fontFamily: "bold",
        color: COLORS.white,
        fontSize: 18,
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
    errorMessage: {
        color: COLORS.red,
        fontFamily: "regular",
        marginTop: 5,
        marginLeft: 5,
        fontSize: SIZES.xSmall
    },

    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    placeholderStyle: {
        fontSize: 14,
        color: COLORS.gray,
        marginLeft: 5,
        fontFamily: 'regular',
    },
    selectedTextStyle: {
        marginLeft: 5,
        fontSize: 14,
    },
    iconStyle: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 14,
    },
    selectedStyle: {
        borderRadius: 12,
        backgroundColor: COLORS.primary,
    }
})
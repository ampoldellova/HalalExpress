import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import BackBtn from '../../components/BackBtn';
import Button from '../../components/Button';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SIZES } from '../../styles/theme';
import { AntDesign, Entypo, Ionicons, MaterialIcons, FontAwesome6 } from '@expo/vector-icons';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { Formik } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import * as Yup from "yup";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import baseUrl from '../../assets/common/baseUrl';

const foodTags = [
    { label: 'Chicken Shawarma', value: 'Chicken Shawarma' },
    { label: 'Beef Kebab', value: 'Beef Kebab' },
    { label: 'Lamb Biryani', value: 'Lamb Biryani' },
    { label: 'Falafel', value: 'Falafel' },
    { label: 'Hummus', value: 'Hummus' },
    { label: 'Tabbouleh', value: 'Tabbouleh' },
    { label: 'Grilled Salmon', value: 'Grilled Salmon' },
    { label: 'Vegetable Samosa', value: 'Vegetable Samosa' },
    { label: 'Chicken Tikka', value: 'Chicken Tikka' },
    { label: 'Dates', value: 'Dates' },
    { label: 'Halal Pepperoni Pizza', value: 'Halal Pepperoni Pizza' },
    { label: 'Mango Lassi', value: 'Mango Lassi' },
    { label: 'Baklava', value: 'Baklava' },
    { label: 'Shish Tawook', value: 'Shish Tawook' },
    { label: 'Halal Beef Burger', value: 'Halal Beef Burger' },
    { label: 'Dessert', value: 'Dessert' },
    { label: 'Sweet', value: 'Sweet' },
    { label: 'Cold', value: 'Cold' },
    { label: 'Ice Cream', value: 'Ice Cream' },
    { label: 'Fruity', value: 'Fruity' },
    { label: 'Burger', value: 'Burger' },
    { label: 'Savory', value: 'Savory' },
    { label: 'Beef', value: 'Beef' },
    { label: 'Cheesy', value: 'Cheesy' },
    { label: 'Pizza', value: 'Pizza' },
    { label: 'Italian', value: 'Italian' },
    { label: 'Pasta', value: 'Pasta' },
    { label: 'Chicken', value: 'Chicken' },
    { label: 'Asian', value: 'Asian' },
    { label: 'Rice', value: 'Rice' },
    { label: 'Seafood', value: 'Seafood' },
    { label: 'Spanish', value: 'Spanish' },
    { label: 'Beverage', value: 'Beverage' },
    { label: 'Smoothie', value: 'Smoothie' },
    { label: 'Curry', value: 'Curry' },
    { label: 'Indian', value: 'Indian' },
    { label: 'Spicy', value: 'Spicy' },
    { label: 'Chocolate', value: 'Chocolate' },
    { label: 'Baked', value: 'Baked' }
];

const validationSchema = Yup.object().shape({
    title: Yup.string()
        .required('Food Name is required'),
    foodTags: Yup.array()
        .min(1, 'At least one food tag is required')
        .required('Food tags are required'),
    category: Yup.string()
        .required('Food Category is required'),
    code: Yup.string()
        .required('Food Code is required'),
    restaurant: Yup.string()
        .required('Restaurant is required'),
    description: Yup.string()
        .required('Food Description is required'),
    price: Yup.number().
        required('Price is required'),
    additives: Yup.array()
        .of(
            Yup.object().shape({
                title: Yup.string().required('Additive name is required'),
                price: Yup.number().required('Price is required'),
            })
        )
        .optional(),
    imageUrl: Yup.string()
        .required('Food Picture is required'),
});


const AddFoodPage = () => {
    const route = useRoute();
    const restaurantId = route.params;
    const navigation = useNavigation();
    const [loader, setLoader] = useState(false);
    const [image, setImage] = useState('');
    const [categories, setCategories] = useState([]);

    const addFoodForm = async (values) => {
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
            formData.append('foodTags', JSON.stringify(values.foodTags));
            formData.append('category', values.category);
            formData.append('code', values.code);
            formData.append('restaurant', values.restaurant);
            formData.append('description', values.description);
            formData.append('price', values.price);
            formData.append('additives', JSON.stringify(values.additives));

            await axios.post(`${baseUrl}/api/foods/`, formData, config)
            setLoader(false);
            Alert.alert(
                "Success ✅",
                "Food has been added to your menu",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate('manage-food-page', restaurantId),
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
            const response = await axios.get(`${baseUrl}/api/category`);
            setCategories(response.data);
        } catch (error) {
            console.log("Error fetching categories:", error);
        }
    };


    useFocusEffect(
        React.useCallback(() => {
            getCategories();
        }, [])
    );

    return (
        <ScrollView style={{ marginTop: 30 }}>
            <View style={{ marginHorizontal: 20 }}>
                <BackBtn onPress={() => navigation.goBack()} />
                <Text style={styles.heading}>Add a Food</Text>
                <Formik
                    initialValues={{
                        title: '',
                        foodTags: [],
                        category: '',
                        code: '',
                        restaurant: restaurantId,
                        description: '',
                        price: '',
                        additives: [{
                            id: '',
                            title: '',
                            price: '',
                        }],
                        imageUrl: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        addFoodForm(values);
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
                            <Text style={styles.text}>Food Picture</Text>
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

                            <Text style={styles.text}>Food Details</Text>
                            <View style={styles.wrapper}>
                                <Text style={styles.label}>Food Name</Text>
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
                                        placeholder="Enter food name"
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
                                <Text style={styles.label}>Food Description</Text>
                                <View style={[styles.inputWrapper(touched.description ? COLORS.secondary : COLORS.offwhite), { height: 100, alignItems: 'flex-start' }]}>
                                    <MaterialIcons name="description" size={20} color={COLORS.gray} style={[styles.iconStyle, { marginTop: 15 }]} />
                                    <TextInput
                                        style={[styles.textInput, { marginVertical: 5 }]}
                                        placeholderTextColor={COLORS.gray}
                                        placeholder="Enter food description"
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
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    {touched.foodTags && errors.foodTags && (
                                        <Text style={styles.errorMessage}>{errors.foodTags}</Text>
                                    )}
                                    <Text style={styles.label}>Food Tags</Text>
                                </View>
                                <MultiSelect
                                    data={foodTags}
                                    style={styles.inputWrapper(touched.foodTags ? COLORS.secondary : COLORS.offwhite)}
                                    selectedTextStyle={[
                                        styles.selectedTextStyle,
                                        {
                                            fontFamily: 'regular',
                                            color: COLORS.white
                                        }
                                    ]}
                                    placeholderStyle={styles.placeholderStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    selectedStyle={styles.selectedStyle}
                                    placeholder="Select Food tags"
                                    searchPlaceholder="Search..."
                                    labelField="label"
                                    valueField="value"
                                    maxHeight={200}
                                    onChange={item => { setFieldValue('foodTags', item) }}
                                    onFocus={() => { setFieldTouched('foodTags') }}
                                    onBlur={() => { setFieldTouched('foodTags', '') }}
                                    value={values.foodTags}
                                    search
                                    renderLeftIcon={() => (
                                        <AntDesign
                                            style={styles.iconStyle}
                                            color={COLORS.gray}
                                            name="tags"
                                            size={20}
                                        />
                                    )}
                                />
                            </View>

                            <View style={styles.wrapper}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    {touched.category && errors.category && (
                                        <Text style={styles.errorMessage}>{errors.category}</Text>
                                    )}
                                    <Text style={styles.label}>Food Category</Text>
                                </View>
                                <Dropdown
                                    data={categories}
                                    style={styles.inputWrapper(touched.category ? COLORS.secondary : COLORS.offwhite)}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    placeholderStyle={styles.placeholderStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    placeholder={'Select Food Category'}
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
                                <Text style={styles.label}>Food Code</Text>
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
                                        placeholder="Enter food code"
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
                                <Text style={styles.label}>Food Price</Text>
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
                                        placeholder="Enter food price"
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

                            <Text style={[styles.text, { marginTop: 0 }]}>Food Additives</Text>
                            <View style={{ borderRadius: 15, borderWidth: 0.5, borderColor: COLORS.primary, padding: 8, marginBottom: 20 }}>
                                {values.additives.map((additive, index) => (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} key={index}>
                                        <View style={[styles.wrapper, { width: '61%' }]}>
                                            <Text style={[styles.label, { textAlign: 'left' }]}>Additives</Text>
                                            <View style={styles.inputWrapper(touched.additives?.[index]?.title ? COLORS.secondary : COLORS.offwhite)}>
                                                <Ionicons
                                                    style={styles.iconStyle}
                                                    color={COLORS.gray}
                                                    name="fast-food"
                                                    size={20}
                                                />
                                                <TextInput
                                                    style={styles.textInput}
                                                    placeholderTextColor={COLORS.gray}
                                                    placeholder="Additive name"
                                                    onChangeText={text => {
                                                        const newAdditives = [...values.additives];
                                                        newAdditives[index].title = text;
                                                        setFieldValue('additives', newAdditives);
                                                    }}
                                                    onFocus={() => setFieldTouched(`additives.${index}.title`)}
                                                    onBlur={() => setFieldTouched(`additives.${index}.title`, '')}
                                                    value={additive.title}
                                                />
                                            </View>
                                            {touched.additives?.[index]?.title && errors.additives?.[index]?.title && (
                                                <Text style={styles.errorMessage}>{errors.additives[index].title}</Text>
                                            )}
                                        </View>
                                        <View style={[styles.wrapper, { width: '35%' }]}>
                                            <Text style={[styles.label, { textAlign: 'left' }]}>Price</Text>
                                            <View style={styles.inputWrapper(touched.additives?.[index]?.price ? COLORS.secondary : COLORS.offwhite)}>
                                                <FontAwesome6
                                                    style={styles.iconStyle}
                                                    color={COLORS.gray}
                                                    name="peso-sign"
                                                    size={20}
                                                />
                                                <TextInput
                                                    style={styles.textInput}
                                                    keyboardType='number-pad'
                                                    placeholderTextColor={COLORS.gray}
                                                    placeholder="Price"
                                                    onChangeText={text => {
                                                        const newAdditives = [...values.additives];
                                                        newAdditives[index].price = text;
                                                        setFieldValue('additives', newAdditives);
                                                    }}
                                                    onFocus={() => setFieldTouched(`additives.${index}.price`)}
                                                    onBlur={() => setFieldTouched(`additives.${index}.price`, '')}
                                                    value={additive.price}
                                                />
                                            </View>
                                            {touched.additives?.[index]?.price && errors.additives?.[index]?.price && (
                                                <Text style={styles.errorMessage}>{errors.additives[index].price}</Text>
                                            )}
                                        </View>
                                        {values.additives.length > 1 && (
                                            <TouchableOpacity
                                                style={{ position: 'absolute', right: 0, top: 0 }}
                                                onPress={() => {
                                                    const newAdditives = values.additives.filter((_, i) => i !== index);
                                                    setFieldValue('additives', newAdditives);
                                                }}
                                            >
                                                <Text style={{ fontSize: 8 }}>❌</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ))}
                                <TouchableOpacity
                                    style={styles.btnStyle}
                                    onPress={() => {
                                        const newAdditives = [...values.additives, { title: '', price: '' }];
                                        setFieldValue('additives', newAdditives);
                                    }}
                                >
                                    <Text style={styles.btnTxt}>A D D   F I E L D</Text>
                                </TouchableOpacity>

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
    )
}

export default AddFoodPage

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
import { Text, View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../../styles/theme";
import { Feather } from '@expo/vector-icons';
import styles from "../../styles/search.style";
import LottieView from "lottie-react-native";
import baseUrl from "../../assets/common/baseUrl";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchedSupplier from "./SearchedSupplier";
import SearchedProduct from "./SearchedProduct";

const VendorSearchPage = () => {
    const [ingredients, setIngredients] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    const [searchCategory, setSearchCategory] = useState("ingredients");
    const animation = useRef(null);
    const navigation = useNavigation();

    const getIngredients = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                const config = {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    },
                };
                const response = await axios.get(`${baseUrl}/api/ingredients/list`, config);
                setIngredients(response.data);
            }
            else {
                console.log("Authentication token not found");
            }
        } catch (error) {
            console.log("Error fetching ingredients:", error);
        }
    };

    const getSuppliers = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                const config = {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    },
                };

                const response = await axios.get(`${baseUrl}/api/supplier/list`, config);
                setSuppliers(response.data);
            } else {
                console.log("Authentication token not found");
            }
        } catch (error) {
            console.log("Error fetching suppliers:", error);
        }
    }

    const handleSearch = (keyword) => {
        setSearchKey(keyword);
        if (keyword.trim() === "") {
            setFilteredIngredients(ingredients);
            setFilteredSuppliers(suppliers);
        } else {
            const regex = new RegExp(keyword, "i");
            if (searchCategory === "ingredients") {
                setFilteredIngredients(ingredients.filter((ingredient) => regex.test(ingredient.title)));
            } else if (searchCategory === "suppliers") {
                setFilteredSuppliers(suppliers.filter((supplier) => regex.test(supplier.title) || regex.test(supplier.code)));
            }
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getIngredients();
            getSuppliers();
        }, [])
    );

    return (
        <SafeAreaView>
            <View style={{ backgroundColor: COLORS.primary, height: SIZES.height }}>
                <View
                    style={{
                        backgroundColor: COLORS.offwhite,
                        height: SIZES.height - 55,
                        borderBottomEndRadius: 30,
                        borderBottomStartRadius: 30,
                    }}
                >
                    <View style={styles.searchContainer}>
                        <View style={styles.searchWrapper}>
                            <TextInput
                                style={styles.input}
                                value={searchKey}
                                onChangeText={handleSearch}
                                placeholder={`Search ${searchCategory === "ingredients" ? "ingredient(s)" : "supplier(s)"}...`}
                            />
                        </View>

                        <TouchableOpacity style={styles.searchBtn}>
                            <Feather name="search" size={24} color={COLORS.secondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 10 }}>
                        <TouchableOpacity onPress={() => setSearchCategory("ingredients")}>
                            <Text style={{
                                color: searchCategory === "ingredients" ?
                                    COLORS.primary : COLORS.gray,
                                fontFamily: 'regular'
                            }}>
                                Ingredients
                            </Text>
                        </TouchableOpacity>
                        <Text style={{ marginHorizontal: 10 }}>|</Text>
                        <TouchableOpacity onPress={() => setSearchCategory("suppliers")}>
                            <Text style={{
                                color: searchCategory === "suppliers" ?
                                    COLORS.primary : COLORS.gray,
                                fontFamily: 'regular'
                            }}>
                                Suppliers
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {searchKey.trim() === "" ? (
                        <View
                            style={{
                                width: SIZES.width,
                                height: SIZES.height / 1.5,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <LottieView
                                autoPlay
                                ref={animation}
                                style={{ width: "100%", height: "100%" }}
                                source={require("../../assets/anime/cook.json")}
                            />
                        </View>
                    ) : searchCategory === "ingredients" && filteredIngredients.length === 0 || searchCategory === "suppliers" && filteredSuppliers.length === 0 ? (
                        <View style={{ justifyContent: "center", alignItems: "center", height: SIZES.height / 1.5 }}>
                            <Text style={{ fontSize: 18, color: COLORS.gray }}>No results found</Text>
                        </View>
                    ) : (
                        <ScrollView style={{ paddingBottom: 20 }}>
                            {searchCategory === "ingredients" &&
                                filteredIngredients.map((item, i) => (
                                    <SearchedProduct key={i} item={item} onPress={() => navigation.navigate('ingredient-nav', item)} />
                                ))}
                            {searchCategory === "suppliers" &&
                                filteredSuppliers.map((item, i) => (
                                    <SearchedSupplier key={i} item={item} />
                                ))}
                        </ScrollView>
                    )}
                </View>
            </View>
        </SafeAreaView>
    )
}

export default VendorSearchPage
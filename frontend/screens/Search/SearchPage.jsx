import { Text, View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../../styles/theme";
import { Feather } from '@expo/vector-icons';
import styles from "../../styles/search.style";
import LottieView from "lottie-react-native";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import SearchedFood from "./SearchedFood";
import SearchedRestaurant from "./SearchedRestaurant";
import baseUrl from "../../assets/common/baseUrl";

const SearchPage = () => {
    const [foods, setFoods] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    const [searchCategory, setSearchCategory] = useState("foods");
    const animation = useRef(null);
    const navigation = useNavigation();

    const getFoods = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/foods/list`);
            setFoods(response.data);
            setFilteredFoods(response.data);
        } catch (error) {
            console.log("Error fetching foods:", error);
        }
    };

    const getRestaurants = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/restaurant/list`);
            setRestaurants(response.data);
            setFilteredRestaurants(response.data);
            console.log(filteredRestaurants)
            console.log(restaurants)
        } catch (error) {
            console.log("Error fetching restaurants:", error);
        }
    };

    const handleSearch = (keyword) => {
        setSearchKey(keyword); // Update the search key
        if (keyword.trim() === "") {
            setFilteredFoods(foods);
            setFilteredRestaurants(restaurants);
        } else {
            const regex = new RegExp(keyword, "i");
            if (searchCategory === "foods") {
                setFilteredFoods(foods.filter((food) => regex.test(food.title) || regex.test(food.code)));
            } else if (searchCategory === "restaurants") {
                setFilteredRestaurants(restaurants.filter((restaurant) => regex.test(restaurant.title) || regex.test(restaurant.code)));
            }
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getFoods();
            getRestaurants();
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
                                placeholder={`Search ${searchCategory === "food(s)" ? "food(s)" : "restaurant(s)"}...`}
                            />
                        </View>

                        <TouchableOpacity style={styles.searchBtn}>
                            <Feather name="search" size={24} color={COLORS.secondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 10 }}>
                        <TouchableOpacity onPress={() => setSearchCategory("foods")}>
                            <Text style={{
                                color: searchCategory === "foods" ?
                                    COLORS.primary : COLORS.gray,
                                fontFamily: 'regular'
                            }}>
                                Foods
                            </Text>
                        </TouchableOpacity>
                        <Text style={{ marginHorizontal: 10 }}>|</Text>
                        <TouchableOpacity onPress={() => setSearchCategory("restaurants")}>
                            <Text style={{
                                color: searchCategory === "restaurants" ?
                                    COLORS.primary : COLORS.gray,
                                fontFamily: 'regular'
                            }}>
                                Restaurants
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
                    ) : searchCategory === "foods" && filteredFoods.length === 0 || searchCategory === "restaurants" && filteredRestaurants.length === 0 ? (
                        <View style={{ justifyContent: "center", alignItems: "center", height: SIZES.height / 1.5 }}>
                            <Text style={{ fontSize: 18, color: COLORS.gray }}>No results found</Text>
                        </View>
                    ) : (
                        <ScrollView style={{ paddingBottom: 20 }}>
                            {searchCategory === "foods" &&
                                filteredFoods.map((item, i) => (
                                    <SearchedFood key={i} item={item} onPress={() => navigation.navigate("food-nav", item)} />
                                ))}
                            {searchCategory === "restaurants" &&
                                filteredRestaurants.map((item, i) => (
                                    <SearchedRestaurant key={i} item={item} />
                                ))}
                        </ScrollView>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SearchPage;

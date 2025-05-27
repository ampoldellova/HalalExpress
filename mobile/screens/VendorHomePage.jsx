import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseUrl from "../assets/common/baseUrl";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../components/Loader";
import pages from "../styles/page.style";
import SupplyCategoryList from "../components/Categories/SupplyCategoryList";
import HomeHeader from "../components/HomeHeader";
import { COLORS, SIZES } from "../styles/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import Heading from "../components/Heading";
import Suppliers from "../components/Supplier/Suppliers";
import Products from "../components/Products/Products";
import Divider from "../components/Divider";
import HomeProductCategories from "../components/Categories/HomeProductCategories";

const VendorHomePage = () => {
  const [supplyCategories, setSupplyCategories] = useState([]);
  const [supplyCategoriesLoaded, setSupplyCategoriesLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [suppliersLoaded, setSuppliersLoaded] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [ingredientsLoaded, setIngredientsLoaded] = useState(false);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSupplyCategories = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/supplyCategory/`);
      setSupplyCategories(response.data);
      setSupplyCategoriesLoaded(true);
    } catch (error) {
      console.log("Error fetching restaurants:", error);
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

        const response = await axios.get(
          `${baseUrl}/api/supplier/list`,
          config
        );
        setSuppliers(response.data);
        setSuppliersLoaded(true);
      } else {
        console.log("Authentication token not found");
      }
    } catch (error) {
      console.log("Error fetching suppliers:", error);
    }
  };

  const getIngredients = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };

        const response = await axios.get(
          `${baseUrl}/api/ingredients/list`,
          config
        );
        setIngredients(response.data);
        setIngredientsLoaded(true);
      } else {
        console.log("Authentication token not found");
      }
    } catch (error) {
      console.log("Error fetching suppliers:", error);
    }
  };

  useEffect(() => {
    if (supplyCategoriesLoaded && suppliersLoaded && ingredientsLoaded) {
      setLoading(false);
    }
  }, [supplyCategoriesLoaded, suppliersLoaded, ingredientsLoaded]);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = ingredients.filter(
        (ingredient) => ingredient.category._id === selectedCategory
      );
      setFilteredIngredients(filtered);
    } else {
      setFilteredIngredients(ingredients);
    }
  }, [selectedCategory, ingredients]);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      setSupplyCategoriesLoaded(false);
      setSuppliersLoaded(false);
      setIngredientsLoaded(false);

      Promise.all([getSupplyCategories(), getSuppliers(), getIngredients()])
        .then(() => setLoading(false))
        .catch((err) => console.error(err));
    }, [])
  );

  return (
    <SafeAreaView>
      {loading ? (
        <Loader />
      ) : (
        <View style={{ backgroundColor: COLORS.primary, height: SIZES.height }}>
          <View style={pages.viewTwo}>
            <ScrollView>
              <HomeHeader />
              <SupplyCategoryList
                supplyCategories={supplyCategories}
                setSelectedCategory={setSelectedCategory}
                setSelectedSection={setSelectedSection}
                setSelectedValue={setSelectedValue}
              />
              {selectedCategory ? (
                <View>
                  <Heading
                    heading={`Product(s) in ${selectedValue}`}
                    onPress={() => {}}
                  />
                  <HomeProductCategories ingredients={filteredIngredients} />
                </View>
              ) : (
                <View>
                  <Heading heading={"Supplier Stores"} onPress={() => {}} />
                  <Suppliers suppliers={suppliers} />
                  <Divider />
                  <Heading
                    heading={"Products Available"}
                    onPress={() => {}}
                  />
                  <Products ingredients={filteredIngredients} />
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default VendorHomePage;

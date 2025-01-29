import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CategoryItem from './CategoryItem'
import baseUrl from '../../assets/common/baseUrl'

const SupplyCategoryList = ({ setSelectedCategory, setSelectedSection, setSelectedValue }) => {
    const [supplyCategories, setSupplyCategories] = useState([]);
    const [selected, setSelected] = useState(null)

    const getSupplyCategories = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/supplyCategory/`);
            setSupplyCategories(response.data);
        } catch (error) {
            console.log("Error fetching restaurants:", error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getSupplyCategories();
        }, [])
    );

    const handleSelectedCategory = (item) => {
        if (selected == item.value) {
            setSelectedCategory(null);
            setSelected(null);
            setSelectedSection(null);
            setSelectedValue(null);
        } else {
            setSelectedCategory(item._id);
            setSelected(item.value);
            setSelectedSection('category');
            setSelectedValue(item.title);
        }
    }

    return (
        <FlatList
            data={supplyCategories}
            showsHorizontalScrollIndicator={false}
            horizontal
            style={{ marginTop: 5 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
                <TouchableOpacity onPress={() => handleSelectedCategory(item)}>
                    <CategoryItem selected={selected} category={item} />
                </TouchableOpacity>}
        />
    )
}

export default SupplyCategoryList

const styles = StyleSheet.create({})
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../styles/theme';
import Divider from './Divider';

const AddressSuggestions = ({ suggestions = [], onSuggestionPress }) => {
    const limitedSuggestions = suggestions.slice(0, 3)

    return (
        <FlatList
            style={{ backgroundColor: 'white', borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}
            data={limitedSuggestions}
            keyExtractor={(item, index) => `${item.place_id}-${index}`}
            renderItem={({ item }) => (
                <>
                    <TouchableOpacity onPress={() => onSuggestionPress(item)} style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
                        <Ionicons name="location-outline" size={24} color={COLORS.gray} />
                        <Text style={{ fontFamily: 'regular', fontSize: 14, marginLeft: 5, marginRight: 20 }}>{item.formatted}</Text>
                    </TouchableOpacity>
                    <Divider />
                </>
            )}
        />
    );
};

export default AddressSuggestions;
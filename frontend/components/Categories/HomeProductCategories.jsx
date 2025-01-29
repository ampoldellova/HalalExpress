import { useNavigation } from '@react-navigation/native'
import { View, FlatList, StyleSheet } from 'react-native'
import CategoryIngredientComp from './CategoryIngredientComp';


const HomeProductCategories = ({ ingredients }) => {
    const navigation = useNavigation();

    const renderIngredientCategoryItem = ({ item }) => (
        <CategoryIngredientComp item={item} onPress={() => navigation.navigate('ingredient-nav', item)} />
    );

    return (
        <View style={{ marginLeft: 12, marginBottom: 12 }}>
            <FlatList
                data={ingredients}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item._id.toString()}
                style={{ marginTop: 10 }}
                scrollEnabled
                renderItem={renderIngredientCategoryItem}
            />
        </View>
    )
}

export default HomeProductCategories

const styles = StyleSheet.create({})
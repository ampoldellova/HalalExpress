import { useNavigation } from "@react-navigation/native";
import { View, FlatList, StyleSheet } from "react-native";
import CategoryIngredientComp from "./CategoryIngredientComp";

const HomeProductCategories = ({ ingredients }) => {
  const navigation = useNavigation();

  const renderIngredientCategoryItem = ({ item }) => (
    <CategoryIngredientComp
      item={item}
      onPress={() => navigation.navigate("product-page", item)}
    />
  );

  return (
    <View style={{ marginHorizontal: 8 }}>
      <FlatList
        key={2}
        numColumns={2}
        data={ingredients}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        style={{ marginTop: 10 }}
        scrollEnabled
        renderItem={renderIngredientCategoryItem}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginHorizontal: 10,
        }}
      />
    </View>
  );
};

export default HomeProductCategories;

const styles = StyleSheet.create({});

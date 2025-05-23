import { useNavigation } from "@react-navigation/native";
import { View, FlatList, StyleSheet } from "react-native";
import CategoryIngredientComp from "./CategoryIngredientComp";

const HomeProductCategories = ({ ingredients }) => {
  const navigation = useNavigation();

  const renderIngredientCategoryItem = ({ item }) => (
    <View style={{ flex: 1, alignItems: "center" }}>
      <CategoryIngredientComp
        item={item}
        onPress={() => navigation.navigate("product-page", item)}
      />
    </View>
  );

  return (
    <View>
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

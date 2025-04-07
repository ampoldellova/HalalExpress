import CategoryFoodComp from "./CategoryFoodComp";
import { useNavigation } from "@react-navigation/native";
import { View, FlatList, StyleSheet } from "react-native";

const HomeCategories = ({ foods }) => {
  const navigation = useNavigation();

  const renderCategoryItem = ({ item }) => (
    <CategoryFoodComp
      item={item}
      onPress={() => navigation.navigate("food-navigation", item)}
    />
  );

  return (
    <View style={{ marginLeft: 12, marginBottom: 12 }}>
      <FlatList
        data={foods}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        style={{ marginTop: 10 }}
        scrollEnabled
        renderItem={renderCategoryItem}
      />
    </View>
  );
};

export default HomeCategories;

const styles = StyleSheet.create({});

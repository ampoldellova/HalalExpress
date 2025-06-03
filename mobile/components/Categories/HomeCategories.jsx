import CategoryFoodComp from "./CategoryFoodComp";
import { useNavigation } from "@react-navigation/native";
import { View, FlatList, StyleSheet } from "react-native";

const HomeCategories = ({ foods }) => {
  const navigation = useNavigation();

  const renderCategoryItem = ({ item }) => (
    <View key={item._id} style={{ flex: 1, alignItems: "center" }}>
      <CategoryFoodComp
        item={item}
        onPress={() => navigation.navigate("food-page", item)}
      />
    </View>
  );

  return (
    <View>
      <FlatList
        key={2}
        numColumns={2}
        data={foods}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        style={{ marginTop: 10 }}
        scrollEnabled
        renderItem={renderCategoryItem}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginHorizontal: 10,
        }}
      />
    </View>
  );
};

export default HomeCategories;

const styles = StyleSheet.create({});

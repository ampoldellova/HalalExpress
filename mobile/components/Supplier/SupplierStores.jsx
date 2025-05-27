import { FlatList, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import SupplierStoreComponent from "./SupplierStoreComponent";

const SupplierStores = ({ stores }) => {
  const navigation = useNavigation();

  return (
    <View style={{ marginLeft: 12 }}>
      <FlatList
        data={stores}
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 5, rowGap: 10 }}
        scrollEnabled
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <SupplierStoreComponent
            item={item}
            onPress={() => {
              navigation.navigate("user-supplier-page", item);
            }}
          />
        )}
      />
    </View>
  );
};

export default SupplierStores;

const styles = StyleSheet.create({});

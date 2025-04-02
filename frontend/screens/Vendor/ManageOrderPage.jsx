import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import BackBtn from "../../components/BackBtn";

const ManageOrderPage = () => {
  const route = useRoute();
  const item = route.params;
  const navigation = useNavigation();

  return (
    <View style={{ marginHorizontal: 20, marginTop: 15 }}>
      <BackBtn onPress={() => navigation.goBack()} />
      <Text style={styles.heading}>Manage Orders</Text>
    </View>
  );
};

export default ManageOrderPage;

const styles = StyleSheet.create({
  heading: {
    fontFamily: "bold",
    fontSize: 24,
    textAlign: "center",
    marginTop: 10,
  },
});

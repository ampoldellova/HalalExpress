import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../styles/theme";

const Divider = () => {
  return <View style={styles.divider} />;
};

export default Divider;

const styles = StyleSheet.create({
  divider: {
    borderColor: COLORS.gray2,
    opacity: 0.7,
    width: "auto",
    borderWidth: 0.3,
    marginHorizontal: 10,
    marginVertical: 5,
  },
});

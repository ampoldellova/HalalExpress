import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../styles/theme";
import Divider from "../Divider";

const SpecialRemarks = ({ orderNote, setOrderNote }) => {
  return (
    <View
      style={{
        marginBottom: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <Text style={{ fontFamily: "bold", fontSize: 18 }}>
          Special Remarks
        </Text>
      </View>

      <Divider />

      <View style={styles.notesInputWrapper(COLORS.gray2)}>
        <AntDesign
          name="message1"
          size={18}
          color={COLORS.gray2}
          style={{ marginRight: 5 }}
        />
        <TextInput
          multiline
          numberOfLines={3}
          placeholder="Let us know if you have any special requests."
          placeholderTextColor={COLORS.gray2}
          autoCapitalize="none"
          autoCorrect={false}
          value={orderNote}
          onChangeText={(text) => setOrderNote(text)}
          style={styles.textInput}
        />
      </View>
    </View>
  );
};

export default SpecialRemarks;

const styles = StyleSheet.create({
  label: {
    fontFamily: "regular",
    fontSize: SIZES.xSmall,
    marginBottom: 5,
    marginEnd: 5,
    textAlign: "right",
  },
  textInput: {
    flex: 1,
    fontFamily: "regular",
    marginTop: 2,
  },
  notesInputWrapper: (borderColor) => ({
    borderColor: borderColor,
    marginTop: 10,
    borderWidth: 1,
    height: 80,
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
  }),
});

import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "./theme";

const styles = StyleSheet.create({
  cover: {
    height: SIZES.height / 2.4,
    width: SIZES.width,
    marginBottom: SIZES.xxLarge,
  },
  titleLogin: {
    marginVertical: 20,
    marginHorizontal: 60,
    fontFamily: "bold",
    fontSize: SIZES.width / 11,
    color: COLORS.primary,
    textAlign: "center",
  },
  wrapper: {
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    fontFamily: "regular",
    marginTop: 2,
  },
  label: {
    fontFamily: "regular",
    fontSize: SIZES.xSmall,
    marginBottom: 5,
    marginEnd: 5,
    textAlign: "right",
  },
  inputWrapper: (borderColor) => ({
    borderColor: borderColor,
    backgroundColor: COLORS.lightWhite,
    borderWidth: 1,
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
  }),
  iconStyle: {
    marginRight: 10,
  },
  errorMessage: {
    color: COLORS.red,
    fontFamily: "regular",
    marginTop: 5,
    marginLeft: 5,
    fontSize: SIZES.xSmall,
  },
  registration: {
    marginTop: 0,
    textAlign: "center",
    fontFamily: "regular",
  },
});

export default styles;

import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "./theme";

const pages = StyleSheet.create({
    viewOne: { backgroundColor: COLORS.primary, height: SIZES.height },
    viewTwo: {
        backgroundColor: COLORS.offwhite,
        height: SIZES.height - 55,
        borderBottomEndRadius: 30,
        borderBottomStartRadius: 30,
    },
    viewThree: {
        backgroundColor: COLORS.offwhite,
        height: SIZES.height - 80,
        borderBottomEndRadius: 30,
        borderBottomStartRadius: 30,
    },
});

export default pages;
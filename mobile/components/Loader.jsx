import { StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import LottieView from "lottie-react-native";
import { COLORS, SIZES } from "../styles/theme";
import pages from "../styles/page.style";

const Loader = () => {
  const animation = useRef(null);
  return (
    <View style={pages.viewOne}>
      <View style={pages.viewTwo}>
        <View
          style={{
            width: SIZES.width,
            height: SIZES.height / 1.2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LottieView
            autoPlay
            ref={animation}
            style={{ width: "20%", height: "20%" }}
            source={require("../assets/anime/loading.json")}
          />
          <Text
            style={{
              fontFamily: "regular",
              color: COLORS.gray,
              position: "absolute",
              bottom: 220,
            }}
          >
            Loading...
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({});

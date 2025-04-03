import { StyleSheet, Text, View } from 'react-native'
import React, { useRef } from 'react'
import LottieView from 'lottie-react-native';
import { SIZES } from '../styles/theme';

const Loader = () => {
    const animation = useRef(null);
    return (
        <View
            style={{
                width: SIZES.width,
                height: SIZES.height / 1.5,
                justifyContent: "center",
                alignItems: "center",
                top: 0
            }}
        >
            <LottieView
                autoPlay
                ref={animation}
                style={{ width: '50%', height: '50%' }}
                source={require("../assets/anime/loading.json")}
            />
        </View>
    )
}

export default Loader

const styles = StyleSheet.create({})
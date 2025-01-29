import { StyleSheet, Text, View } from 'react-native'
import React, { useRef } from 'react'
import LottieView from 'lottie-react-native';
import { SIZES } from '../../styles/theme';

const ClosedWindow = () => {
    const animation = useRef(null);
    return (

        <View
            style={{
                // width: SIZES.width,
                height: SIZES.height / 1.8,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <LottieView
                autoPlay
                ref={animation}
                style={{ width: '80%', height: '80%' }}
                source={require("../../assets/anime/storeClosed.json")}
            />
        </View>
    )
}

export default ClosedWindow

const styles = StyleSheet.create({})
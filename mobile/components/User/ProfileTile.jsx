import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { AntDesign, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../styles/theme";

const ProfileTile = ({ onPress, title, icon, font }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.outter}>
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 80 }}>
                    {font === 1 ? (
                        <Ionicons name={icon} size={24} color={COLORS.gray} />
                    ) : font === 2 ? (
                        < SimpleLineIcons name={icon} size={20} color={COLORS.gray} />
                    ) : (
                        <AntDesign name={icon} size={22} color={COLORS.gray} />
                    )}
                    <Text style={styles.text}>{title}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default ProfileTile

const styles = StyleSheet.create({
    outter: {
        borderColor: COLORS.gray2,
        borderWidth: 1,
        width: SIZES.width / 2.5,
        borderRadius: 15,
        height: 80
    },
    inner: {
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        marginTop: 5,
        fontFamily: "regular",
        textAlign: 'center',
        fontSize: 12,
        color: COLORS.gray,
    },
})
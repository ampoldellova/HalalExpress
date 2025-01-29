import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const ChatUser = ({ user, onPress }) => {

    return (
        <TouchableOpacity style={styles.profile} onPress={onPress}>
            <Image
                alt=""
                source={{
                    uri: user.profile.url,
                }}
                style={styles.profileAvatar}
            />
            <View>
                <Text style={styles.profileName}>{user.username}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ChatUser

const styles = StyleSheet.create({
    profile: {
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginVertical: 5,
        marginHorizontal: 15
    },
    profileAvatar: {
        width: 30,
        height: 30,
        borderRadius: 9999,
        marginRight: 12,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#292929',
    },
    profileHandle: {
        marginTop: 2,
        fontSize: 16,
        fontWeight: '400',
        color: '#858585',
    },
})
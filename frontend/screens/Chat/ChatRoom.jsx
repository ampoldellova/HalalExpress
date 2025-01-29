import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { COLORS } from '../../styles/theme';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { database } from '../../config/firebase'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from '../../assets/common/baseUrl';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const ChatRoom = ({ route }) => {
    const [messages, setMessages] = useState([]);
    const navigation = useNavigation();
    const [user, setUser] = useState({});
    const [avatar, setAvatar] = useState("");
    const receiver = route.params;
    const [text, setText] = useState("");

    const getProfile = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                const config = {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    },
                };

                const response = await axios.get(`${baseUrl}/api/users/profile`, config);
                setUser(response.data)
                setAvatar(response.data.profile.url)
                console.log(response.data.profile.url)
            } else {
                console.log("Authentication token not found");
            }
        } catch (error) {
            console.log("Error fetching profile:", error);
        }
    };

    const renderInputToolbar = (props) => (
        <InputToolbar
            {...props}
            containerStyle={styles.inputToolbar}
            renderComposer={(composerProps) => (
                <TextInput
                    {...composerProps}
                    style={styles.textInput}
                    placeholder="Type your message here..."
                    placeholderTextColor="#888"
                    value={text}
                    onChangeText={setText}
                />
            )}
            renderSend={(sendProps) => (
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={() => {
                        if (text.trim()) {
                            sendProps.onSend({ text: text.trim() }, true);
                            setText(""); // Clear input
                        }
                    }}
                >
                    <FontAwesome name="send" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            )}
        />
    );

    useFocusEffect(
        React.useCallback(() => {
            getProfile();
        }, [])
    )

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={styles.wrapper}>
                    <Image
                        source={{
                            uri: receiver.profile.url,
                        }}
                        style={styles.receiverAvatar}
                    />
                    <View>
                        <Text style={styles.receiverName}>{receiver.username}</Text>
                        <Text style={styles.receiverEmail}>{receiver.email}</Text>
                    </View>
                </View>
            )
        })
    })

    useLayoutEffect(() => {
        const collectionRef = collection(database, 'chats');
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, snapshot => {
            const filteredMessages = snapshot.docs
                .map(doc => ({
                    _id: doc.id,
                    createdAt: doc.data().createdAt?.toDate() || new Date(),
                    text: doc.data().text,
                    user: doc.data().user,
                    receiverId: doc.data().receiverId,
                }))
                .filter(msg =>
                    (msg.user._id === user._id && msg.receiverId === receiver._id) ||
                    (msg.user._id === receiver._id && msg.receiverId === user._id)
                );

            setMessages(filteredMessages);
        });

        return unsubscribe;
    }, [user, receiver]);


    const onSend = useCallback((messages = []) => {
        const { _id, createdAt, text, user } = messages[0];
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

        addDoc(collection(database, 'chats'), {
            _id,
            createdAt,
            text,
            user,
            receiverId: receiver._id
        });
    }, []);

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            renderInputToolbar={renderInputToolbar}
            user={{
                _id: user._id,
                name: user.username,
                avatar: avatar
            }}
            messagesContainerStyle={{
                backgroundColor: '#fff'
            }}
        />
    )
}

export default ChatRoom

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: '-20'
    },
    receiverAvatar: {
        width: 40,
        height: 40,
        borderRadius: 9999,
        marginRight: 12,
    },
    receiverName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#292929',
    },
    receiverEmail: {
        fontSize: 16,
        fontWeight: '400',
        color: '#858585',
    },
    inputToolbar: {
        padding: 10,
    },
    textInput: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.primary,
        paddingHorizontal: 10,
        backgroundColor: COLORS.white,
        color: '#000',
    },
    sendButton: {
        paddingVertical: 8,
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

})
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../../styles/theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ChatUser from "./ChatUser";
import BackBtn from "../../components/BackBtn";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "@react-native-firebase/firestore";
import { useSelector } from "react-redux";
import { database } from "../../config/firebase";

const ChatList = () => {
  const [conversations, setConversations] = useState([]);
  const [latestMessage, setLatestMessage] = useState(null);
  const { user } = useSelector((state) => state.user);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchConversations = () => {
        const collectionRef = collection(database, "chats");
        const q = query(collectionRef, where("receiverId", "==", user?._id));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const chats = snapshot.docs.map((doc) => {
            const data = doc.data();

            return {
              _id: doc.id,
              ...data,
            };
          });

          const uniqueChats = Object.values(
            chats.reduce((acc, chat) => {
              const senderId = chat.user._id;
              if (!acc[senderId]) {
                acc[senderId] = chat;
              }
              return acc;
            }, {})
          );

          setConversations(uniqueChats);
        });

        return unsubscribe;
      };

      const fetchLatestMessage = () => {
        const collectionRef = collection(database, "chats");

        const q1 = query(collectionRef, where("receiverId", "==", user?._id));
        const q2 = query(collectionRef, where("user._id", "==", user?._id));

        const unsubscribe1 = onSnapshot(q1, (snapshot1) => {
          const chats1 = snapshot1.docs.map((doc) => {
            const data = doc.data();
            const createdAt = data.createdAt?.toDate() || new Date();

            return {
              ...data,
              createdAt,
            };
          });

          const unsubscribe2 = onSnapshot(q2, (snapshot2) => {
            const chats2 = snapshot2.docs.map((doc) => {
              const data = doc.data();
              const createdAt = data.createdAt?.toDate() || new Date();
              return {
                ...data,
                createdAt,
              };
            });

            const allChats = [...chats1, ...chats2];

            const uniqueChats = Object.values(
              allChats.reduce((acc, chat) => {
                const conversationId =
                  chat.receiverId === user?._id
                    ? chat.user._id
                    : chat.receiverId;

                if (
                  !acc[conversationId] ||
                  acc[conversationId].createdAt < chat.createdAt
                ) {
                  acc[conversationId] = chat;
                }
                return acc;
              }, {})
            );

            setLatestMessage(uniqueChats);
          });

          return () => unsubscribe2();
        });

        return () => unsubscribe1();
      };

      const unsubscribeConversations = fetchConversations();
      const unsubscribeLatestMessage = fetchLatestMessage();
      return () => {
        unsubscribeConversations();
        unsubscribeLatestMessage();
      };
    }, [user])
  );

  const combinedData = conversations.map((conversation) => {
    const latestMessageForConversation = latestMessage?.find((message) => {
      console.log(message);
      const isReceiverMatch = message.receiverId === conversation.user._id;
      const isSenderMatch = message.user._id === conversation.user._id;

      return isReceiverMatch || isSenderMatch;
    });

    return {
      ...conversation,
      latestMessage: latestMessageForConversation,
    };
  });

  const renderItem = ({ item }) => {
    return (
      <>
        <ChatUser
          restaurant={item}
          latestMessage={item.latestMessage}
          onPress={() => navigation.navigate("chat-page", item)}
        />
      </>
    );
  };

  return (
    <SafeAreaView>
      <View style={{ marginHorizontal: 20 }}>
        <BackBtn onPress={() => navigation.goBack()} />
        <Text style={styles.heading}>Chats</Text>
      </View>

      {conversations.length === 0 && (
        <View style={styles.container}>
          <Image
            style={{ width: 200, height: 200 }}
            source={require("../../assets/images/emptyInbox.png")}
          />
          <Text
            style={{
              fontSize: 14,
              fontFamily: "regular",
              color: COLORS.gray,
              textAlign: "center",
              width: "70%",
              marginTop: 10,
            }}
          >
            Your message box is empty.
          </Text>
        </View>
      )}

      {conversations.length > 0 && (
        <FlatList
          data={combinedData}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          style={{ marginTop: 20 }}
        />
      )}
    </SafeAreaView>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: SIZES.height / 1.3,
  },
  heading: {
    fontFamily: "bold",
    fontSize: 24,
    textAlign: "center",
    marginTop: 10,
  },
  text: {
    marginLeft: 16,
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: "-10",
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    marginHorizontal: SIZES.small,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: SIZES.medium,
    marginVertical: SIZES.medium,
    height: 50,
  },
  searchWrapper: {
    flex: 1,
    // marginRight: SIZES.small,
    borderRadius: SIZES.small,
  },
  input: {
    fontFamily: "regular",
    width: "100%",
    height: "100%",
    paddingHorizontal: 10,
  },
  searchBtn: {
    width: 50,
    height: "100%",
    borderRadius: SIZES.small,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.lightBlue,
  },
});

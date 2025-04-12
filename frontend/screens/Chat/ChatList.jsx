import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../../styles/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import baseUrl from "../../assets/common/baseUrl";
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
  const { user } = useSelector((state) => state.user);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchConversations = () => {
        const collectionRef = collection(database, "chats");
        const q = query(collectionRef, where("receiverId", "==", user?._id));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const chats = snapshot.docs.map((doc) => ({
            _id: doc.id,
            ...doc.data(),
          }));

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

      const unsubscribe = fetchConversations();
      return () => unsubscribe();
    }, [user])
  );

  const renderItem = ({ item }) => (
    <>
      <ChatUser
        restaurant={item}
        onPress={() => navigation.navigate("chat-page", item)}
      />
    </>
  );

  return (
    <SafeAreaView>
      <View style={{ marginHorizontal: 20 }}>
        <BackBtn onPress={() => navigation.goBack()} />
        <Text style={styles.heading}>Chats</Text>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        style={{ marginTop: 20 }}
      />
    </SafeAreaView>
  );
};

export default ChatList;

const styles = StyleSheet.create({
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

import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../../styles/theme";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import BackBtn from "../../components/BackBtn";
import {
  collection,
  query,
  where,
  onSnapshot,
  or,
} from "@react-native-firebase/firestore";
import { useSelector } from "react-redux";
import { database } from "../../config/firebase";
import RestaurantChatUser from "./RestaurantChatUser";

const RestaurantChatList = () => {
  const [conversations, setConversations] = useState([]);
  const [latestMessage, setLatestMessage] = useState(null);
  const { user } = useSelector((state) => state.user);
  const navigation = useNavigation();
  const router = useRoute();
  const restaurant = router.params?.restaurant;

  useFocusEffect(
    React.useCallback(() => {
      const fetchConversations = () => {
        const collectionRef = collection(database, "chats");

        const q = query(collectionRef, where("user._id", "==", restaurant._id));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const chats = snapshot.docs.map((doc) => {
            const data = doc.data();

            return {
              _id: doc.id,
              ...data,
            };
          });

          const uniqueReceivers = Object.values(
            chats.reduce((acc, chat) => {
              const receiver = {
                _id: chat.receiverId,
                name: chat.receiverName,
                avatar: chat.receiverAvatar,
              };

              if (!acc[receiver._id]) {
                acc[receiver._id] = {
                  user: receiver,
                  ...chat,
                };
              }
              return acc;
            }, {})
          );

          setConversations(uniqueReceivers);
        });

        return unsubscribe;
      };

      const fetchLatestMessage = () => {
        const collectionRef = collection(database, "chats");

        const q = query(
          collectionRef,
          or(
            where("receiverId", "==", restaurant._id),
            where("user._id", "==", restaurant._id)
          )
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const chats = snapshot.docs.map((doc) => {
            const data = doc.data();
            const createdAt = data.createdAt?.toDate() || new Date();

            return {
              ...data,
              createdAt,
            };
          });

          const latestMessages = Object.values(
            chats.reduce((acc, chat) => {
              const conversationId =
                chat.receiverId === restaurant._id
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

          setLatestMessage(latestMessages);
        });

        return unsubscribe;
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
      const isReceiverMatch = message.receiverId === conversation.receiverId;
      const isSenderMatch = message.user._id === conversation.receiverId;

      return isReceiverMatch || isSenderMatch;
    });

    return {
      ...conversation,
      text: latestMessageForConversation?.text || conversation.text,
      latestMessage: latestMessageForConversation,
    };
  });

  console.log(combinedData);

  const renderItem = ({ item }) => {
    return (
      <>
        <RestaurantChatUser
          restaurant={restaurant}
          receiver={item}
          latestMessage={item.latestMessage}
          onPress={() =>
            navigation.navigate("restaurant-chat-page", {
              item,
              restaurant: restaurant,
            })
          }
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

export default RestaurantChatList;

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

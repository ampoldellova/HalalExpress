import React, { useCallback, useLayoutEffect } from "react";
import { Box, Divider, IconButton, TextField, Typography } from "@mui/material";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { database } from "../../config/firebase";
import { getUser } from "../../utils/helpers";
import emptyInbox from "../../assets/images/emptyInbox.png";
import { COLORS } from "../../styles/theme";
import SendIcon from "@mui/icons-material/Send";

const RestaurantChats = ({ restaurant }) => {
  const [messages, setMessages] = React.useState([]);
  const [conversations, setConversations] = React.useState([]);
  const [latestMessage, setLatestMessage] = React.useState(null);
  const [selectedConversation, setSelectedConversation] = React.useState(null);
  const [newMessage, setNewMessage] = React.useState("");
  const user = getUser();

  React.useEffect(() => {
    if (!user?._id) return;

    const fetchConversations = () => {
      const collectionRef = collection(database, "chats");
      const q = query(collectionRef, where("user._id", "==", restaurant?._id));

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
      const q1 = query(
        collectionRef,
        where("receiverId", "==", restaurant?._id)
      );
      const q2 = query(collectionRef, where("user._id", "==", restaurant?._id));

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

          const latestMessages = Object.values(
            allChats.reduce((acc, chat) => {
              const conversationId =
                chat.receiverId === restaurant?._id
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

        return () => unsubscribe2();
      });

      return () => unsubscribe1();
    };

    const unsubscribeConversations = fetchConversations();
    const unsubscribeLatestMessage = fetchLatestMessage();

    return () => {
      unsubscribeConversations && unsubscribeConversations();
      unsubscribeLatestMessage && unsubscribeLatestMessage();
    };
  }, [user?._id, restaurant?._id]);

  useLayoutEffect(() => {
    const collectionRef = collection(database, "chats");
    const q = query(collectionRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const filteredMessages = snapshot.docs
        .map((doc) => ({
          _id: doc.id,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          text: doc.data().text,
          user: doc.data().user,
          receiverId: doc.data().receiverId,
        }))
        .filter(
          (msg) =>
            (msg.user._id === restaurant?._id &&
              msg.receiverId === selectedConversation?.receiverId) ||
            (msg.user._id === selectedConversation?.receiverId &&
              msg.receiverId === restaurant?._id)
        );

      setMessages(filteredMessages);
    });

    return unsubscribe;
  }, [restaurant?._id, selectedConversation]);

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

  const formatTime = (date) => {
    if (!date) return "";
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return new Date(date).toLocaleTimeString([], options);
  };

  const openChat = (conversation) => {
    setSelectedConversation(conversation);
  };

  React.useEffect(() => {
    if (combinedData.length > 0 && !selectedConversation) {
      setSelectedConversation(combinedData[0]);
    }
  }, [combinedData, selectedConversation]);

  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, message) => {
      const date = new Date(message.createdAt).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
      return groups;
    }, {});
  };

  const handleSendMessage = useCallback(async () => {
    if (
      newMessage.trim() === "" ||
      !selectedConversation?.user?._id ||
      !restaurant?._id
    ) {
      return;
    }

    const senderInfo = {
      _id: restaurant?._id,
      name: restaurant?.title,
      avatar: restaurant?.logoUrl?.url,
    };

    const messageData = {
      text: newMessage.trim(),
      createdAt: serverTimestamp(),
      user: senderInfo,
      receiverId: selectedConversation.receiverId,
      receiverName: selectedConversation.receiverName,
      receiverAvatar: selectedConversation.receiverAvatar,
    };

    try {
      await addDoc(collection(database, "chats"), messageData);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  }, [newMessage, restaurant, selectedConversation]);

  return (
    <>
      {combinedData.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "80%",
          }}
        >
          <Box
            component="img"
            src={emptyInbox}
            sx={{ width: 200, height: 200, objectFit: "cover" }}
          />
          <Typography
            sx={{
              fontFamily: "regular",
              color: COLORS.gray,
              textAlign: "center",
              marginTop: 2,
            }}
          >
            Your message box is empty.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{ display: "flex", flexDirection: "row", gap: 2, height: "80vh" }}
        >
          <Box
            sx={{
              width: 350,
              overflowY: "auto",
              borderRadius: 8,
            }}
          >
            {combinedData.map((conversation) => (
              <Box key={conversation._id} sx={{ px: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                    flexDirection: "row",
                    cursor: "pointer",
                    mt: 2,
                  }}
                  onClick={() => openChat(conversation)}
                >
                  <Box
                    component="img"
                    src={conversation?.receiverAvatar}
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 99,
                      objectFit: "cover",
                    }}
                  />
                  <Box sx={{ marginLeft: 1, width: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography sx={{ fontFamily: "bold", fontSize: 18 }}>
                        {conversation?.receiverName}
                      </Typography>
                      <Typography sx={{ fontFamily: "regular", fontSize: 14 }}>
                        {conversation?.latestMessage?.createdAt
                          ? new Date(
                              conversation.latestMessage.createdAt
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : ""}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "regular",
                          fontSize: 14,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 190,
                        }}
                      >
                        {conversation?.latestMessage?.user?._id ===
                        restaurant?._id
                          ? `You: ${conversation?.latestMessage?.text}`
                          : `${conversation?.latestMessage?.user?.name}: ${conversation?.latestMessage?.text}`}
                      </Typography>
                      <Typography sx={{ fontFamily: "regular", fontSize: 14 }}>
                        {formatTime(conversation?.latestMessage?.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Divider />
              </Box>
            ))}
            
          </Box>

          <Divider orientation="vertical" />

          <Box
            sx={{
              width: 565,
            }}
          >
            <Box
              sx={{
                bgcolor: COLORS.primary,
                p: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                component="img"
                src={selectedConversation?.receiverAvatar}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 99,
                  objectFit: "cover",
                  mr: 2,
                }}
              />
              <Typography
                sx={{
                  fontFamily: "bold",
                  color: COLORS.white,
                  fontSize: 24,
                }}
              >
                {selectedConversation?.receiverName}
              </Typography>
            </Box>

            {selectedConversation && (
              <>
                <Box
                  sx={{
                    p: 2,
                    height: "60vh",
                    overflowY: "auto",
                    backgroundColor: COLORS.offwhite,
                  }}
                >
                  {messages.length > 0 ? (
                    Object.entries(groupMessagesByDate(messages)).map(
                      ([date, msgs]) => (
                        <React.Fragment key={date}>
                          <Box sx={{ textAlign: "center", my: 2 }}>
                            <Typography
                              sx={{
                                fontFamily: "bold",
                                color: COLORS.gray,
                                fontSize: 13,
                                borderRadius: 2,
                                display: "inline-block",
                                px: 2,
                                py: 0.5,
                                mt: 1,
                              }}
                            >
                              {new Date(date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </Typography>
                          </Box>
                          {msgs.map((message) => (
                            <Box
                              key={message._id}
                              sx={{
                                display: "flex",
                                flexDirection:
                                  message.user._id === restaurant?._id
                                    ? "row-reverse"
                                    : "row",
                                alignItems: "center",
                                marginBottom: 2,
                              }}
                            >
                              <Box
                                component="img"
                                src={message.user.avatar}
                                sx={{
                                  height: 40,
                                  width: 40,
                                  borderRadius: 99,
                                  marginLeft:
                                    message.user._id === restaurant?._id
                                      ? 0
                                      : 1,
                                  marginRight:
                                    message.user._id === restaurant?._id
                                      ? 1
                                      : 0,
                                }}
                              />
                              <Box
                                sx={{
                                  backgroundColor: COLORS.white,
                                  padding: 1.5,
                                  borderRadius: 2,
                                  maxWidth: "60%",
                                  marginLeft:
                                    message.user._id === restaurant?._id
                                      ? 0
                                      : 1,
                                  marginRight:
                                    message.user._id === restaurant?._id
                                      ? 1
                                      : 0,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontFamily: "regular",
                                    color: COLORS.black,
                                    fontSize: 12,
                                  }}
                                >
                                  {message.text}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontFamily: "regular",
                                    color: COLORS.gray,
                                    fontSize: 12,
                                    textAlign:
                                      message.user._id === restaurant?._id
                                        ? "right"
                                        : "left",
                                  }}
                                >
                                  {formatTime(message.createdAt)}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </React.Fragment>
                      )
                    )
                  ) : (
                    <Typography
                      sx={{
                        fontFamily: "regular",
                        color: COLORS.gray,
                        textAlign: "center",
                      }}
                    >
                      No messages yet.
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    p: 2,
                    backgroundColor: COLORS.offwhite,
                    borderTop: `1px solid ${COLORS.gray2}`,
                  }}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={handleSendMessage}>
                          <SendIcon />
                        </IconButton>
                      ),
                      sx: {
                        "&::placeholder": {
                          fontFamily: "regular",
                        },
                        fontFamily: "regular",
                      },
                    }}
                  />
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default RestaurantChats;

import React, { useCallback, useLayoutEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { database } from "../../config/firebase";
import { useEffect, useState } from "react";
import { getUser } from "../../utils/helpers";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Box, Divider, IconButton, TextField, Typography } from "@mui/material";
import { COLORS } from "../../styles/theme";
import empty from "../../assets/images/emptyInbox.png";
import SendIcon from "@mui/icons-material/Send";

const Conversations = ({ onClose }) => {
  const user = getUser();
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [latestMessage, setLatestMessage] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!user?._id) return;

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
                chat.receiverId === user?._id ? chat.user._id : chat.receiverId;

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
      unsubscribeConversations && unsubscribeConversations();
      unsubscribeLatestMessage && unsubscribeLatestMessage();
    };
  }, [user?._id]);

  const combinedData = conversations.map((conversation) => {
    const latestMessageForConversation = latestMessage?.find((message) => {
      const isReceiverMatch = message.receiverId === conversation.user._id;
      const isSenderMatch = message.user._id === conversation.user._id;
      return isReceiverMatch || isSenderMatch;
    });

    return {
      ...conversation,
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

  useLayoutEffect(() => {
    if (!user?._id || !selectedConversation?.user?._id) return;

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
            (msg.user._id === user?._id &&
              msg.receiverId === selectedConversation.user._id) ||
            (msg.user._id === selectedConversation.user._id &&
              msg.receiverId === user._id)
        );

      setMessages(filteredMessages);
    });

    return () => unsubscribe();
  }, [user?._id, selectedConversation?.user?._id]);

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
      !user?._id
    ) {
      return;
    }

    const senderInfo = {
      _id: user?._id,
      name: user?.username,
      avatar: user?.profile?.url,
    };

    const messageData = {
      text: newMessage.trim(),
      createdAt: serverTimestamp(),
      user: senderInfo,
      receiverId: selectedConversation.user._id,
      receiverName: selectedConversation.user.name,
      receiverAvatar: selectedConversation.user.avatar,
    };

    try {
      await addDoc(collection(database, "chats"), messageData);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  }, [newMessage, user, selectedConversation]);

  console.log("Latest Messages:", combinedData);
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        backgroundColor: COLORS.white,
        borderRadius: 3,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        zIndex: 1001,
        height: 500,
        width: 400,
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: COLORS.primary,
        }}
      >
        <Typography
          sx={{
            fontFamily: "bold",
            position: "sticky",
            fontSize: 24,
            top: 0,
            zIndex: 1,

            color: COLORS.white,
          }}
        >
          Chats 💭
        </Typography>

        <IconButton onClick={() => onClose()}>
          <CloseOutlinedIcon size={24} sx={{ color: COLORS.white }} />
        </IconButton>
      </Box>

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
            src={empty}
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
        <>
          {combinedData.map((conversation) => (
            <Box key={conversation._id}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  p: 2,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: COLORS.offwhite,
                  },
                }}
                onClick={() => openChat(conversation)}
              >
                <Box
                  component="img"
                  src={conversation?.user?.avatar}
                  alt="Chat Image"
                  sx={{
                    height: 60,
                    width: 60,
                    borderRadius: 99,
                    border: `1px solid ${COLORS.gray2}`,
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column",
                    width: "100%",
                    ml: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "bold",
                        color: COLORS.black,
                        fontSize: 18,
                      }}
                    >
                      {conversation?.user?.name}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: "regular",
                        color: COLORS.gray,
                        fontSize: 14,
                      }}
                    >
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
                      width: "100%",
                      gap: 4,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "regular",
                        color: COLORS.gray,
                        fontSize: 14,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 200,
                      }}
                    >
                      {conversation?.latestMessage?.user?._id === user?._id
                        ? `You: ${conversation?.latestMessage?.text}`
                        : `${conversation?.latestMessage?.user?.name}: ${conversation?.latestMessage?.text}`}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: "regular",
                        color: COLORS.gray,
                        fontSize: 14,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 200,
                      }}
                    >
                      {formatTime(conversation?.latestMessage?.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Divider />
            </Box>
          ))}
        </>
      )}

      {selectedConversation && (
        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            right: 440,
            backgroundColor: COLORS.white,
            borderRadius: 3,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1002,
            height: 500,
            width: 400,
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: COLORS.primary,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                component="img"
                src={selectedConversation?.user?.avatar}
                sx={{
                  height: 40,
                  width: 40,
                  borderRadius: 99,
                  marginRight: 1,
                  backgroundColor: COLORS.white,
                }}
              />
              <Typography
                sx={{
                  fontFamily: "bold",
                  position: "sticky",
                  fontSize: 24,
                  top: 0,
                  zIndex: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 280,
                  color: COLORS.white,
                }}
              >
                {selectedConversation?.user?.name}
              </Typography>
            </Box>

            <IconButton onClick={() => setSelectedConversation(null)}>
              <CloseOutlinedIcon size={24} sx={{ color: COLORS.white }} />
            </IconButton>
          </Box>

          <Box sx={{ height: "61%", overflowY: "auto", py: 2 }}>
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
                            message.user._id === user._id
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
                            marginLeft: message.user._id === user._id ? 0 : 1,
                            marginRight: message.user._id === user._id ? 1 : 0,
                          }}
                        />

                        <Box
                          sx={{
                            backgroundColor: COLORS.offwhite,
                            padding: 1.5,
                            borderRadius: 2,
                            maxWidth: "60%",
                            marginLeft: message.user._id === user._id ? 0 : 1,
                            marginRight: message.user._id === user._id ? 1 : 0,
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
                                message.user._id === user._id
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

          <Box sx={{ p: 2 }}>
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
        </Box>
      )}
    </Box>
  );
};

export default Conversations;

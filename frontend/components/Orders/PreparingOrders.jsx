import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { COLORS, SIZES } from "../../styles/theme";
import LottieView from "lottie-react-native";
import Modal, { ModalContent, SlideAnimation } from "react-native-modals";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import baseUrl from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";

const PreparingOrders = ({ preparingOrders }) => {
  const animation = useRef(null);
  const navigation = useNavigation();
  const [showNote, setShowNote] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const markOrderAsReady = async (orderId) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };

      await axios.post(
        `${baseUrl}/api/orders/mark-as-ready`,
        { orderId },
        config
      );

      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Success ✅",
        text2: "Order marked as ready for pickup!",
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Error ❌",
        text2: error,
      });
    }
  };

  return (
    <>
      {preparingOrders.length === 0 ? (
        <View
          style={{
            width: SIZES.width,
            height: SIZES.height / 1.5,
            justifyContent: "center",
            alignItems: "center",
            top: 0,
          }}
        >
          <LottieView
            autoPlay
            ref={animation}
            style={{ width: "50%", height: "50%" }}
            source={require("../../assets/anime/emptyOrders.json")}
          />
          <Text
            style={{
              fontSize: 16,
              fontFamily: "regular",
              marginTop: -20,
              color: COLORS.gray,
            }}
          >
            No orders found.
          </Text>
        </View>
      ) : (
        <View>
          <FlatList
            data={preparingOrders}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 10, marginBottom: SIZES.height / 12 }}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: COLORS.white,
                  marginBottom: 10,
                  marginHorizontal: 10,
                }}
              >
                <Image
                  source={require("../../assets/images/pin.png")}
                  style={{
                    height: 35,
                    width: 45,
                    position: "absolute",
                    zIndex: 2,
                    right: 5,
                    top: 5,
                  }}
                />
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={{ uri: item?.userId?.profile?.url }}
                    style={{
                      width: 25,
                      height: 25,
                      borderRadius: 99,
                      marginRight: 5,
                    }}
                  />
                  <View>
                    <Text style={{ fontSize: 14, fontFamily: "bold" }}>
                      Order #: {item?._id}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "bold",
                        color: COLORS.gray,
                        marginTop: -7,
                      }}
                    >
                      Customer: {item?.userId?.username}
                    </Text>
                  </View>
                </View>

                <View style={{ marginTop: 10 }}>
                  {item?.orderItems?.map((orderItem) => (
                    <>
                      <TouchableOpacity
                        key={orderItem?._id}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginTop: 10,
                        }}
                        onPress={() => {
                          if (orderItem?.instructions) {
                            setShowNote(orderItem?._id);
                          }
                        }}
                      >
                        {orderItem?.instructions && (
                          <Image
                            source={require("../../assets/images/note.png")}
                            style={{
                              height: 20,
                              width: 20,
                              position: "absolute",
                              zIndex: 1,
                              top: -8,
                              left: 25,
                            }}
                          />
                        )}

                        <View style={{ flexDirection: "row" }}>
                          <Image
                            source={{ uri: orderItem?.foodId?.imageUrl?.url }}
                            style={{
                              height: 40,
                              width: 40,
                              objectFit: "cover",
                              borderRadius: 10,
                            }}
                          />
                          <View>
                            <Text
                              style={{
                                fontFamily: "regular",
                                fontSize: 12,
                                marginLeft: 10,
                              }}
                            >
                              {orderItem?.quantity}x {orderItem?.foodId?.title}
                            </Text>

                            {orderItem?.additives?.length > 0 ? (
                              <>
                                {orderItem?.additives?.map((additive) => (
                                  <Text
                                    key={additive?._id}
                                    style={{
                                      fontFamily: "regular",
                                      fontSize: 12,
                                      color: COLORS.gray,
                                      marginLeft: 15,
                                    }}
                                  >
                                    + {additive?.title}
                                  </Text>
                                ))}
                              </>
                            ) : (
                              <Text
                                style={{
                                  fontFamily: "regular",
                                  fontSize: 12,
                                  color: COLORS.gray,
                                  marginLeft: 15,
                                }}
                              >
                                - No Additives
                              </Text>
                            )}
                          </View>
                        </View>
                        <View>
                          <Text style={{ fontFamily: "regular", fontSize: 12 }}>
                            ₱ {(orderItem?.totalPrice).toFixed(2)}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <Modal
                        visible={showNote === orderItem?._id}
                        onTouchOutside={() => {
                          setShowNote(null);
                        }}
                        modalAnimation={
                          new SlideAnimation({ slideFrom: "bottom" })
                        }
                        onHardwareBackPress={() => {
                          setShowNote(null);
                        }}
                      >
                        <View
                          style={{
                            height: 10,
                            backgroundColor: COLORS.primary,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        />
                        <Image
                          source={require("../../assets/images/pin.png")}
                          style={{
                            height: 35,
                            width: 45,
                            position: "absolute",
                            zIndex: 2,
                            right: 5,
                            top: 5,
                          }}
                        />
                        <ModalContent
                          style={{
                            height: "auto",
                            width: SIZES.width / 1.3,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "bold",
                              fontSize: 20,
                              marginBottom: 10,
                              marginTop: -15,
                            }}
                          >
                            Preference
                          </Text>

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <View style={{ flexDirection: "row" }}>
                              <Image
                                source={{
                                  uri: orderItem?.foodId?.imageUrl?.url,
                                }}
                                style={{
                                  height: 40,
                                  width: 40,
                                  objectFit: "cover",
                                  borderRadius: 10,
                                }}
                              />
                              <View>
                                <Text
                                  style={{
                                    fontFamily: "regular",
                                    fontSize: 12,
                                    marginLeft: 10,
                                  }}
                                >
                                  {orderItem?.foodId?.title}
                                </Text>

                                {orderItem?.additives?.length > 0 ? (
                                  <>
                                    {orderItem?.additives?.map((additive) => (
                                      <Text
                                        key={additive?._id}
                                        style={{
                                          fontFamily: "regular",
                                          fontSize: 12,
                                          color: COLORS.gray,
                                          marginLeft: 15,
                                        }}
                                      >
                                        + {additive?.title}
                                      </Text>
                                    ))}
                                  </>
                                ) : (
                                  <Text
                                    style={{
                                      fontFamily: "regular",
                                      fontSize: 12,
                                      color: COLORS.gray,
                                      marginLeft: 15,
                                    }}
                                  >
                                    - No Additives
                                  </Text>
                                )}
                              </View>
                            </View>
                          </View>

                          <Text
                            style={{
                              fontFamily: "regular",
                              fontSize: 14,
                              textAlign: "justify",
                              marginTop: 10,
                            }}
                          >
                            {orderItem?.instructions}
                          </Text>

                          <Text
                            style={{
                              fontFamily: "regular",
                              fontSize: 14,
                              textAlign: "right",
                              marginTop: 10,
                            }}
                          >
                            - from {item?.userId?.username}
                          </Text>
                        </ModalContent>
                      </Modal>
                    </>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={() => {
                    setSelectedOrderId(item?._id);
                    setShowConfirmation(true);
                  }}
                  style={{
                    backgroundColor: COLORS.primary,
                    padding: 10,
                    borderRadius: 15,
                    marginTop: 20,
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      fontFamily: "bold",
                      textAlign: "center",
                      fontSize: 16,
                    }}
                  >
                    M A R K {"  "} A S {"  "} R E A D Y
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <Modal
            visible={showConfirmation}
            onTouchOutside={() => {
              setShowConfirmation(false);
              setSelectedOrderId(null);
            }}
            modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
            onHardwareBackPress={() => {
              setShowConfirmation(false);
              setSelectedOrderId(null);
            }}
          >
            <View
              style={{
                height: 10,
                backgroundColor: COLORS.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: 3,
                  backgroundColor: COLORS.white,
                  width: SIZES.width / 5,
                  borderRadius: 10,
                }}
              />
            </View>
            <ModalContent
              style={{
                height: SIZES.height / 4,
                width: SIZES.width / 1.3,
              }}
            >
              <Text
                style={{
                  fontFamily: "bold",
                  fontSize: 20,
                  marginBottom: 10,
                  marginTop: -15,
                }}
              >
                Mark Order as Ready?
              </Text>
              <Text
                style={{
                  fontFamily: "regular",
                  fontSize: 14,
                  textAlign: "justify",
                }}
              >
                Is this order done preparing? Once you confirm, the order will
                be marked as ready for pickup.
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowConfirmation(false);
                    setSelectedOrderId(null);
                  }}
                  style={{
                    backgroundColor: COLORS.gray,
                    padding: 10,
                    borderRadius: 10,
                    width: "auto",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      fontFamily: "bold",
                      textAlign: "center",
                      fontSize: 14,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    markOrderAsReady(selectedOrderId);
                    setShowConfirmation(false);
                  }}
                  style={{
                    backgroundColor: COLORS.primary,
                    padding: 10,
                    borderRadius: 10,
                    width: "auto",
                    alignItems: "center",
                  }}
                >
                  {loading ? (
                    <ActivityIndicator
                      style={{ fontSize: 16 }}
                      color={COLORS.white}
                    />
                  ) : (
                    <Text
                      style={{
                        color: COLORS.white,
                        fontFamily: "bold",
                        textAlign: "center",
                        fontSize: 14,
                      }}
                    >
                      Confirm
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ModalContent>
          </Modal>
        </View>
      )}
    </>
  );
};

export default PreparingOrders;

const styles = StyleSheet.create({});

import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import BackBtn from "../../components/BackBtn";
import Divider from "../../components/Divider";
import { COLORS, SIZES } from "../../styles/theme";
import Modal, { ModalContent, SlideAnimation } from "react-native-modals";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import baseUrl from "../../assets/common/baseUrl";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import { createRefund } from "../../hook/paymongoService";
import MapView, { Marker } from "react-native-maps";
import { addDoc, collection } from "@react-native-firebase/firestore";
import { database } from "../../config/firebase";

const PendingOrderDetails = () => {
  const route = useRoute();
  const order = route.params;
  const navigation = useNavigation();
  const [region, setRegion] = useState(null);
  const [showNote, setShowNote] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAcceptConfirmation, setShowAcceptConfirmation] = useState(false);
  const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);

  const rejectOrder = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };

      if (
        order?.paymentStatus === "Paid" &&
        order?.paymentMethod === "gcash" &&
        order?.orderStatus === "Pending"
      ) {
        const amount = order?.totalAmount * 100;
        const reason = "Order rejected by the restaurant";
        const paymentId = order?.paymentId;
        const refundPayment = await createRefund(amount, reason, paymentId);
        if (refundPayment.data.attributes.status === "pending") {
          await axios.post(
            `${baseUrl}/api/orders/reject`,
            { orderId: order._id },
            config
          );

          navigation.goBack();
          setLoading(false);
          Toast.show({
            type: "success",
            text1: "Success ✅",
            text2: "Order rejected successfully!",
          });
        } else {
          throw new Error("Failed to process refund");
        }
      } else {
        await axios.post(
          `${baseUrl}/api/orders/reject`,
          { orderId: order._id },
          config
        );

        navigation.goBack();
        setLoading(false);
        Toast.show({
          type: "success",
          text1: "Success ✅",
          text2: "Order rejected successfully!",
        });
      }
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

  const acceptOrder = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };

      await axios.post(
        `${baseUrl}/api/orders/accept`,
        { orderId: order._id },
        config
      );

      const message = {
        _id: new Date().getTime().toString(),
        text: `Thank you for placing your order! We are now preparing your order.`,
        createdAt: new Date(),
        user: {
          _id: order?.restaurant?._id,
          name: order?.restaurant?.title,
          avatar: order?.restaurant?.logoUrl?.url,
        },
        receiverId: order?.userId?._id,
        receiverName: order?.userId?.username,
        receiverAvatar: order?.userId?.profile?.url,
      };

      await addDoc(collection(database, "chats"), message);

      navigation.goBack();
      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Success ✅",
        text2: "Order accepted successfully!",
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

  useFocusEffect(
    React.useCallback(() => {
      if (order?.deliveryAddress?.coordinates) {
        setRegion({
          latitude: order?.deliveryAddress?.coordinates?.latitude,
          longitude: order?.deliveryAddress?.coordinates?.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    }, [order?.deliveryAddress?.coordinates])
  );

  return (
    <ScrollView>
      <View style={{ marginHorizontal: 20 }}>
        <BackBtn onPress={() => navigation.goBack()} />
        <Text style={styles.heading}>Order Details</Text>

        {order?.deliveryAddress?.address && (
          <View
            style={{
              borderColor: COLORS.gray2,
              borderRadius: 15,
              padding: 10,
              backgroundColor: COLORS.white,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontFamily: "bold", fontSize: 18 }}>
              To be delivered to:
            </Text>

            <Text
              style={{
                color: COLORS.gray,
                fontFamily: "regular",
                fontSize: 12,
              }}
            >
              {order?.deliveryAddress?.address}
            </Text>

            <View style={styles.mapContainer}>
              {region && (
                <MapView
                  style={{ height: SIZES.height / 5.2 }}
                  region={{
                    latitude: region?.latitude,
                    longitude: region?.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    title="Customer Location"
                    coordinate={{
                      latitude: region?.latitude,
                      longitude: region?.longitude,
                    }}
                  />
                </MapView>
              )}
            </View>
          </View>
        )}

        <View
          style={{
            borderColor: COLORS.gray2,
            borderRadius: 15,
            padding: 10,
            backgroundColor: COLORS.white,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontFamily: "bold", fontSize: 18 }}>
            Order Summary
          </Text>

          <View>
            {order?.orderItems?.map((item) => (
              <>
                <TouchableOpacity
                  key={item?._id}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                  }}
                  onPress={() => {
                    if (item?.instructions) {
                      setShowNote(item?._id);
                    }
                  }}
                >
                  {item?.instructions && (
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
                      source={{
                        uri: item?.foodId
                          ? item?.foodId?.imageUrl?.url
                          : item?.productId?.imageUrl?.url,
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
                        {item?.quantity}x{" "}
                        {item?.foodId
                          ? item?.foodId?.title
                          : item?.productId?.title}
                      </Text>

                      {item?.foodId && (
                        <>
                          {item?.additives?.length > 0 ? (
                            <>
                              {item?.additives?.map((additive) => (
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
                        </>
                      )}
                    </View>
                  </View>
                  <View>
                    <Text style={{ fontFamily: "regular", fontSize: 12 }}>
                      ₱ {(item?.totalPrice).toFixed(2)}
                    </Text>
                  </View>
                </TouchableOpacity>

                <Modal
                  visible={showNote === item?._id}
                  onTouchOutside={() => {
                    setShowNote(null);
                  }}
                  modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
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
                            uri: item?.foodId?.imageUrl?.url,
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
                            {item?.foodId?.title}
                          </Text>

                          {item?.additives?.length > 0 ? (
                            <>
                              {item?.additives?.map((additive) => (
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
                      {item?.instructions}
                    </Text>

                    <Text
                      style={{
                        fontFamily: "regular",
                        fontSize: 14,
                        textAlign: "right",
                        marginTop: 10,
                      }}
                    >
                      - from {order?.userId?.username}
                    </Text>
                  </ModalContent>
                </Modal>
              </>
            ))}
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <Text style={{ fontFamily: "regular", fontSize: 12 }}>
              Delivery Option:
            </Text>
            <Text
              style={{
                fontFamily: "regular",
                fontSize: 12,
              }}
            >
              {order?.deliveryOption === "pickup"
                ? "For pickup"
                : order?.deliveryOption === "standard"
                ? "For delivery"
                : order?.deliveryOption}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontFamily: "regular", fontSize: 12 }}>
              Payment Method:
            </Text>
            <Text
              style={{
                fontFamily: "regular",
                fontSize: 12,
              }}
            >
              {order?.paymentMethod === "gcash"
                ? "Gcash"
                : order?.paymentMethod === "cod"
                ? "Cash On Delivery"
                : order?.paymentMethod}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontFamily: "regular", fontSize: 12 }}>
              Payment Status:
            </Text>
            <Text
              style={{
                fontFamily: "regular",
                fontSize: 12,
                backgroundColor:
                  order?.paymentStatus === "Paid"
                    ? COLORS.primary
                    : COLORS.secondary,
                color: COLORS.white,
                paddingHorizontal: 10,
                borderRadius: 15,
              }}
            >
              {order?.paymentStatus}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontFamily: "regular", fontSize: 12 }}>
              Subtotal:
            </Text>
            <Text
              style={{
                fontFamily: "regular",
                fontSize: 12,
              }}
            >
              ₱ {(order?.subTotal).toFixed(2)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontFamily: "regular", fontSize: 12 }}>
              Delivery Fee:
            </Text>
            <Text
              style={{
                fontFamily: "regular",
                fontSize: 12,
              }}
            >
              ₱ {order?.deliveryFee}
            </Text>
          </View>

          <Divider />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontFamily: "bold", fontSize: 16 }}>Total:</Text>
            <Text
              style={{
                fontFamily: "bold",
                fontSize: 16,
              }}
            >
              ₱ {(order?.subTotal + order?.deliveryFee).toFixed(2)}
            </Text>
          </View>

          {order?.orderNote && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontFamily: "bold", fontSize: 18 }}>
                Delivery Note:
              </Text>

              <Text style={{ fontFamily: "regular", fontSize: 12 }}>
                {order?.orderNote}
              </Text>
            </View>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => setShowRejectConfirmation(true)}
            style={{
              backgroundColor: COLORS.secondary,
              padding: 10,
              borderRadius: 15,
              width: SIZES.width / 2.3,
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Entypo name="trash" size={16} color={COLORS.white} />
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: "bold",
                  textAlign: "center",
                  fontSize: 16,
                  marginLeft: 5,
                }}
              >
                R E J E C T
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowAcceptConfirmation(true)}
            style={{
              backgroundColor: COLORS.primary,
              padding: 10,
              borderRadius: 15,
              width: SIZES.width / 2.3,
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome
                name="check-circle-o"
                size={18}
                color={COLORS.white}
              />
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: "bold",
                  textAlign: "center",
                  fontSize: 16,
                  marginLeft: 5,
                }}
              >
                A C C E P T
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={
          showAcceptConfirmation
            ? showAcceptConfirmation
            : showRejectConfirmation
        }
        onTouchOutside={() => {
          showAcceptConfirmation
            ? setShowAcceptConfirmation(false)
            : setShowRejectConfirmation(false);
        }}
        modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
        onHardwareBackPress={() => {
          showAcceptConfirmation
            ? setShowAcceptConfirmation(false)
            : setShowRejectConfirmation(false);
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
            height: SIZES.height / 4.3,
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
            {showAcceptConfirmation ? "Accept Order?" : "Reject Order?"}
          </Text>
          <Text
            style={{
              fontFamily: "regular",
              fontSize: 14,
            }}
          >
            {showAcceptConfirmation
              ? "Are you sure you want to accept this order?"
              : "Are you sure you want to reject this order?"}
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
                showAcceptConfirmation
                  ? setShowAcceptConfirmation(false)
                  : setShowRejectConfirmation(false);
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
                  fontSize: 16,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                showAcceptConfirmation ? acceptOrder() : rejectOrder();
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
                  style={{ fontSize: 16, width: SIZES.width / 6 }}
                  color={COLORS.white}
                />
              ) : (
                <Text
                  style={{
                    color: COLORS.white,
                    fontFamily: "bold",
                    textAlign: "center",
                    fontSize: 16,
                    width: SIZES.width / 6,
                  }}
                >
                  Confirm
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ModalContent>
      </Modal>
    </ScrollView>
  );
};

export default PendingOrderDetails;

const styles = StyleSheet.create({
  heading: {
    fontFamily: "bold",
    fontSize: 24,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  mapContainer: {
    width: "100%",
    height: "auto",
    borderColor: COLORS.gray2,
    borderWidth: 1,
    borderRadius: 15,
    overflow: "hidden",
  },
});

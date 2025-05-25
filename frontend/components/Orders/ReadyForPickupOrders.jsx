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
import QRCode from "react-native-qrcode-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseUrl from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";

const ReadyForPickupOrders = ({ readyForPickupOrders }) => {
  const [showQR, setShowQR] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const animation = useRef(null);

  const markOrderAsCompleted = async (orderId) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };

      await axios.post(
        `${baseUrl}/api/orders/mark-as-completed`,
        { orderId },
        config
      );

      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Success ✅",
        text2: "Order marked as completed!",
      });
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Error ❌",
        text2: error.message,
      });
    }
  };

  return (
    <>
      {readyForPickupOrders.length === 0 ? (
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
            data={readyForPickupOrders}
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
                <Text style={{ fontSize: 16, fontFamily: "bold" }}>
                  Order #: {item?._id}
                </Text>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {item?.deliveryOption === "standard" && (
                    <Image
                      source={require("../../assets/images/delivery.png")}
                      style={{
                        width: 30,
                        height: 30,
                        marginRight: 10,
                      }}
                    />
                  )}

                  {item?.deliveryOption === "pickup" && (
                    <Image
                      source={require("../../assets/images/pickup.png")}
                      style={{
                        width: 30,
                        height: 30,
                        marginRight: 10,
                      }}
                    />
                  )}
                  <View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "bold",
                        color: COLORS.gray,
                      }}
                    >
                      Customer: {item?.userId?.username}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "regular",
                        color: COLORS.gray,
                      }}
                    >
                      Delivery option:{" "}
                      {item?.deliveryOption === "standard"
                        ? "For delivery"
                        : "For pickup"}
                    </Text>
                  </View>
                </View>

                {item?.deliveryOption === "standard" && (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedItem(item);
                      setShowQR(true);
                    }}
                    style={{
                      height: 30,
                      width: "100%",
                      marginTop: 10,
                      backgroundColor: COLORS.primary,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "bold",
                        color: COLORS.white,
                        fontSize: 12,
                      }}
                    >
                      D E L I V E R {"  "} O R D E R
                    </Text>
                  </TouchableOpacity>
                )}

                {item?.deliveryOption === "pickup" && (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedItem(item);
                      setShowConfirmation(true);
                    }}
                    style={{
                      height: 30,
                      width: "100%",
                      marginTop: 10,
                      backgroundColor: COLORS.primary,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "bold",
                        color: COLORS.white,
                        fontSize: 12,
                      }}
                    >
                      O R D E R {"  "} R E C E I V E D ?
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />

          <Modal
            visible={showQR}
            onTouchOutside={() => {
              setShowQR(false);
              setSelectedItem(null);
            }}
            modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
            onHardwareBackPress={() => {
              setShowQR(false);
              setSelectedItem(null);
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
                width: SIZES.width / 1.5,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "bold",
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                Please present this QR code to the delivery person to accept the
                order.
              </Text>
              <QRCode
                value={`https://halal-express-rider.vercel.app/accept-order/${selectedItem?._id}`}
                size={200}
                logo={require("../../assets/logo.png")}
                logoBackgroundColor="transparent"
              />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "regular",
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                {`https://halal-express-rider.vercel.app/accept-order/${selectedItem?._id}`}
              </Text>
            </ModalContent>
          </Modal>

          <Modal
            visible={showConfirmation}
            onTouchOutside={() => {
              setShowConfirmation(false);
              setSelectedItem(null);
            }}
            modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
            onHardwareBackPress={() => {
              setShowConfirmation(false);
              setSelectedItem(null);
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
                width: SIZES.width / 1.2,
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
                Order Received?
              </Text>
              <Text
                style={{
                  fontFamily: "regular",
                  fontSize: 14,
                  textAlign: "justify",
                }}
              >
                Is the order already picked up by the customer? If yes, please
                confirm the order by clicking the button below. This will mark
                the order as completed
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
                    setSelectedItem(null);
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
                    markOrderAsCompleted(selectedItem?._id);
                    setShowConfirmation(false);
                    setSelectedItem(null);
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
                        fontSize: 14,
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
        </View>
      )}
    </>
  );
};

export default ReadyForPickupOrders;

const styles = StyleSheet.create({});

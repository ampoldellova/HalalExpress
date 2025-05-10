import {
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

const ReadyForPickupOrders = ({ readyForPickupOrders }) => {
  const [showQR, setShowQR] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const animation = useRef(null);

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
                value={`http://localhost:5173/accept-order/${selectedItem?._id}`}
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
                http://localhost:5173/accept-order
              </Text>
            </ModalContent>
          </Modal>
        </View>
      )}
    </>
  );
};

export default ReadyForPickupOrders;

const styles = StyleSheet.create({});

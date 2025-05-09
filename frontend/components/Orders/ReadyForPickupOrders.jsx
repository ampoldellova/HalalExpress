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
            }}
            modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
            onHardwareBackPress={() => {
              setShowQR(false);
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
              <QRCode value="https://github.com/ampoldellova" />
            </ModalContent>
          </Modal>
        </View>
      )}
    </>
  );
};

export default ReadyForPickupOrders;

const styles = StyleSheet.create({});

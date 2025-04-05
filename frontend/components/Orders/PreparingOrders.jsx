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

const PreparingOrders = ({ preparingOrders }) => {
  const animation = useRef(null);
  const [showNote, setShowNote] = useState(false);
  const [loading, setLoading] = useState(false);

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
                  backgroundColor: "#f8f8f8",
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
                          <Text
                            style={{
                              fontFamily: "regular",
                              fontSize: 14,
                              textAlign: "justify",
                            }}
                          >
                            {orderItem?.instructions}
                          </Text>
                        </ModalContent>
                      </Modal>
                    </>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    backgroundColor: COLORS.primary,
                    padding: 10,
                    borderRadius: 15,
                    marginTop: 20,
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
                        fontSize: 16,
                      }}
                    >
                      M A R K {"  "} A S {"  "} R E A D Y
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </>
  );
};

export default PreparingOrders;

const styles = StyleSheet.create({});

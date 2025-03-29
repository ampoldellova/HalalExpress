import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import BackBtn from "../../components/BackBtn";
import { COLORS, SIZES } from "../../styles/theme";
import Octicons from "@expo/vector-icons/Octicons";
import Divider from "../../components/Divider";
import { BottomModal, ModalContent, SlideAnimation } from "react-native-modals";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createRefund } from "../../hook/paymongoService";
import axios from "axios";
import baseUrl from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import { RatingInput } from "react-native-stock-star-rating";

const OrderDetails = () => {
  const route = useRoute();
  const { order } = route.params;
  const navigation = useNavigation();
  const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
  const [showRateOrderModal, setShowRateOrderModal] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const [loading, setLoading] = useState(false);

  const cancelOrder = async () => {
    setLoading(true);
    if (!reason) {
      setLoading(false);
      setReasonError(true);
    } else {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${JSON.parse(token)}`,
            },
          };

          if (
            order.paymentStatus === "Paid" &&
            order.paymentMethod === "gcash" &&
            order.orderStatus === "Pending"
          ) {
            const amount = order.subTotal * 100;
            const paymentId = order.paymentId;
            const refundPayment = await createRefund(amount, reason, paymentId);
            console.log(refundPayment);
            if (refundPayment.data.attributes.status === "pending") {
              await axios.post(
                `${baseUrl}/api/orders/cancel`,
                { orderId: order._id },
                config
              );
              navigation.navigate("order-page");
              Toast.show({
                type: "success",
                text1: "Success ✅",
                text2: "Your order has been cancelled successfully",
              });
              setReason("");
              setLoading(false);
              setShowCancelOrderModal(false);
            } else {
              throw new Error("Failed to process refund");
            }
          } else if (
            order.paymentStatus === "Pending" &&
            order.orderStatus === "Pending"
          ) {
            await axios.post(
              `${baseUrl}/api/orders/cancel`,
              { orderId: order._id },
              config
            );
            navigation.navigate("order-page");
            Toast.show({
              type: "success",
              text1: "Success ✅",
              text2: "Your order has been cancelled successfully",
            });
            setReason("");
            setLoading(false);
            setShowCancelOrderModal(false);
          } else {
            Toast.show({
              type: "error",
              text1: "Error ❌",
              text2:
                "You cannot cancel this order as it is not in a cancellable state",
            });
            setLoading(false);
            setShowCancelOrderModal(false);
          }
        } else {
          Toast.show({
            type: "error",
            text1: "Error ❌",
            text2: "You must be logged in to cancel an order",
          });
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error ❌",
          text2: error.message,
        });
      }
    }
  };

  return (
    <View>
      <ScrollView>
        <View style={{ marginHorizontal: 20 }}>
          <BackBtn onPress={() => navigation.goBack()} />
          <Text style={styles.heading}>Order Details</Text>

          <View
            style={{
              borderColor: COLORS.gray2,
              borderRadius: 15,
              padding: 10,
              marginTop: 10,
              backgroundColor: COLORS.white,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontFamily: "bold", fontSize: 18 }}>
                Order Status
              </Text>
              <Text
                style={{
                  fontFamily: "bold",
                  fontSize: 12,
                  backgroundColor:
                    order?.orderStatus === "Pending"
                      ? COLORS.gray2
                      : order?.orderStatus === "cancelled by customer"
                      ? COLORS.gray2
                      : order?.orderStatus === "Preparing"
                      ? COLORS.secondary
                      : order?.orderStatus === "Ready for pickup"
                      ? COLORS.tertiary
                      : COLORS.primary,
                  color: COLORS.white,
                  paddingHorizontal: 10,
                  borderRadius: 15,
                }}
              >
                {order?.orderStatus === "cancelled by customer"
                  ? "Cancelled by you"
                  : order?.orderStatus === "Delivered"
                  ? "Delivered ✔"
                  : order?.orderStatus}
              </Text>
            </View>

            {order.orderStatus === "Pending" && (
              <>
                <Text
                  style={{
                    fontFamily: "regular",
                    fontSize: 12,
                    color: COLORS.gray,
                  }}
                >
                  Your order is pending. Please wait for the restaurant to
                  confirm your order.
                </Text>

                <TouchableOpacity
                  onPress={() => setShowCancelOrderModal(true)}
                  style={{
                    backgroundColor: COLORS.primary,
                    padding: 10,
                    borderRadius: 15,
                    marginTop: 10,
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
                    C A N C E L{"   "} O R D E R
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {order.orderStatus === "Preparing" && (
              <Text
                style={{
                  fontFamily: "regular",
                  fontSize: 12,
                  color: COLORS.gray,
                }}
              >
                The restaurant is preparing your order. Please wait for the
                restaurant to finish your order.
              </Text>
            )}

            {order.deliveryOption === "standard" &&
              order.orderStatus === "Ready for pickup" && (
                <Text
                  style={{
                    fontFamily: "regular",
                    fontSize: 12,
                    color: COLORS.gray,
                  }}
                >
                  Your order is prepared and ready for pickup! The restaurant's
                  in-house delivery rider will be arriving shortly to collect
                  and deliver it to you.
                </Text>
              )}

            {order.deliveryOption === "pickup" &&
              order.orderStatus === "Ready for pickup" && (
                <Text
                  style={{
                    fontFamily: "regular",
                    fontSize: 12,
                    color: COLORS.gray,
                  }}
                >
                  Your order is prepared and ready for pickup! Please head to
                  the restaurant to collect your order.
                </Text>
              )}

            {order.deliveryOption === "standard" &&
              order.orderStatus === "Out for delivery" && (
                <Text
                  style={{
                    fontFamily: "regular",
                    fontSize: 12,
                    color: COLORS.gray,
                  }}
                >
                  Your order is out for delivery! The restaurant's in-house
                  delivery rider is on the way to deliver your order to you.
                </Text>
              )}

            {order.orderStatus === "cancelled by customer" &&
              order.paymentStatus === "Refunded" && (
                <Text
                  style={{
                    fontFamily: "regular",
                    fontSize: 12,
                    color: COLORS.gray,
                  }}
                >
                  This order has been cancelled by you. If you have any
                  questions, please contact the restaurant. Refund will be
                  processed within 3-5 business days.
                </Text>
              )}

            {order.orderStatus === "cancelled by customer" &&
              order.paymentStatus === "Cancelled" && (
                <Text
                  style={{
                    fontFamily: "regular",
                    fontSize: 12,
                    color: COLORS.gray,
                  }}
                >
                  This order has been cancelled by you. If you have any
                  questions, please contact the restaurant.
                </Text>
              )}

            {order.orderStatus === "Delivered" && (
              <>
                <Text
                  style={{
                    fontFamily: "regular",
                    fontSize: 12,
                    color: COLORS.gray,
                  }}
                >
                  Your order has been delivered! Please leave us a review and
                  feedback about your order.
                </Text>

                <TouchableOpacity
                  onPress={() => setShowRateOrderModal(true)}
                  style={{
                    backgroundColor: COLORS.primary,
                    padding: 10,
                    borderRadius: 15,
                    marginTop: 10,
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
                    R A T E{"   "} O R D E R
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View
            style={{
              borderColor: COLORS.gray2,
              borderRadius: 15,
              padding: 10,
              backgroundColor: COLORS.white,
              marginTop: 10,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Image
                source={{ uri: order?.restaurant?.logoUrl?.url }}
                style={{
                  height: 60,
                  width: 60,
                  objectFit: "cover",
                  borderRadius: 10,
                }}
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontFamily: "bold", fontSize: 18 }}>
                  {order?.restaurant?.title}
                </Text>
                <Text
                  style={{
                    color: COLORS.gray,
                    fontSize: 12,
                    fontFamily: "regular",
                  }}
                >
                  Ordered on:{" "}
                  {new Date(order?.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(order?.createdAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Text>
                <Text
                  style={{
                    color: COLORS.gray,
                    fontSize: 12,
                    fontFamily: "regular",
                  }}
                >
                  Order #: {order?._id}
                </Text>
                <Text
                  style={{
                    color: COLORS.gray,
                    fontSize: 12,
                    fontFamily: "regular",
                  }}
                >
                  Order for:{" "}
                  {order?.deliveryOption === "standard" ? "Delivery" : "Pickup"}
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 10, flexDirection: "row", width: "90%" }}>
              <Octicons name="location" size={20} color={COLORS.gray} />
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontFamily: "regular", color: COLORS.gray }}>
                  Order from:
                </Text>
                <Text style={{ fontFamily: "medium" }}>
                  {order?.restaurant?.coords?.address}
                </Text>
              </View>
            </View>

            {order.deliveryOption === "standard" && (
              <View
                style={{ marginTop: 20, flexDirection: "row", width: "100%" }}
              >
                <Octicons name="location" size={20} color={COLORS.gray} />
                <View style={{ marginLeft: 10, width: "80%" }}>
                  <Text style={{ fontFamily: "regular", color: COLORS.gray }}>
                    To be delivered at:
                  </Text>
                  <Text style={{ fontFamily: "medium" }}>
                    {order?.deliveryAddress}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View
            style={{
              borderColor: COLORS.gray2,
              borderRadius: 15,
              padding: 10,
              marginTop: 10,
              backgroundColor: COLORS.white,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontFamily: "bold", fontSize: 18 }}>
              Order Summary
            </Text>

            <View>
              {order?.orderItems?.map((item) => (
                <View
                  key={item?._id}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={{ uri: item?.foodId?.imageUrl?.url }}
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
                        {item?.quantity}x {item?.foodId?.title}
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
                  <View>
                    <Text style={{ fontFamily: "regular", fontSize: 12 }}>
                      ₱ {(item?.totalPrice).toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
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

            <View style={{ marginTop: 10 }}>
              <Text style={{ fontFamily: "bold", fontSize: 18 }}>
                Payment Method
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {order.paymentMethod === "cod" && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={require("../../assets/images/COD.png")}
                      style={{
                        height: 20,
                        width: 25,
                        objectFit: "cover",
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: "regular",
                        fontSize: 12,
                        marginLeft: 5,
                      }}
                    >
                      Cash On Delivery
                    </Text>
                  </View>
                )}

                {order.paymentMethod === "Pay at the counter" && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={require("../../assets/images/COD.png")}
                      style={{
                        height: 20,
                        width: 25,
                        objectFit: "cover",
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: "regular",
                        fontSize: 12,
                        marginLeft: 5,
                      }}
                    >
                      Pay at the counter
                    </Text>
                  </View>
                )}

                {order.paymentMethod === "gcash" && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={require("../../assets/images/gcash.png")}
                      style={{
                        height: 20,
                        width: 25,
                        objectFit: "cover",
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: "regular",
                        fontSize: 12,
                        marginLeft: 5,
                      }}
                    >
                      GCash
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomModal
        visible={showCancelOrderModal}
        onTouchOutside={() => {
          setShowCancelOrderModal(false);
          setReason("");
          setReasonError(false);
        }}
        swipeThreshold={100}
        modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
        onHardwareBackPress={() => {
          setShowCancelOrderModal(false);
          setReason("");
          setReasonError(false);
        }}
      >
        <View
          style={{
            height: 10,
            backgroundColor: COLORS.primary,
            width: SIZES.width,
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
        <ModalContent style={{ height: SIZES.height / 2.5, width: "100%" }}>
          <Text style={{ fontFamily: "bold", fontSize: 20, marginBottom: 5 }}>
            Cancel this order?
          </Text>
          <Text
            style={{ fontFamily: "regular", fontSize: 14, color: COLORS.gray }}
          >
            Are you sure you want to cancel this order? This action cannot be
            undone.
          </Text>

          <View
            style={[
              styles.inputWrapper(
                reasonError ? COLORS.secondary : COLORS.offwhite
              ),
              { height: 100, alignItems: "flex-start" },
            ]}
          >
            <MaterialIcons
              name="description"
              size={20}
              color={COLORS.gray}
              style={[styles.iconStyle, { marginTop: 13 }]}
            />
            <TextInput
              style={{
                marginVertical: 5,
                marginTop: 15,
                fontFamily: "regular",
                marginLeft: 5,
              }}
              placeholderTextColor={COLORS.gray}
              placeholder="Enter your reason here..."
              numberOfLines={3}
              value={reason}
              onChangeText={(e) => {
                setReason(e);
                setReasonError(false);
              }}
              multiline
            />
          </View>
          {reasonError && (
            <Text
              style={{
                fontFamily: "regular",
                fontSize: 14,
                color: COLORS.red,
                mt: 1,
              }}
            >
              *Please provide a reason for cancellation
            </Text>
          )}
          <TouchableOpacity
            onPress={() => cancelOrder()}
            style={{
              backgroundColor: COLORS.primary,
              padding: 10,
              borderRadius: 15,
              marginTop: 10,
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
              {loading ? (
                <ActivityIndicator
                  style={{ color: COLORS.white, fontSize: 16 }}
                />
              ) : (
                "C A N C E L    O R D E R"
              )}
            </Text>
          </TouchableOpacity>
        </ModalContent>
      </BottomModal>

      <BottomModal
        visible={showRateOrderModal}
        onTouchOutside={() => {
          setShowRateOrderModal(false);
        }}
        swipeThreshold={100}
        modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
        onHardwareBackPress={() => {
          setShowRateOrderModal(false);
        }}
      >
        <View
          style={{
            height: 10,
            backgroundColor: COLORS.primary,
            width: SIZES.width,
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
        <ModalContent style={{ height: SIZES.height / 2.5, width: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontFamily: "bold", fontSize: 20, marginTop: 10 }}>
              Rate this order
            </Text>

            <RatingInput rating={0} size={30} />
          </View>
          <Text
            style={{ fontFamily: "regular", fontSize: 14, color: COLORS.gray }}
          >
            Please rate your order and leave a review. Your feedback is
            important to us. Thank you!
          </Text>

          <View
            style={[
              styles.inputWrapper(
                reasonError ? COLORS.secondary : COLORS.offwhite
              ),
              { height: 100, alignItems: "flex-start" },
            ]}
          >
            <MaterialIcons
              name="description"
              size={20}
              color={COLORS.gray}
              style={[styles.iconStyle, { marginTop: 13 }]}
            />
            <TextInput
              style={{
                marginVertical: 5,
                marginTop: 15,
                fontFamily: "regular",
                marginLeft: 5,
              }}
              placeholderTextColor={COLORS.gray}
              placeholder="Enter your feedback here..."
              numberOfLines={3}
              multiline
            />
          </View>

          <TouchableOpacity
            onPress={() => {}}
            style={{
              backgroundColor: COLORS.primary,
              padding: 10,
              borderRadius: 15,
              marginTop: 10,
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
              {loading ? (
                <ActivityIndicator
                  style={{ color: COLORS.white, fontSize: 16 }}
                />
              ) : (
                "R A T E    O R D E R"
              )}
            </Text>
          </TouchableOpacity>
        </ModalContent>
      </BottomModal>
    </View>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  heading: {
    fontFamily: "bold",
    fontSize: 24,
    textAlign: "center",
    marginTop: 10,
  },
  inputWrapper: (borderColor) => ({
    borderColor: borderColor,
    backgroundColor: COLORS.lightWhite,
    borderWidth: 1,
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
    marginTop: 10,
  }),
});

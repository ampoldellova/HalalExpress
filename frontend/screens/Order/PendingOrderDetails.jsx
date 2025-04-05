import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import BackBtn from "../../components/BackBtn";
import Divider from "../../components/Divider";
import { COLORS } from "../../styles/theme";

const PendingOrderDetails = () => {
  const route = useRoute();
  const order = route.params;
  const navigation = useNavigation();

  return (
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
              {order?.paymentMethod === "cod" && (
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

              {order?.paymentMethod === "Pay at the counter" && (
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

              {order?.paymentMethod === "gcash" && (
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
  );
};

export default PendingOrderDetails;

const styles = StyleSheet.create({
  heading: {
    fontFamily: "bold",
    fontSize: 24,
    textAlign: "center",
    marginTop: 10,
  },
});

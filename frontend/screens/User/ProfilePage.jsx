import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { COLORS, SIZES } from "../../styles/theme";
import { AntDesign } from "@expo/vector-icons";
import ProfileTile from "../../components/User/ProfileTile";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { cleanCart, cleanUser } from "../../redux/UserReducer";
import Heading from "../../components/Heading";
import UserRestaurants from "../../components/Vendor/UserRestaurants";
import { SafeAreaView } from "react-native-safe-area-context";
import pages from "../../styles/page.style";
import SupplierStores from "../../components/Supplier/SupplierStores";
import Toast from "react-native-toast-message";
import baseUrl from "../../assets/common/baseUrl";
import axios from "axios";
import Loader from "../../components/Loader";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.user);
  const [restaurants, setRestaurants] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("id");
    await AsyncStorage.removeItem("token");
    dispatch(cleanUser());
    dispatch(cleanCart());

    Toast.show({
      type: "success",
      text1: "Logged out ✅",
      text2: "Successfully logged out",
    });
    navigation.navigate("bottom-navigation", { screen: "LoginPage" });
  };

  const getRestaurantsByOwner = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };

        const response = await axios.get(
          `${baseUrl}/api/restaurant/owner/${user?._id}`,
          config
        );
        setRestaurants(response.data.data);
        setLoading(false);
      } else {
        console.log("Authentication token not found");
      }
    } catch (err) {
      console.error("Error fetching user restaurants:", err);
      setError(err.message || "Failed to fetch restaurants.");
    } finally {
      setLoading(false);
    }
  };

  const getSupplierStoresByOwner = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };

        const response = await axios(
          `${baseUrl}/api/supplier/owner/${user?._id}`,
          config
        );
        setStores(response.data.data);
        setLoading(false);
      } else {
        console.log("Authentication token not found");
      }
    } catch (err) {
      console.error("Error fetching user supplier stores:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      const fetchData = async () => {
        if (user?.userType === "Vendor") {
          await getRestaurantsByOwner();
        } else if (user?.userType === "Supplier") {
          await getSupplierStoresByOwner();
        } else if (user?.userType === "Client") {
          setLoading(false);
        }
      };

      fetchData().catch((err) => console.error(err));
      return () => {
        setRestaurants([]);
        setStores([]);
      };
    }, [user])
  );

  return (
    <SafeAreaView>
      {loading ? (
        <Loader />
      ) : (
        <View style={pages.viewOne}>
          <View style={pages.viewTwo}>
            <TouchableOpacity
              onPress={() => navigation.navigate("edit-profile-page", { user })}
              style={styles.profile}
            >
              <View style={{ flexDirection: "row" }}>
                <Image
                  source={{ uri: user?.profile?.url }}
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 99,
                  }}
                />
                <View style={{ marginLeft: 5, marginTop: 3 }}>
                  <Text style={styles.text}>
                    {user === null ? "username" : user?.username}
                  </Text>
                  <Text style={styles.email}>
                    {user === null ? "email" : user?.email}
                  </Text>
                </View>
              </View>

              <TouchableOpacity onPress={handleLogout}>
                <AntDesign name="logout" size={24} color="red" />
              </TouchableOpacity>
            </TouchableOpacity>

            {user?.userType === "Client" && (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 25,
                    marginTop: 10,
                  }}
                >
                  <ProfileTile
                    title={"Orders"}
                    icon={"fast-food-outline"}
                    font={1}
                    onPress={() => navigation.navigate("order-page", user)}
                  />
                  <ProfileTile
                    title={"Addresses"}
                    icon={"location-outline"}
                    font={1}
                    onPress={() => navigation.navigate("address-page", user)}
                  />
                </View>
              </View>
            )}

            {user?.userType === "Vendor" && (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 25,
                    marginTop: 10,
                  }}
                >
                  <ProfileTile
                    title={"Orders"}
                    icon={"fast-food-outline"}
                    font={1}
                    onPress={() => navigation.navigate("order-page", user)}
                  />
                  <ProfileTile
                    title={"Addresses"}
                    icon={"location-outline"}
                    font={1}
                    onPress={() => navigation.navigate("address-page", user)}
                  />
                </View>
                <Heading heading={"Your Restaurants"} onPress={() => {}} />
                <UserRestaurants restaurants={restaurants} />
              </View>
            )}

            {user?.userType === "Supplier" && (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 25,
                    marginTop: 10,
                  }}
                >
                  <ProfileTile
                    title={"Orders"}
                    icon={"fast-food-outline"}
                    font={1}
                    onPress={() => navigation.navigate("order-page", user)}
                  />
                  <ProfileTile
                    title={"Addresses"}
                    icon={"location-outline"}
                    font={1}
                    onPress={() => navigation.navigate("address-page", user)}
                  />
                </View>
                <Heading heading={"Your Stores"} onPress={() => {}} />
                <SupplierStores stores={stores} />
              </View>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  text: {
    marginLeft: 10,
    fontFamily: "medium",
    color: COLORS.black,
  },
  email: {
    marginLeft: 10,
    fontFamily: "regular",
    color: COLORS.gray,
  },
  profile: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    height: "60%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  wrapper: {
    marginBottom: 20,
  },
  label: {
    fontFamily: "regular",
    fontSize: SIZES.xSmall,
    marginBottom: 5,
    marginEnd: 5,
    textAlign: "right",
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
  }),
});

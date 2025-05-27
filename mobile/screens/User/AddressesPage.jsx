import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../styles/theme";
import Button from "../../components/Button";
import Addresses from "../../components/User/Addresses";
import baseUrl from "../../assets/common/baseUrl";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddressesPage = () => {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);

  const getUserAddresses = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        };

        const response = await axios.get(
          `${baseUrl}/api/users/address/list`,
          config
        );
        setAddresses(response.data.addresses);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getUserAddresses();
    }, [])
  );

  return (
    <SafeAreaView style={{ marginHorizontal: 20 }}>
      <Text style={styles.heading}>Addresses</Text>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ marginTop: -35 }}
      >
        <Ionicons name="chevron-back-circle" size={30} color={COLORS.primary} />
      </TouchableOpacity>

      {addresses.length <= 0 ? (
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require("../../assets/images/empty.png")}
          />
          <Text style={styles.text}>
            You havent saved any addresses yet. Click Add New Address to get
            started.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("add-address-page")}
          >
            <Text style={styles.buttonText}>Add New Address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <FlatList
            data={addresses}
            scrollEnabled={true}
            style={{ marginTop: 30, height: SIZES.height / 1.3 }}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => (
              <Addresses item={item} getUserAddresses={getUserAddresses} />
            )}
          />
          <View style={styles.buttonContainer}>
            <Button
              title="A D D   N E W   A D D R E S S"
              onPress={() => navigation.navigate("add-address-page")}
              isValid={true}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AddressesPage;

const styles = StyleSheet.create({
  heading: {
    fontFamily: "bold",
    fontSize: 24,
    textAlign: "center",
    marginTop: 5,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: SIZES.height / 1.3,
  },
  text: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.gray,
    textAlign: "center",
    width: "70%",
    marginTop: 10,
  },
  image: {
    width: 200,
    height: 200,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 15,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontFamily: "regular",
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
});

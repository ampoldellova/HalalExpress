import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import React, { useState, useRef, useContext } from "react";
import Button from "../../components/Button";
import BackBtn from "../../components/BackBtn";
import { Formik } from "formik";
import * as Yup from "yup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../styles/theme";
import styles from "../../styles/login.style";
import LottieView from "lottie-react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginContext } from "../../contexts/LoginContext";
import baseUrl from "../../assets/common/baseUrl";
import { useDispatch, useSelector } from "react-redux";
import { addUser, updateCartCount } from "../../redux/UserReducer";
import { SafeAreaView } from "react-native-safe-area-context";
import pages from "../../styles/page.style";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 character")
    .required("Required"),
  email: Yup.string()
    .email("Provide a valid email address")
    .required("Required"),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const animation = useRef(null);
  const [loader, setLoader] = useState(false);
  const [obsecureText, setObsecureText] = useState(false);
  const { login, setLogin } = useContext(LoginContext);
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.user);

  const inValidForm = () => {
    Alert.alert(
      "Login Error 🚨",
      "Oops, Error logging in try again with correct credentials"
    );
  };

  const loginFunc = async (values) => {
    setLoader(true);
    try {
      const endpoint = `${baseUrl}/login`;
      const data = values;

      const response = await axios.post(endpoint, data);
      if (response.status === 200) {
        navigation.navigate("HomePage");
        Toast.show({
          type: "success",
          text1: "Logged in ✅",
          text2: "Successfully logged in",
        });
        setLoader(false);
        setLogin(true);
        dispatch(addUser(response.data));

        await AsyncStorage.setItem("id", JSON.stringify(response.data._id));
        await AsyncStorage.setItem(
          "token",
          JSON.stringify(response.data.userToken)
        );

        try {
          const token = await AsyncStorage.getItem("token");
          const config = {
            headers: {
              Authorization: `Bearer ${JSON.parse(token)}`,
            },
          };

          if (user?.userType === "Vendor") {
            const cartResponse = await axios.get(
              `${baseUrl}/api/cart/vendor`,
              config
            );
            dispatch(updateCartCount(cartResponse.data.cartItems.length));
          } else {
            const cartResponse = await axios.get(
              `${baseUrl}/api/cart/`,
              config
            );
            dispatch(updateCartCount(cartResponse.data.cartItems.length));
          }
        } catch (error) {}
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Login Error 🚨",
        text2: "Invalid email or password",
      });
      setLogin(false);
      setLoader(false);
    } finally {
      setLoader(false);
    }
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={[pages.viewOne, { height: SIZES.height - 45 }]}>
          <View style={[pages.viewTwo, { justifyContent: "center" }]}>
            <View style={{ marginHorizontal: 20 }}>
              <BackBtn onPress={() => navigation.goBack()} />
              <LottieView
                autoPlay
                ref={animation}
                style={{ width: "100%", height: SIZES.height / 3.2 }}
                source={require("../../assets/anime/vegetables.json")}
              />

              <Text style={styles.titleLogin}>HalalExpress</Text>

              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={(values) => loginFunc(values)}
              >
                {({
                  handleChange,
                  handleBlur,
                  touched,
                  handleSubmit,
                  values,
                  errors,
                  isValid,
                  setFieldTouched,
                }) => (
                  <View>
                    <View style={styles.wrapper}>
                      <Text style={styles.label}>Email</Text>
                      <View
                        style={styles.inputWrapper(
                          touched.email ? COLORS.secondary : COLORS.offwhite
                        )}
                      >
                        <MaterialCommunityIcons
                          name="email-outline"
                          size={20}
                          color={COLORS.gray}
                          style={styles.iconStyle}
                        />

                        <TextInput
                          placeholder="Enter email"
                          onFocus={() => {
                            setFieldTouched("email");
                          }}
                          onBlur={() => {
                            setFieldTouched("email", "");
                          }}
                          value={values.email}
                          onChangeText={handleChange("email")}
                          autoCapitalize="none"
                          autoCorrect={false}
                          style={styles.textInput}
                        />
                      </View>
                      {touched.email && errors.email && (
                        <Text style={styles.errorMessage}>{errors.email}</Text>
                      )}
                    </View>

                    <View style={styles.wrapper}>
                      <Text style={styles.label}>Password</Text>
                      <View
                        style={styles.inputWrapper(
                          touched.password ? COLORS.secondary : COLORS.offwhite
                        )}
                      >
                        <MaterialCommunityIcons
                          name="lock-outline"
                          size={20}
                          color={COLORS.gray}
                          style={styles.iconStyle}
                        />

                        <TextInput
                          secureTextEntry={obsecureText}
                          placeholder="Password"
                          onFocus={() => {
                            setFieldTouched("password");
                          }}
                          onBlur={() => {
                            setFieldTouched("password", "");
                          }}
                          value={values.password}
                          onChangeText={handleChange("password")}
                          autoCapitalize="none"
                          autoCorrect={false}
                          style={styles.textInput}
                        />

                        <TouchableOpacity
                          onPress={() => {
                            setObsecureText(!obsecureText);
                          }}
                        >
                          <MaterialCommunityIcons
                            name={
                              obsecureText ? "eye-outline" : "eye-off-outline"
                            }
                            size={18}
                          />
                        </TouchableOpacity>
                      </View>
                      {touched.password && errors.password && (
                        <Text style={styles.errorMessage}>
                          {errors.password}
                        </Text>
                      )}
                    </View>

                    <Button
                      loader={loader}
                      title={"L O G I N"}
                      onPress={isValid ? handleSubmit : inValidForm}
                      isValid={isValid}
                    />

                    <Text
                      style={styles.registration}
                      onPress={() => {
                        navigation.navigate("register-page");
                      }}
                    >
                      Don't have an account? Register
                    </Text>
                  </View>
                )}
              </Formik>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginPage;

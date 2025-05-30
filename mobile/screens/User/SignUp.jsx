import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import React, { useState, useRef, useContext } from "react";
import styles from "../../styles/login.style";
import LottieView from "lottie-react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../styles/theme";
import Button from "../../components/Button";
import BackBtn from "../../components/BackBtn";
import baseUrl from "../../assets/common/baseUrl";
import { LoginContext } from "../../contexts/LoginContext";
import axios from "axios";
import Toast from "react-native-toast-message";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 character")
    .required("Required"),
  email: Yup.string()
    .email("Provide a valid email address")
    .required("Required"),
  username: Yup.string()
    .min(3, "Provide a valid username")
    .required("Required"),
  phone: Yup.string()
    .matches(
      /^(09\d{9}|639\d{9}|\+639\d{9})$/,
      "Provide a valid Philippine phone number"
    )
    .required("Required"),
});

const SignUp = ({ navigation }) => {
  const animation = useRef(null);
  const [loader, setLoader] = useState(false);
  const [obsecureText, setObsecureText] = useState(true);

  const inValidForm = () => {
    Alert.alert("Invalid Form 🚨", "Please provide all required fields");
  };

  const registerUser = async (values) => {
    setLoader(true);
    try {
      const endpoint = `${baseUrl}/register`;
      const data = values;
      const response = await axios.post(endpoint, data);

      if (response.status === 200) {
        setLoader(false);
        navigation.navigate("verification-page", {
          values,
        });
      }
    } catch (error) {
      setLoader(false);
      Toast.show({
        type: "error",
        text1: "Error ❌",
        text2: "The email you entered is already registered",
      });
      return;
    }
  };

  return (
    <ScrollView>
      <View style={{ marginHorizontal: 20, marginTop: 50 }}>
        <BackBtn onPress={() => navigation.goBack()} />
        <LottieView
          autoPlay
          ref={animation}
          style={{ width: "100%", height: 300 }}
          source={require("../../assets/anime/vegetables.json")}
        />

        <Text style={styles.titleLogin}>HalalExpress</Text>
        <Formik
          initialValues={{
            email: "",
            password: "",
            username: "",
            phone: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => registerUser(values)}
        >
          {({
            handleChange,
            touched,
            handleSubmit,
            values,
            errors,
            isValid,
            setFieldTouched,
          }) => (
            <View>
              {console.log(errors)}
              <View style={styles.wrapper}>
                <Text style={styles.label}>Username</Text>
                <View
                  style={styles.inputWrapper(
                    touched.username ? COLORS.secondary : COLORS.offwhite
                  )}
                >
                  <MaterialCommunityIcons
                    name="face-man-profile"
                    size={20}
                    color={COLORS.gray}
                    style={styles.iconStyle}
                  />

                  <TextInput
                    placeholder="Enter Username"
                    onFocus={() => {
                      setFieldTouched("username");
                    }}
                    onBlur={() => {
                      setFieldTouched("username", "");
                    }}
                    value={values.username}
                    onChangeText={handleChange("username")}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.textInput}
                  />
                </View>
                {touched.username && errors.username && (
                  <Text style={styles.errorMessage}>{errors.username}</Text>
                )}
              </View>

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
                <Text style={styles.label}>Phone</Text>
                <View
                  style={styles.inputWrapper(
                    touched.phone ? COLORS.secondary : COLORS.offwhite
                  )}
                >
                  <AntDesign
                    name="phone"
                    size={20}
                    color={COLORS.gray}
                    style={styles.iconStyle}
                  />

                  <TextInput
                    placeholder="Enter phone number"
                    onFocus={() => {
                      setFieldTouched("phone");
                    }}
                    onBlur={() => {
                      setFieldTouched("phone", "");
                    }}
                    value={values.phone}
                    onChangeText={handleChange("phone")}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.textInput}
                  />
                </View>
                {touched.phone && errors.phone && (
                  <Text style={styles.errorMessage}>{errors.phone}</Text>
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
                      name={obsecureText ? "eye-off-outline" : "eye-outline"}
                      size={18}
                    />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && (
                  <Text style={styles.errorMessage}>{errors.password}</Text>
                )}
              </View>

              <Button
                title={"S I G N U P"}
                onPress={isValid ? handleSubmit : inValidForm}
                loader={loader}
                isValid={isValid}
              />
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default SignUp;

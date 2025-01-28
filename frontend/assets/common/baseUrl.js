import { Platform } from "react-native";

let baseUrl = "";

{
    Platform.OS == "android"
        ? (baseUrl = "http://192.168.254.114:6002")
        : (baseUrl = "http://192.168.23.103:6002")

}

export default baseUrl;
import { Platform } from "react-native";

let baseUrl = "";

{
    Platform.OS == "android"
        ? (baseUrl = "http://localhost:6002")
        : (baseUrl = "http://localhost:6002");

}

export default baseUrl;
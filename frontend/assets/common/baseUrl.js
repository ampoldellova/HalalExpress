import { Platform } from "react-native";

let baseUrl = "";

{
    Platform.OS == "android"
        ? (baseUrl = "https://halalexpress.onrender.com")
        : (baseUrl = "https://halalexpress.onrender.com")

}

export default baseUrl;
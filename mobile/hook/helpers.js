import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseUrl from "../assets/common/baseUrl";

export const getProfile = async () => {
    const token = await AsyncStorage.getItem("token");
    const config = {
        headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
        },
    };

    const response = await axios.get(`${baseUrl}/api/users/profile`, config);

    return response.data;
};
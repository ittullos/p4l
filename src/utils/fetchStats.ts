// filepath: /Users/rafiki/Developer/projects/p4l/src/utils/fetchStats.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CONFIG from "../config/config";

export const fetchStats = async () => {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    const idToken = await AsyncStorage.getItem("idToken");
    if (!idToken) {
      throw new Error("No ID token found");
    }

    const response = await axios.get(`${CONFIG.SERVER_URL}/user/stats`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-ID-TOKEN": `Bearer ${idToken}`,
      },
    });

    console.log("fetchStats: ", response.data.data);
    return response.data.data; // Return the stats data
  } catch (error) {
    console.error("Error fetching stats: ", error);
    throw error; // Propagate the error
  }
};
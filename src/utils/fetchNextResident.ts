import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CONFIG from "../config/config";

export const fetchNextResident = async (setPrayerName, setResidentId) => {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    const idToken = await AsyncStorage.getItem("idToken");
    if (!idToken) {
      throw new Error("No ID token found");
    }

    const response = await axios.get(
      `${CONFIG.SERVER_URL}/user/residents/next-resident`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-ID-TOKEN": `Bearer ${idToken}`,
        },
      }
    );

    console.log("Next Resident:", response.data.data);
    setPrayerName(response.data.data?.name || "No resident found");
    setResidentId(response.data.data?.id || null);
  } catch (error) {
    console.error("Error fetching next resident:", error);
    throw error; // Ensure the error is propagated
  }
};

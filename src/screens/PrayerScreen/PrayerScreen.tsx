import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AppButton from "../../components/AppButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CONFIG from "../../config/config";

const PrayerScreen = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const sendPrayer = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const idToken = await AsyncStorage.getItem("idToken");
      if (!idToken) {
        throw new Error("No ID token found");
      }

      const residentId = props.residentId; // Assuming residentId is passed as a prop
      if (!residentId) {
        throw new Error("No resident ID provided");
      }

      const response = await axios.post(
        `${CONFIG.SERVER_URL}/prayers`,
        { resident_id: residentId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-ID-TOKEN": `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Prayer sent successfully:", response.data.data);

      // Increment the prayer count only if the route is started
      if (props.routeStarted) {
        props.setPrayerCount((prevCount) => prevCount + 1);
      }

      // Update the prayerName with the next resident's name
      if (response.data.data.next_resident) {
        props.setResidentId(response.data.data.next_resident.id || null);
        props.setPrayerName(
          response.data.data.next_resident.name || "No resident found"
        );
      } else {
        props.setResidentId(null);
        props.setPrayerName("No resident found");
      }
    } catch (error) {
      console.error("Error sending prayer:", error);
    }
  };

  // Watch for changes to props.prayerName and update isLoading
  useEffect(() => {
    if (props.prayerName !== "") {
      setIsLoading(false);
    }
  }, [props.prayerName]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }], paddingTop: 50 }}
          color="#071448"
        />
      ) : (
        <>
          <View style={styles.prayerNameBox}>
            <Text style={styles.prayerName}>{props.prayerName}</Text>
          </View>
          <View style={styles.buttonGap}></View>
          {/* Conditionally render the Next button */}
          {props.prayerName !== "No resident found" && (
            <AppButton text="Next" type="GREEN" onPress={sendPrayer} />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: "center",
    // borderWidth: 4,
    // borderColor: 'red',
  },
  prayerNameBox: {
    flex: 0.6,
    height: "50%",
    justifyContent: "flex-end",
  },
  prayerName: {
    fontSize: 27,
    textAlign: "center",
    maxWidth: "80%",
  },
  buttonGap: {
    marginTop: 45,
  },
});

export default PrayerScreen;

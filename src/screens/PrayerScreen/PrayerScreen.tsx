import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AppButton from "../../components/AppButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CONFIG from "../../config/config";
import { fetchStats } from "../../utils/fetchStats";

const PrayerScreen = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  const sendPrayer = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      const idToken = await AsyncStorage.getItem("idToken");
      if (!idToken) throw new Error("No ID token found");

      const residentId = props.residentId;
      if (!residentId) throw new Error("No resident ID provided");

      // Build the request body
      const requestBody = { resident_id: residentId };
      if (props.routeStarted && props.routeId) {
        requestBody.route_id = props.routeId;
      }

      const response = await axios.post(
        `${CONFIG.SERVER_URL}/prayers`,
        requestBody,
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

      // Fetch and update stats using your utility
      const stats = await fetchStats();
      props.setStats(stats);
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
      ) : props.prayerName === "No resident found" ? (
        <View style={styles.noListContainer}>
          <Text style={styles.prayerName}>No Prayer List Uploaded</Text>
          <View style={styles.buttonGap} />
          <AppButton
            text="Upload List"
            type="NAVY"
            onPress={() => navigation.navigate("Prayer List")}
          />
        </View>
      ) : (
        <>
          <View style={styles.prayerNameBox}>
            <Text style={styles.prayerName}>{props.prayerName}</Text>
          </View>
          <View style={styles.buttonGap}></View>
          <AppButton text="Next" type="GREEN" onPress={sendPrayer} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  prayerNameBox: {
    flex: 0.6,
    height: "50%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  prayerName: {
    fontSize: 27,
    textAlign: "center",
    maxWidth: "80%",
  },
  buttonGap: {
    marginTop: 45,
  },
  noListContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});

export default PrayerScreen;

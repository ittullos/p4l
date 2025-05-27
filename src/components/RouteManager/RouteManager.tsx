import React, { useEffect, useRef, useState } from "react";
import { Modal, View, Text, TextInput, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CONFIG from "../../config/config";
import { fetchStats } from "../../utils/fetchStats";
import AppButton from "../AppButton";

const RouteManager = ({
  routeStarted,
  setRouteStarted,
  routeId,
  setRouteId,
  routeDistance,
  setRouteDistance,
  setStats,
  setPrayerCount,
}) => {
  const routeStartTime = useRef<number | null>(null); // Store the route start time

  // State for mileage entry modal
  const [showMileageModal, setShowMileageModal] = useState(false);
  const [enteredMileage, setEnteredMileage] = useState("0.00");

  // State for commitment completion modal
  const [showCommitmentModal, setShowCommitmentModal] = useState(false);

  // Start the route
  useEffect(() => {
    const startRoute = async () => {
      console.log("Starting route...");
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (!accessToken) throw new Error("No access token found");

        const idToken = await AsyncStorage.getItem("idToken");
        if (!idToken) throw new Error("No ID token found");

        const response = await axios.post(
          `${CONFIG.SERVER_URL}/user/routes`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-ID-TOKEN": `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Route started successfully:", response.data.data);
        setRouteId(response.data.data.id);
        routeStartTime.current = Date.now(); // Record the start time of the route
      } catch (error) {
        console.error("Error starting route:", error);
      }
    };

    if (routeStarted && !routeId) {
      startRoute();
    }
  }, [routeStarted, routeId]);

  // Stop the route
  const stopRoute = async () => {
    console.log("Stopping route...");
    try {
      const mileageToAdd = parseFloat(enteredMileage);
      if (isNaN(mileageToAdd) || mileageToAdd < 0) {
        alert("Please enter a valid mileage.");
        return;
      }

      const totalMileage = routeDistance + mileageToAdd;

      const accessToken = await AsyncStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      const idToken = await AsyncStorage.getItem("idToken");
      if (!idToken) throw new Error("No ID token found");

      const response = await axios.patch(
        `${CONFIG.SERVER_URL}/user/routes`,
        {
          mileage: Math.round(totalMileage * 100),
          id: routeId,
          stop: true,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-ID-TOKEN": `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Route stopped successfully:", response.data.data);

      // Check if the commitment is completed
      if (response.data.data.meta.commitment.completed) {
        setShowCommitmentModal(true);
      }

      // Reset state after stopping the route
      setRouteId(null);
      setRouteDistance(0.0);
      routeStartTime.current = null; // Reset the start time
      setEnteredMileage("0.00");
      setShowMileageModal(false);
      setPrayerCount && setPrayerCount(0);

      // Fetch updated stats
      const stats = await fetchStats();
      setStats(stats);
    } catch (error) {
      console.error("Error stopping route:", error);
    }
  };

  // Show the mileage modal when the route is stopped
  useEffect(() => {
    if (!routeStarted && routeId) {
      setShowMileageModal(true);
    }
  }, [routeStarted, routeId]);

  // Update the route
  useEffect(() => {
    const updateRoute = async () => {
      console.log("Attempting to update route...");
      try {
        const currentTime = Date.now();
        if (
          routeStartTime.current &&
          currentTime - routeStartTime.current < 5000
        ) {
          console.log(
            "Skipping update: Less than 5 seconds since route started"
          );
          return; // Skip the update if less than 5 seconds have passed
        }

        const accessToken = await AsyncStorage.getItem("accessToken");
        if (!accessToken) throw new Error("No access token found");

        const idToken = await AsyncStorage.getItem("idToken");
        if (!idToken) throw new Error("No ID token found");

        // Multiply routeDistance by 100 and round it
        const mileage = Math.round(routeDistance * 100);

        const response = await axios.patch(
          `${CONFIG.SERVER_URL}/user/routes`,
          {
            mileage,
            id: routeId,
            stop: false,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-ID-TOKEN": `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Route updated successfully:", response.data.data);
      } catch (error) {
        console.error("Error updating route:", error);
      }
    };

    if (routeStarted && routeId) {
      updateRoute();
    }
  }, [routeDistance, routeId, routeStarted]);

  // Update route distance every 10 seconds
  useEffect(() => {
    let distanceInterval;

    if (routeStarted) {
      console.log("Starting distance interval...");
      distanceInterval = setInterval(() => {
        const randomIncrement = (Math.random() * (3 - 1) + 1).toFixed(2);
        setRouteDistance((prevDistance) =>
          parseFloat((prevDistance + parseFloat(randomIncrement)).toFixed(2))
        );
      }, 10000);
    }

    return () => {
      console.log("Clearing distance interval...");
      clearInterval(distanceInterval);
    };
  }, [routeStarted]);

  return (
    <>
      {/* Mileage Entry Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showMileageModal}
        onRequestClose={() => setShowMileageModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Enter Additional Mileage</Text>
            <Text style={styles.modalText}>(treadmill, bike, etc.)</Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              placeholder="0.00"
              value={enteredMileage}
              onChangeText={setEnteredMileage}
            />
            <AppButton text="Finish Route" type="GREEN" onPress={stopRoute} />
          </View>
        </View>
      </Modal>

      {/* Commitment Completion Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCommitmentModal}
        onRequestClose={() => setShowCommitmentModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Congratulations! You've completed your commitment. We've selected
              the next commitment for you. Keep at it!
            </Text>
            <AppButton
              text="Close"
              type="GREEN"
              onPress={() => setShowCommitmentModal(false)}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default RouteManager;

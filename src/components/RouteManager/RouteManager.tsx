import React, { useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CONFIG from "../../config/config";

const RouteManager = ({
  routeStarted,
  setRouteStarted,
  routeId,
  setRouteId,
  routeDistance,
  setRouteDistance,
}) => {
  const routeStartTime = useRef<number | null>(null); // Store the route start time

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
  useEffect(() => {
    const stopRoute = async () => {
      console.log("Stopping route...");
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (!accessToken) throw new Error("No access token found");

        const idToken = await AsyncStorage.getItem("idToken");
        if (!idToken) throw new Error("No ID token found");

        const response = await axios.patch(
          `${CONFIG.SERVER_URL}/user/routes`,
          {
            id: routeId,
            mileage: routeDistance,
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
        setRouteId(null);
        setRouteDistance(0.0);
        routeStartTime.current = null; // Reset the start time
      } catch (error) {
        console.error("Error stopping route:", error);
      }
    };

    if (!routeStarted && routeId) {
      stopRoute();
    }
  }, [routeStarted, routeId, routeDistance]);

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

        const response = await axios.patch(
          `${CONFIG.SERVER_URL}/user/routes`,
          {
            mileage: routeDistance,
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
        const randomIncrement = (Math.random() * (0.03 - 0.01) + 0.01).toFixed(
          2
        );
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

  return null; // This component handles logic only
};

export default RouteManager;

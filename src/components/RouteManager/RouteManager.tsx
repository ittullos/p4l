import React, { useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CONFIG from "../../config/config";
import { fetchStats } from "../../utils/fetchStats";

const RouteManager = ({
  routeStarted,
  setRouteStarted,
  routeId,
  setRouteId,
  routeDistance,
  setRouteDistance,
  setStats,
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

        // Multiply routeDistance by 100 and round it
        const mileage = Math.round(routeDistance * 100);

        const response = await axios.patch(
          `${CONFIG.SERVER_URL}/user/routes`,
          {
            mileage,
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
        setRouteId(null);
        setRouteDistance(0.0);
        routeStartTime.current = null; // Reset the start time

        // Call fetchStats after successfully stopping the route
        const stats = await fetchStats();
        setStats(stats); // Use setStats to update the stats
        console.log("Updated stats:", stats);
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

  return null; // This component handles logic only
};

export default RouteManager;

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState, useRef, useContext } from "react";
import { Auth } from "aws-amplify";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import axios from "axios";
import CircularButton from "../../components/CircularButton";
import RouteStats from "../../components/RouteStats";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CONFIG from "../../config/config";
import { fetchStats } from "../../utils/fetchStats";

const HomeScreen = (props) => {
  const [verse, setVerse] = useState("");
  const [notation, setNotation] = useState("");
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const countRef = useRef(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [routeId, setRouteId] = useState<number | null>(null);
  const [routeDistance, setRouteDistance] = useState(0.0);

  const handleRouteStart = () => {
    props.setRouteStarted(!props.routeStarted);
  };

  useEffect(() => {
    let distanceInterval;

    if (props.routeStarted) {
      // Start the interval to update the route distance every 3 seconds
      distanceInterval = setInterval(() => {
        const randomIncrement = (Math.random() * (0.03 - 0.01) + 0.01).toFixed(
          2
        ); // Random value between 0.01 and 0.03
        setRouteDistance((prevDistance) =>
          parseFloat((prevDistance + parseFloat(randomIncrement)).toFixed(2))
        );
      }, 3000);
    } else {
      // Reset the distance when the route stops
      setRouteDistance(0.0);
    }

    return () => clearInterval(distanceInterval); // Cleanup the interval on unmount or when the route stops
  }, [props.routeStarted]);

  useEffect(() => {
    // Watch for changes to routeStarted and trigger startRoute
    const startRoute = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const idToken = await AsyncStorage.getItem("idToken");
        if (!idToken) {
          throw new Error("No ID token found");
        }

        // POST request to create a new route
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
        setRouteId(response.data.data.id); // Save the route ID
        setStartTime(Date.now()); // Record the start time
      } catch (error) {
        console.error("Error starting route:", error);
      }
    };

    if (props.routeStarted) {
      startRoute();
    }
  }, [props.routeStarted]);

  useEffect(() => {
    let timerInterval;

    if (props.routeStarted) {
      // Start the timer interval to update every second
      timerInterval = setInterval(() => {
        setTimer((Date.now() - startTime) / 1000); // Update the timer every second
      }, 1000);
    } else {
      // Reset the timer when the route stops
      setTimer(0);
    }

    return () => clearInterval(timerInterval); // Cleanup the timer interval on unmount or when route stops
  }, [props.routeStarted, startTime]);

  useEffect(() => {
    // Watch for changes to routeId and trigger updateRoute/stopRoute
    const updateRoute = async () => {
      console.log("Updating route...");
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const idToken = await AsyncStorage.getItem("idToken");
        if (!idToken) {
          throw new Error("No ID token found");
        }

        const response = await axios.patch(
          `${CONFIG.SERVER_URL}/user/routes`,
          {
            mileage: 0,
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
        setEndTime(Date.now()); // Update the end time
      } catch (error) {
        console.error("Error updating route:", error);
      }
    };

    const stopRoute = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const idToken = await AsyncStorage.getItem("idToken");
        if (!idToken) {
          throw new Error("No ID token found");
        }

        const response = await axios.patch(
          `${CONFIG.SERVER_URL}/user/routes`,
          {
            id: routeId,
            mileage: 0, // Replace with actual mileage if available
            stop: true, // Set the stop attribute to true
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

        // Reset the prayer count after the route is stopped
        props.setPrayerCount(0);

        setRouteId(null); // Clear the route ID after stopping

        // Fetch updated stats after stopping the route
        try {
          const updatedStats = await fetchStats();
          props.setStats(updatedStats); // Update the shared stats state
          console.log("Updated Stats:", updatedStats);
        } catch (error) {
          console.error("Error fetching updated stats:", error);
        }
      } catch (error) {
        console.error("Error stopping route:", error);
      }
    };

    if (routeId && props.routeStarted) {
      // Start the interval to update the route every 5 seconds
      countRef.current = setInterval(() => {
        updateRoute();
      }, 5000);

      return () => {
        clearInterval(countRef.current); // Cleanup interval on unmount or when route stops
        stopRoute(); // Stop the route when routeId is cleared and routeStarted is false
      };
    }
  }, [routeId, props.routeStarted]);

  useEffect(() => {
    setTimer((endTime - startTime) / 1000);
  }, [endTime]);

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      fetchVerse();
    }
    return () => {
      ignore = true;
    };
  }, []);

  const fetchVerse = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const idToken = await AsyncStorage.getItem("idToken");
      if (!idToken) {
        throw new Error("No ID token found");
      }

      console.log("accessToken: ", accessToken);
      const response = await axios.get(`${CONFIG.SERVER_URL}/home`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-ID-TOKEN": `Bearer ${idToken}`,
        },
      });

      console.log("fetchVerse: ", response.data.data);
      setVerse(response.data.data.scripture);
      setNotation(response.data.data.notation);
    } catch (error) {
      console.log("Error fetching verse: ", error);
    } finally {
      setLoading(false);
    }
  };

  const [fontsLoaded] = useFonts({
    GeorgiaItalic: require("../../../assets/fonts/georgiai.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return undefined;
  } else {
    SplashScreen.hideAsync();
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 6,
          // borderWidth: 3,
          // borderColor: 'brown'
        }}
      >
        <Text
          style={{
            fontSize: 28,
            alignSelf: "center",
            fontWeight: "bold",
            paddingBottom: 10,
          }}
        >
          Verse of the Day
        </Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            style={{
              transform: [{ scaleX: 2 }, { scaleY: 2 }],
              paddingTop: 50,
            }}
            color="#071448"
          />
        ) : (
          <ScrollView>
            <Text
              style={{
                fontFamily: "GeorgiaItalic",
                paddingHorizontal: 20,
                fontSize: 22,
                textAlign: "center",
                lineHeight: 30,
                paddingTop: 8,
              }}
            >
              "{verse}"
            </Text>
            <Text
              style={{
                paddingVertical: 15,
                fontSize: 22,
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              - {notation}
            </Text>
          </ScrollView>
        )}
      </View>
      <View
        style={{
          flex: 3,
          // borderWidth: 3,
          borderColor: "brown",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularButton
          title={props.routeStarted ? "Stop Route" : "Start Route"}
          onPress={handleRouteStart}
          color={props.routeStarted ? "red" : "green"}
        />
      </View>
      <View
        style={{
          flex: 4,
          // borderWidth: 3,
          // borderColor: 'brown'
        }}
      >
        {props.routeStarted ? (
          <RouteStats
            timer={timer}
            prayerCount={props.prayerCount}
            routeDistance={routeDistance}
          />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 90,
    // borderWidth: 4,
    // borderColor: 'red',
  },
  routeButton: {
    backgroundColor: "green",
  },
});

export default HomeScreen;

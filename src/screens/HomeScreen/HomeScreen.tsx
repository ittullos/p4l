import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import CircularButton from "../../components/CircularButton";
import RouteStats from "../../components/RouteStats";
import RouteManager from "../../components/RouteManager/RouteManager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import axios from "axios";
import CONFIG from "../../config/config";

const HomeScreen = (props) => {
  const [verse, setVerse] = useState("");
  const [notation, setNotation] = useState("");
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [routeId, setRouteId] = useState<number | null>(null);
  const [routeDistance, setRouteDistance] = useState(0.0);

  // New state variables for the mileage entry modal
  const [showMileageModal, setShowMileageModal] = useState(false);
  const [enteredMileage, setEnteredMileage] = useState("");

  const handleRouteStart = () => {
    props.setRouteStarted(!props.routeStarted);
    if (!props.routeStarted) {
      setStartTime(Date.now()); // Record the start time when the route starts
    }
  };

  // Timer logic
  useEffect(() => {
    let timerInterval;

    if (props.routeStarted) {
      // Start the timer interval
      timerInterval = setInterval(() => {
        setTimer(Math.floor((Date.now() - startTime) / 1000)); // Calculate elapsed time in seconds
      }, 1000);
    } else {
      // Reset the timer when the route stops
      setTimer(0);
    }

    return () => clearInterval(timerInterval); // Cleanup the interval
  }, [props.routeStarted, startTime]);

  // Fetch the verse of the day
  useEffect(() => {
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

    fetchVerse();
  }, []);

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
      <RouteManager
        routeStarted={props.routeStarted}
        setRouteStarted={props.setRouteStarted}
        routeId={routeId}
        setRouteId={setRouteId}
        routeDistance={routeDistance}
        setRouteDistance={setRouteDistance}
        setStats={props.setStats}
      />
      <View style={styles.verseContainer}>
        <Text style={styles.verseTitle}>Verse of the Day</Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            style={styles.loadingIndicator}
            color="#071448"
          />
        ) : (
          <ScrollView>
            <Text style={styles.verseText}>"{verse}"</Text>
            <Text style={styles.verseNotation}>- {notation}</Text>
          </ScrollView>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <CircularButton
          title={props.routeStarted ? "Stop Route" : "Start Route"}
          onPress={handleRouteStart}
          color={props.routeStarted ? "red" : "green"}
        />
      </View>
      <View style={styles.statsContainer}>
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
  },
  verseContainer: {
    flex: 6,
  },
  verseTitle: {
    fontSize: 28,
    alignSelf: "center",
    fontWeight: "bold",
    paddingBottom: 10,
  },
  loadingIndicator: {
    transform: [{ scaleX: 2 }, { scaleY: 2 }],
    paddingTop: 50,
  },
  verseText: {
    fontFamily: "GeorgiaItalic",
    paddingHorizontal: 20,
    fontSize: 22,
    textAlign: "center",
    lineHeight: 30,
    paddingTop: 8,
  },
  verseNotation: {
    paddingVertical: 15,
    fontSize: 22,
    textAlign: "center",
    fontWeight: "600",
  },
  buttonContainer: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    flex: 4,
  },
});

export default HomeScreen;

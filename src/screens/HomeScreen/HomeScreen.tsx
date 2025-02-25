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
// import { RouteContext } from '../../context/routeContext'

const HomeScreen = (props) => {
  const [verse, setVerse] = useState("");
  const [notation, setNotation] = useState("");
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const countRef = useRef(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  // const routeStarted = useContext(RouteContext)

  // const signOut = () => {
  //   Auth.signOut()
  // }
  const handleRouteStart = () => {
    props.setRouteStarted(!props.routeStarted);
  };

  useEffect(() => {
    if (props.routeStarted) {
      setStartTime(Date.now());
      countRef.current = setInterval(() => {
        setEndTime(Date.now());
      }, 1000);
    } else {
      clearInterval(countRef.current);
      setTimer(0);
      props.setPrayerCount(0);
    }
  }, [props.routeStarted]);

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
      const response = await axios.get("http://localhost:9292/home", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-ID-TOKEN": `Bearer ${idToken}`,
        },
      });

      console.log("fetchVerse: ", response);
      setVerse(response.data.scripture);
      setNotation(response.data.notation);
    } catch (error) {
      console.log("Error fetching verse: ", error);
    } finally {
      setLoading(false);
    }
  };
  // Auth.currentSession().then((session) => {

  //   console.log("email: ", email);
  //   axios
  //     .get(`http://localhost:9292/home`, {
  //       headers: { "P4L-email": email },
  //     })
  //     .then((res) => {
  //       console.log("getVerse: ", res);
  //       setVerse(res.data.scripture);
  //       setNotation(res.data.notation);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // });

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
          <RouteStats timer={timer} prayerCount={props.prayerCount} />
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

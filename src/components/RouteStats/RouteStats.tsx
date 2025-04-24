import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const RouteStats = (props) => {
  const [fontsLoaded] = useFonts({
    Digital7: require("../../../assets/fonts/digital-7.ttf"),
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

  const formatTime = (time: any) => {
    let dateObj = new Date(time * 1000);
    let hours = dateObj.getUTCHours();
    let minutes = dateObj.getUTCMinutes();
    let seconds = dateObj.getSeconds();
    let timeString = "";

    if (hours > 0) {
      timeString =
        hours.toString() +
        ":" +
        minutes.toString().padStart(2, "0") +
        ":" +
        seconds.toString().padStart(2, "0");
    } else {
      timeString =
        minutes.toString().padStart(2, "0") +
        ":" +
        seconds.toString().padStart(2, "0");
    }

    return timeString;
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingTop: 20,
      }}
    >
      <View style={styles.box}>
        <Text style={{ fontFamily: "Digital7", fontSize: 37 }}>
          {formatTime(props.timer)}
        </Text>
        <Image
          source={require("../../../assets/images/stopwatch.svg.png")}
          style={{ width: 40, height: 40, marginTop: 15 }}
        />
      </View>
      <View style={styles.box}>
        <Text style={{ fontSize: 32, fontWeight: 700 }}>
          {props.routeDistance.toFixed(2)}
        </Text>
        <Text style={{ fontSize: 25, marginTop: 10, fontWeight: 600 }}>mi</Text>
      </View>
      <View style={styles.box}>
        <Text style={{ fontSize: 30, fontWeight: 600 }}>
          {props.prayerCount}
        </Text>
        <Image
          source={require("../../../assets/images/praying-hands-icon-black.png")}
          style={{ width: 40, height: 40, marginTop: 15 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
});

export default RouteStats;

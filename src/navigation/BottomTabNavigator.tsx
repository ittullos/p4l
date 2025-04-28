import React, { useState, useContext, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DrawerNavigator from "./DrawerNavigator";
import DevotionalTopTab from "./DevotionalTopTab";
import PrayerTopTab from "./PrayerTopTab";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CONFIG from "../config/config";
import { set } from "react-hook-form";
import { fetchNextResident } from "../utils/fetchNextResident";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const [prayerCount, setPrayerCount] = useState<number>(0);
  const [prayerName, setPrayerName] = useState<string>("");
  const [residentId, setResidentId] = useState<number | null>(null);
  const [routeStarted, setRouteStarted] = useState<boolean>(false);

  // Watch for changes to prayerName and log the results
  useEffect(() => {
    console.log("Prayer Name changed:", prayerName);
  }, [prayerName]);

  useEffect(() => {
    fetchNextResident(setPrayerName, setResidentId);
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let routeName = route.name;
          size = 35;

          if (routeName === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (routeName === "Prayer") {
            iconName = focused ? "account-group" : "account-group-outline";
          } else if (routeName === "Devotional") {
            iconName = focused ? "play" : "play-outline";
          }
          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "#cce70b",
        tabBarInactiveTintColor: "white",
        tabBarStyle: [
          {
            backgroundColor: "#071448",
            height: 90,
            padding: 10,
          },
          null,
        ],
      })}
    >
      <Tab.Screen name="Devotional" component={DevotionalTopTab} />
      <Tab.Screen
        name="Home"
        // component={DevotionalTopTab}
        children={() => (
          <DrawerNavigator
            prayerCount={prayerCount}
            prayerName={prayerName}
            setPrayerCount={setPrayerCount}
            setPrayerName={setPrayerName}
            routeStarted={routeStarted}
            setRouteStarted={setRouteStarted}
            residentId={residentId}
            setResidentId={setResidentId}
          />
        )}
      />
      <Tab.Screen
        name="Prayer"
        children={() => (
          <PrayerTopTab
            prayerCount={prayerCount}
            prayerName={prayerName}
            setPrayerCount={setPrayerCount}
            setPrayerName={setPrayerName}
            routeStarted={routeStarted}
            residentId={residentId}
            setResidentId={setResidentId}
          />
        )}
      />
    </Tab.Navigator>
    // </RouteContext.Provider>
  );
};

export default BottomTabNavigator;

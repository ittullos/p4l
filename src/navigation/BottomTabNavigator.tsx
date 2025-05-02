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

  // Track whether the user is already in the "Home" section
  const [isInHome, setIsInHome] = useState<boolean>(false);

  // Function to navigate the DrawerNavigator back to Home
  const goToHome = (navigation) => {
    navigation.navigate("Home Drawer"); // Navigate to the Home Drawer explicitly
  };

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
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (isInHome) {
              // If already in Home, reset the stack
              e.preventDefault(); // Prevent default behavior
              goToHome(navigation); // Call the goToHome function
            } else {
              // If not in Home, set the state to indicate the user is now in Home
              setIsInHome(true);
            }
          },
          focus: () => {
            // When the Home tab is focused, set isInHome to true
            setIsInHome(true);
          },
          blur: () => {
            // When the Home tab is blurred, set isInHome to false
            setIsInHome(false);
          },
        })}
        children={({ navigation }) => (
          <DrawerNavigator
            prayerCount={prayerCount}
            prayerName={prayerName}
            setPrayerCount={setPrayerCount}
            setPrayerName={setPrayerName}
            routeStarted={routeStarted}
            setRouteStarted={setRouteStarted}
            residentId={residentId}
            setResidentId={setResidentId}
            goToHome={() => goToHome(navigation)}
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

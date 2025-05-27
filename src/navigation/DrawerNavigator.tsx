import { View, Text, Pressable } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import StatsScreen from "../screens/StatsScreen";
import CommitmentScreen from "../screens/CommitmentScreen";
import PrayerListScreen from "../screens/PrayerListScreen";
import { DrawerToggleButton } from "@react-navigation/drawer";
import HomeScreen from "../screens/HomeScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import SettingsScreen from "../screens/SettingsScreen";
import { useState } from "react";

const Drawer = createDrawerNavigator();

const DrawerNavigator = (props) => {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        drawerPosition: "right",
        headerShown: true,
        headerTransparent: true,
        headerLeft: false,
        drawerActiveTintColor: "#071448",
        headerRight: (props) => (
          <MaterialCommunityIcons
            name="menu"
            size={40}
            onPress={navigation.toggleDrawer}
            style={{ color: "#071448", paddingRight: 20 }}
          />
        ),
      })}
    >
      <Drawer.Screen
        name="Home Drawer"
        options={{ title: "Home", headerTitle: "" }}
        children={() => (
          <HomeScreen
            prayerCount={props.prayerCount}
            setPrayerCount={props.setPrayerCount}
            routeStarted={props.routeStarted}
            setRouteStarted={props.setRouteStarted}
            setStats={props.setStats}
            routeId={props.routeId}
            setRouteId={props.setRouteId}
          />
        )}
      />
      <Drawer.Screen
        name="My Stats"
        options={{ title: "My Stats", headerTitle: "" }}
        children={({ navigation }) => (
          <StatsScreen
            stats={props.stats}
            setStats={props.setStats}
            navigation={navigation}
            goToHome={props.goToHome} // Use the goToHome callback
          />
        )}
      />
      <Drawer.Screen
        name="My Commitment"
        options={{ title: "My Commitment", headerTitle: "" }}
        children={() => (
          <CommitmentScreen
            stats={props.stats}
            setStats={props.setStats}
            goToHome={props.goToHome}
          />
        )}
      />
      <Drawer.Screen
        name="Settings"
        options={{ title: "Settings", headerTitle: "" }}
        children={() => <SettingsScreen goToHome={props.goToHome} />}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

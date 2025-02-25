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
            // prayerName={props.prayerName}
            setPrayerCount={props.setPrayerCount}
            //setPrayerName={setPrayerName}
            routeStarted={props.routeStarted}
            setRouteStarted={props.setRouteStarted}
          />
        )}
      />
      <Drawer.Screen
        name="My Stats"
        options={{ title: "My Stats", headerTitle: "" }}
        component={StatsScreen}
      />
      <Drawer.Screen
        name="My Commitment"
        options={{ title: "My Commitment", headerTitle: "" }}
        component={CommitmentScreen}
      />
      <Drawer.Screen
        name="Settings"
        options={{ title: "Settings", headerTitle: "" }}
        component={SettingsScreen}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

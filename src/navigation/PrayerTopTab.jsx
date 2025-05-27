import React, { useState, useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PrayerScreen from "../screens/PrayerScreen";
import PrayerListScreen from "../screens/PrayerListScreen";
import axios from "axios";

const Tab = createMaterialTopTabNavigator();

const PrayerTopTab = (props) => {
  return (
    <Tab.Navigator
      style={{ paddingTop: 35, backgroundColor: "white" }}
      initialRouteName={"Pray"}
      screenOptions={{
        tabBarIndicatorStyle: {
          backgroundColor: "#071448",
          height: 4,
        },
        tabBarLabelStyle: {
          fontSize: 18,
        },
      }}
    >
      <Tab.Screen
        name="Pray"
        children={() => (
          <PrayerScreen
            prayerName={props.prayerName}
            setPrayerName={props.setPrayerName}
            prayerCount={props.prayerCount}
            setPrayerCount={props.setPrayerCount}
            routeStarted={props.routeStarted}
            residentId={props.residentId}
            setResidentId={props.setResidentId}
            setStats={props.setStats}
            routeId={props.routeId}
          />
        )}
      />
      <Tab.Screen
        name="Prayer List"
        children={() => (
          <PrayerListScreen
            routeStarted={props.routeStarted}
            prayerName={props.prayerName}
            setPrayerName={props.setPrayerName}
            residentId={props.residentId}
            setResidentId={props.setResidentId}
          />
        )}
      />
    </Tab.Navigator>
  );
};

export default PrayerTopTab;

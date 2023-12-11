import { View, Text } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/HomeScreen'
import PrayerScreen from '../screens/PrayerScreen'
import DevotionalScreen from '../screens/DevotionalScreen'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import DrawerNavigator from './DrawerNavigator'
import DevotionalTopTab from './DevotionalTopTab'
import PrayerTopTab from './PrayerTopTab'
// import { RouteContext } from '../context/routeContext'

const Tab = createBottomTabNavigator()

const BottomTabNavigator = () => {
  const [prayerCount, setPrayerCount] = useState<number>(0)
  const [prayerName, setPrayerName] = useState<string>("")
  const [routeStarted, setRouteStarted] = useState<boolean>(false)
  // const changeRouteStarted = () => setRouteStarted(!routeStarted)
  // const routeStarted = createContext<boolean>(false)

  return (
    // <RouteContext.Provider value={{routeStarted, setRouteStarted}}>
    //   {children}
      <Tab.Navigator 
        initialRouteName='Home'
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName
            let routeName = route.name
            size = 35

            if (routeName === 'Home') {
              iconName = focused ? 'home' : 'home-outline'
            } else if (routeName === 'Prayer') {
              iconName = focused ? 'account-group' : 'account-group-outline'
            } else if (routeName === 'Devotional') {
              iconName = focused ? 'play' : 'play-outline'
            }
            return (
              <MaterialCommunityIcons 
                name={iconName} 
                size={size} 
                color={color}
              /> 
            )
          },
          tabBarActiveTintColor: '#cce70b',
          tabBarInactiveTintColor: 'white',
          tabBarStyle: [
            {
              backgroundColor: '#071448',
              height: 90,
              padding: 10
            },
            null
          ],
        })}
      >
        <Tab.Screen 
          name="Devotional" 
          component={DevotionalTopTab} 
        />
        <Tab.Screen 
          name="Home"
          // component={DevotionalTopTab}
          children={ () => 
            <DrawerNavigator 
              prayerCount={prayerCount}
              prayerName={prayerName} 
              setPrayerCount={setPrayerCount}
              setPrayerName={setPrayerName}
              routeStarted={routeStarted}
              setRouteStarted={setRouteStarted}
            /> 
          }
        />
        <Tab.Screen 
          name="Prayer" 
          children={ () => 
            <PrayerTopTab 
              prayerCount={prayerCount}
              prayerName={prayerName} 
              setPrayerCount={setPrayerCount}
              setPrayerName={setPrayerName}
              routeStarted={routeStarted}
            /> 
          }
        />
      </Tab.Navigator>
    // </RouteContext.Provider>
  )
}

export default BottomTabNavigator
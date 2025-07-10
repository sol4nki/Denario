
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

import Homepage from "./homepage/Homepage";
import TradeSwap from "./tradeSwap/TradeSwap";
import RecentLogs from "./activity/RecentLogs";
import MiscMain from "./more/More";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: "#0D0A19",
          borderTopWidth: 1,
          borderColor: "#2C1E51",
          elevation: 20,
          paddingTop: 10,
          paddingBottom: 10,
          height: 100, 
        },
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "Home":
              return <Ionicons name="home" size={size} color={color} />;
            case "Swap":
              return (
                <FontAwesome5 name="exchange-alt" size={size} color={color} />
              );
            case "Activity":
              return <Ionicons name="time" size={size} color={color} />;
            case "More":
              return <Ionicons name="card" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: "#7B68EE",
        tabBarInactiveTintColor: "#6B7280",
      })}
    >
      <Tab.Screen name="Home" component={Homepage} />
      <Tab.Screen name="Swap" component={TradeSwap} />
      <Tab.Screen name="Activity" component={RecentLogs} />
      <Tab.Screen name="More" component={MiscMain} />
    </Tab.Navigator>
  );
}

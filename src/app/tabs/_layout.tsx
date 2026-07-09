import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

function TabLayout() {
  return (
    <Tabs screenOptions={{
        headerShown: false,
        tabBarStyle:{
            backgroundColor: "#020617",
            width: "100%",
            height: 60,
            paddingBottom: 5,
            paddingTop: 5,
        },
        }}>
        <Tabs.Screen
            name="HomeScreen"
            options={{
                title: "Home",
                headerShown: false,
                tabBarIcon: ({color, size}) =>(
                    <Ionicons name="home" color={color} size={size}/>
                ),
            }}
        />

        <Tabs.Screen    
            name="groups"
            options={{
                title: "Groups",
                headerShown: false,
                tabBarIcon:({color, size}) =>(
                    <Ionicons name="people" color={color} size={size}/>
                )
            }}
        />
        <Tabs.Screen    
            name="profile"
            options={{
                title: "Profile",
                headerShown: false,
                tabBarIcon:({color, size}) =>(
                    <Ionicons name="person-circle-outline" color={color} size={size}/>
                )
            }}
        />
    </Tabs>
  )
}

export default TabLayout;

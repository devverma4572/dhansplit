import React from 'react'
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

function TabLayout() {
  return (
    <Tabs screenOptions={{headerShown: false}}>
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
            name="Expenses"
            options={{
                title: "Expenses",
                headerShown: false,
                tabBarIcon: ({color, size}) =>(
                    <Ionicons name="cash" size={size} color={color}/>
                ),
            }}
        />

        <Tabs.Screen
            name="Profile"
            options={{
                title: "Profile",
                tabBarIcon: ({color, size}) =>(
                    <Ionicons name="person" size={size} color={color}/>
                ),
            }}
        />
    </Tabs>
  )
}

export default TabLayout;

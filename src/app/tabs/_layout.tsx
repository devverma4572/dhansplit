import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

function TabLayout() {
  return (
    <Tabs screenOptions={{
        headerShown: false,
        tabBarStyle:{
            backgroundColor: "#020617",
            height: 60,
            paddingBottom: 5,
            paddingTop: 5,

            ...(Platform.OS === "web"
                ?{
                    position: "absolute",
                    width: 430,
                    alignSelf: "center",
                    left: "50%",
                    marginLeft: -215,
                    borderTopWidth: 1,
                    borderColor: "#374151",
                }
                :{
                    width: "100%",
                }
            ),
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

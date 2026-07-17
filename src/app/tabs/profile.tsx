import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "../ScreenWrapper";

import { signOut } from "firebase/auth";
import { Alert, Platform } from "react-native";
import { auth } from "../../../config/firebase";

// --------------------------------------- Handle Logout Function -------------------------------------------
const handleLogout = async () =>{
  if(Platform.OS === "web"){
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if(!confirmed){
      return;
    }
    try{
      await signOut(auth);
      router.replace("/WelcomeScreen");
    } 
    catch(error){
      console.log("Logout Error: ", error);
    }
    return;
  }
  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async()=>{
          try{
            await signOut(auth);
            router.replace("/WelcomeScreen");
          }
          catch (error){
            console.log("Logout Error: ", error);
          }
        },
      },
    ]

  )
}
// --------------------------------------------------------------------------------





export default function ProfileScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.container}>

        {/* Header */}

        <Text style={styles.header}>
          Profile
        </Text>

        {/* Avatar */}

        <View style={styles.avatarContainer}>

          <Image
            source={{
              uri:
                "https://ui-avatars.com/api/?name=Dev&background=1F2937&color=ffffff",
            }}
            style={styles.avatar}
          />

          <TouchableOpacity style={styles.editAvatar}>
            <Ionicons
              name="camera"
              size={15}
              color="white"
            />
          </TouchableOpacity>

        </View>

        {/* User Details */}

        <Text style={styles.name}>
          Dev Kumar
        </Text>

        <Text style={styles.username}>
          @kumardevvv
        </Text>

        <Text style={styles.email}>
          dkvmpi@gmail.com
        </Text>

        {/* Edit Button */}

        <TouchableOpacity
          style={styles.editButton}
          onPress={()=> router.push("/profile/edit")}
        >
          <Ionicons
            name="create-outline"
            size={16}
            color="white"
          />

          <Text style={styles.editButtonText}>
            Edit Profile
          </Text>
        </TouchableOpacity>

        {/* Section */}

        <Text style={styles.sectionTitle}>
          Account
        </Text>

        {/* Cards */}

        <TouchableOpacity 
        style={styles.card}
        onPress={()=> router.push("/profile/edit")}
        >

          <View style={styles.left}>

            <View
              style={styles.iconContainer}
            >
              <Ionicons
                name="person-outline"
                color="#4F7BFF"
                size={20}
              />
            </View>

            <Text style={styles.cardText}>
              Edit Profile
            </Text>

          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#8B949E"
          />

        </TouchableOpacity>

        <TouchableOpacity 
        style={styles.card}
        onPress={handleLogout}
        >

          <View style={styles.left}>

            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor:
                    "#2A1A1A",
                },
              ]}
            >
              <Ionicons
                name="log-out-outline"
                color="#ff5c5c"
                size={20}
              />
            </View>

            <Text
              style={[
                styles.cardText,
                {
                  color: "#ff5c5c",
                },
              ]}
            >
              Logout
            </Text>

          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#8B949E"
          />

        </TouchableOpacity>

      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  header: {
    color: "white",
    fontSize: 30,
    fontWeight: "700",
    alignSelf: "center",
    marginTop: 10,
  },

  avatarContainer: {
    marginTop: 35,
    alignSelf: "center",
    position: "relative",
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#3D5AFE",
  },

  editAvatar: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#3D5AFE",
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    color: "white",
    fontSize: 26,
    fontWeight: "700",
    alignSelf: "center",
    marginTop: 18,
  },

  username: {
    color: "#55efc4",
    fontSize: 15,
    alignSelf: "center",
    marginTop: 3,
  },

  email: {
    color: "#8B949E",
    fontSize: 14,
    alignSelf: "center",
    marginTop: 4,
  },

  editButton: {
    marginTop: 25,
    alignSelf: "center",

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#1A2234",

    paddingHorizontal: 22,
    paddingVertical: 12,

    borderRadius: 30,

    gap: 8,
  },

  editButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },

  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 45,
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#161B22",

    borderRadius: 18,

    padding: 18,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 16,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  cardText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

});
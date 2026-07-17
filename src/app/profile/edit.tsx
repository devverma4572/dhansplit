import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import ScreenWrapper from "../ScreenWrapper";

import { auth, firestore } from "../../../config/firebase";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";

import { updateProfile } from "firebase/auth";

export default function EditProfile() {
  const currentUser = auth.currentUser;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      if (!currentUser) return;

      const userRef = doc(
        firestore,
        "users",
        currentUser.uid
      );

      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        const data = snapshot.data();

        setName(data.name || "");
        setUsername(data.userName || "");
        setEmail(data.email || "");
        setProfileImage(data.profileImage || "");
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const saveProfile = async () => {
    if (!currentUser) return;

    if (!name.trim()) {
      Alert.alert("Enter your name");
      return;
    }

    if (!username.trim()) {
      Alert.alert("Enter username");
      return;
    }

    setSaving(true);

    try {
      const usernameQuery = query(
        collection(firestore, "users"),
        where("userName", "==", username.trim())
      );

      const result = await getDocs(usernameQuery);

      let usernameTaken = false;

      result.forEach((docItem) => {
        if (docItem.id !== currentUser.uid) {
          usernameTaken = true;
        }
      });

      if (usernameTaken) {
        Alert.alert(
          "Username already exists"
        );
        setSaving(false);
        return;
      }

      await updateDoc(
        doc(
          firestore,
          "users",
          currentUser.uid
        ),
        {
          name: name.trim(),
          userName: username.trim(),
          profileImage: profileImage.trim(),
        }
      );

      await updateProfile(currentUser, {
        displayName: name.trim(),
      });

      Alert.alert(
        "Success",
        "Profile updated successfully."
      );

      router.back();
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        "Something went wrong."
      );
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loader}>
          <ActivityIndicator
            size="large"
            color="#3D5AFE"
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              color="white"
              size={25}
            />
          </TouchableOpacity>

          <Text style={styles.title}>
            Edit Profile
          </Text>

          <View style={{ width: 25 }} />
        </View>

        <Image
          source={{
            uri:
              profileImage ||
              "https://ui-avatars.com/api/?name=" +
                name,
          }}
          style={styles.avatar}
        />

        <Text style={styles.label}>
          Profile Image URL
        </Text>

        <TextInput
          style={styles.input}
          value={profileImage}
          onChangeText={setProfileImage}
          placeholder="Image URL"
          placeholderTextColor="#777"
        />

        <Text style={styles.label}>
          Full Name
        </Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor="#777"
        />

        <Text style={styles.label}>
          Username
        </Text>

        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholder="@username"
          placeholderTextColor="#777"
        />

        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          editable={false}
          value={email}
          style={styles.disabledInput}
        />

        <TouchableOpacity
          style={styles.saveButton}
          disabled={saving}
          onPress={saveProfile}
        >
          {saving ? (
            <ActivityIndicator
              color="white"
            />
          ) : (
            <Text style={styles.saveText}>
              Save Changes
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 35,
  },

  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },

  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignSelf: "center",
    marginBottom: 30,
    borderWidth: 3,
    borderColor: "#3D5AFE",
  },

  label: {
    color: "#8B949E",
    marginBottom: 8,
    marginTop: 15,
    fontSize: 14,
  },

  input: {
    backgroundColor: "#161B22",
    color: "white",
    borderRadius: 15,
    paddingHorizontal: 18,
    paddingVertical: 15,
    fontSize: 16,
  },

  disabledInput: {
    backgroundColor: "#222831",
    color: "#777",
    borderRadius: 15,
    paddingHorizontal: 18,
    paddingVertical: 15,
    fontSize: 16,
  },

  saveButton: {
    marginTop: 35,
    backgroundColor: "#3D5AFE",
    borderRadius: 18,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  saveText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
});
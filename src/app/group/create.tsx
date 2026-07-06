import React, { useState } from "react";

import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
    addDoc,
    collection,
    getDocs,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";

import { auth, firestore } from "../../../config/firebase";
import { AppUser } from "../../../types/group";

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");

  const [userName, setuserName] = useState("");

  const [searchResult, setSearchResult] =
    useState<AppUser | null>(null);

  const [selectedMembers, setSelectedMembers] =
    useState<AppUser[]>([]);

  const [searching, setSearching] = useState(false);

  const [creating, setCreating] = useState(false);

const searchUser = async () => {
  const searcheduserName = userName.trim().toLowerCase();

  console.log("Searching for:", searcheduserName);

  if (!searcheduserName) {
    Alert.alert("Enter userName", "Please enter a userName.");
    return;
  }

  try {
    setSearching(true);
    setSearchResult(null);

    const usersRef = collection(firestore, "users");

    const usersQuery = query(
      usersRef,
      where("userName", "==", searcheduserName)
    );

    const snapshot = await getDocs(usersQuery);

    console.log("Number of users found:", snapshot.size);

    if (snapshot.empty) {
      Alert.alert(
        "User Not Found",
        `No user found with userName @${searcheduserName}`
      );
      return;
    }

    const userDocument = snapshot.docs[0];

    console.log(
      "Found user:",
      userDocument.id,
      userDocument.data()
    );

    const foundUser: AppUser = {
      uid: userDocument.id,
      name: userDocument.data().name || "",
      username: userDocument.data().userName || "",
      email: userDocument.data().email || "",
      profileImage: userDocument.data().profileImage || "",
    };

    if (foundUser.uid === auth.currentUser?.uid) {
      Alert.alert(
        "That's You",
        "You are already automatically included in the group."
      );
      return;
    }

    setSearchResult(foundUser);
  } catch (error: any) {
    console.log("SEARCH USER ERROR:", error);
    console.log("ERROR CODE:", error?.code);
    console.log("ERROR MESSAGE:", error?.message);

    Alert.alert(
      "Search Error",
      error?.message || "Something went wrong while searching."
    );
  } finally {
    setSearching(false);
  }
};

  const addMember = () => {
    if (!searchResult) {
      return;
    }

    const alreadyAdded = selectedMembers.some(
      (member) =>
        member.uid === searchResult.uid
    );

    if (alreadyAdded) {
      Alert.alert(
        "Already Added",
        "This user is already in the group."
      );

      return;
    }

    setSelectedMembers((previousMembers) => [
      ...previousMembers,
      searchResult,
    ]);

    setSearchResult(null);
    setuserName("");
  };

  const removeMember = (uid: string) => {
    setSelectedMembers((previousMembers) =>
      previousMembers.filter(
        (member) => member.uid !== uid
      )
    );
  };

 const createGroup = async () => {
  console.log("CREATE GROUP BUTTON PRESSED");

  const currentUser = auth.currentUser;

  if (!currentUser) {
    Alert.alert("Error", "You must be logged in.");
    return;
  }

  if (!groupName.trim()) {
    Alert.alert(
      "Group Name Required",
      "Please enter a group name."
    );
    return;
  }

  try {
    setCreating(true);

    const memberIds = [
      currentUser.uid,
      ...selectedMembers
        .filter((member) => member.uid !== currentUser.uid)
        .map((member) => member.uid),
    ];

    console.log("Member IDs:", memberIds);

    const groupRef = await addDoc(
      collection(firestore, "groups"),
      {
        name: groupName.trim(),
        createdBy: currentUser.uid,
        members: memberIds,
        totalExpense: 0,
        createdAt: serverTimestamp(),
      }
    );

    console.log("GROUP CREATED:", groupRef.id);

    Alert.alert(
      "Success",
      "Group created successfully."
    );

    router.replace("/tabs/groups");

  } catch (error: any) {
    console.log("CREATE GROUP ERROR:", error);
    console.log("ERROR CODE:", error?.code);
    console.log("ERROR MESSAGE:", error?.message);

    Alert.alert(
      "Error",
      error?.message || "Could not create group."
    );
  } finally {
    setCreating(false);
  }
};

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={28}
            color="white"
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Create Group
        </Text>
      </View>

      <Text style={styles.label}>
        Group Name
      </Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Goa Trip"
        placeholderTextColor="#666"
        value={groupName}
        onChangeText={setGroupName}
      />

      <Text style={styles.label}>
        Add Members
      </Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter userName"
          placeholderTextColor="#666"
          value={userName}
          autoCapitalize="none"
          onChangeText={setuserName}
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={searchUser}
        >
          {searching ? (
            <ActivityIndicator color="white" />
          ) : (
            <Ionicons
              name="search"
              size={22}
              color="white"
            />
          )}
        </TouchableOpacity>
      </View>

      {searchResult && (
        <View style={styles.userCard}>
          <View>
            <Text style={styles.userName}>
              {searchResult.name}
            </Text>

            <Text style={styles.useruserName}>
              @{searchResult.username}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addMemberButton}
            onPress={addMember}
          >
            <Ionicons
              name="add"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.label}>
        Selected Members
      </Text>

      {selectedMembers.length === 0 ? (
        <Text style={styles.noMembers}>
          No members added yet.
        </Text>
      ) : (
        selectedMembers.map((member) => (
          <View
            key={member.uid}
            style={styles.memberCard}
          >
            <View>
              <Text style={styles.userName}>
                {member.name}
              </Text>

              <Text style={styles.useruserName}>
                @{member.username}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                removeMember(member.uid)
              }
            >
              <Ionicons
                name="close-circle"
                size={27}
                color="#ff7675"
              />
            </TouchableOpacity>
          </View>
        ))
      )}

      <TouchableOpacity
        style={styles.createButton}
        onPress={createGroup}

        disabled={creating}
      >
        {creating ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.createText}>
            Create Group
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
  },

  content: {
    padding: 20,
    paddingTop: 55,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 35,
  },

  title: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },

  label: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 18,
  },

  input: {
    backgroundColor: "#161B22",
    color: "white",
    padding: 16,
    borderRadius: 12,
  },

  searchRow: {
    flexDirection: "row",
    gap: 10,
  },

  searchInput: {
    flex: 1,
    backgroundColor: "#161B22",
    color: "white",
    padding: 16,
    borderRadius: 12,
  },

  searchButton: {
    width: 55,
    backgroundColor: "#3D5AFE",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  userCard: {
    backgroundColor: "#161B22",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  memberCard: {
    backgroundColor: "#161B22",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  userName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  useruserName: {
    color: "#8B949E",
    marginTop: 4,
  },

  addMemberButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3D5AFE",
    justifyContent: "center",
    alignItems: "center",
  },

  noMembers: {
    color: "#8B949E",
  },

  createButton: {
    backgroundColor: "#3D5AFE",
    padding: 17,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 40,
  },

  createText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
});
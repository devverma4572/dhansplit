import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { auth, firestore } from "../../../config/firebase";
import { Group } from "../../../types/group";

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      setLoading(true);

      const currentUser = auth.currentUser;

      if (!currentUser) {
        return;
      }

      const groupsQuery = query(
        collection(firestore, "groups"),
        where(
          "members",
          "array-contains",
          currentUser.uid
        )
      );

      const snapshot = await getDocs(groupsQuery);

      const groupList: Group[] = snapshot.docs.map(
        (groupDoc) => ({
          id: groupDoc.id,
          ...(groupDoc.data() as Omit<Group, "id">),
        })
      );

      setGroups(groupList);
    } catch (error) {
      console.log("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [])
  );

  const handleDeleteGroup = (group: Group) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return;
    }

    if (group.createdBy !== currentUser.uid) {
      Alert.alert(
        "Cannot Delete",
        "Only the group creator can delete this group."
      );

      return;
    }

    Alert.alert(
      "Delete Group",
      `Are you sure you want to delete ${group.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(
                doc(firestore, "groups", group.id)
              );

              setGroups((previousGroups) =>
                previousGroups.filter(
                  (item) => item.id !== group.id
                )
              );
            } catch (error) {
              console.log(
                "Error deleting group:",
                error
              );
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#3DA9FC"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Your Groups
          </Text>

          <Text style={styles.subtitle}>
            {groups.length} groups
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("../group/create")}
        >
          <Ionicons
            name="add"
            size={28}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {groups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="people-outline"
            size={70}
            color="#555"
          />

          <Text style={styles.emptyTitle}>
            No groups yet
          </Text>

          <Text style={styles.emptyText}>
            Create your first group and start
            splitting expenses.
          </Text>

          <TouchableOpacity
            style={styles.createButton}
            onPress={() =>
              router.push("/group/create")
            }
          >
            <Text style={styles.createButtonText}>
              Create Group
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.groupCard}
              onPress={() =>
                router.push({
                  pathname: "/group/[id]",
                  params: {
                    id: item.id,
                  },
                })
              }
              onLongPress={() =>
                handleDeleteGroup(item)
              }
            >
              <View style={styles.groupIcon}>
                <Ionicons
                  name="people"
                  size={25}
                  color="white"
                />
              </View>

              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>
                  {item.name}
                </Text>

                <Text style={styles.memberCount}>
                  {item.members.length} members
                </Text>
              </View>

              <View style={styles.rightSection}>
                <Text style={styles.total}>
                  ₹{item.totalExpense || 0}
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#888"
                />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
    paddingHorizontal: 18,
    paddingTop: 55,
  },

  center: {
    flex: 1,
    backgroundColor: "#0B1220",
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#8B949E",
    marginTop: 5,
  },

  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3D5AFE",
    justifyContent: "center",
    alignItems: "center",
  },

  groupCard: {
    backgroundColor: "#161B22",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  groupIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#3D5AFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  groupInfo: {
    flex: 1,
  },

  groupName: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },

  memberCount: {
    color: "#8B949E",
    marginTop: 5,
  },

  rightSection: {
    alignItems: "flex-end",
    gap: 6,
  },

  total: {
    color: "#55efc4",
    fontSize: 16,
    fontWeight: "bold",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },

  emptyTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
  },

  emptyText: {
    color: "#8B949E",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },

  createButton: {
    backgroundColor: "#3D5AFE",
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 25,
  },

  createButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
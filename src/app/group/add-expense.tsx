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

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { auth, firestore } from "../../../config/firebase";

// ------------------------------------ GROUP SNAPSHOT -------------------------------------------

export default function AddExpense() {

  const { groupId } =
    useLocalSearchParams<{
      groupId: string;
    }>();

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [splitType, setSplitType] =
    useState<"equal" | "unequal">(
      "equal"
    );

  const [saving, setSaving] =
    useState(false);

  const saveExpense = async () => {

    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert(
        "Error",
        "You must be logged in."
      );

      return;
    }

    if (!title.trim()) {
      Alert.alert(
        "Title Required",
        "Please enter an expense title."
      );

      return;
    }

    if (
      !amount ||
      Number(amount) <= 0
    ) {
      Alert.alert(
        "Invalid Amount",
        "Please enter a valid amount."
      );

      return;
    }

    if (!groupId) {
      Alert.alert(
        "Error",
        "Group information is missing."
      );

      return;
    }

    try {
      
      

      setSaving(true);

      const numericAmount =
        Number(amount);

      const userRef = doc(
  firestore,
  "users",
  currentUser.uid
);

const userSnapshot = await getDoc(userRef);

let payerName = "Unknown User";

if (userSnapshot.exists()) {
  const userData = userSnapshot.data();

  payerName =
    userData.name ||
    userData.userName ||
    currentUser.displayName ||
    "Unknown User";
}

console.log("Payer name:", payerName);

const groupSnapshot = await getDoc(
  doc(firestore, "groups", groupId)
);

const groupData = groupSnapshot.data();

const memberIds: string[] =
  groupData?.members || [];

const sharePerPerson =
  numericAmount / memberIds.length;

const expenseSplits = memberIds.map(
  (memberId) => ({
    userId: memberId,
    amount: sharePerPerson,
  })
);

      const expenseRef = await addDoc(
        collection(firestore, "expenses"),
        {
          groupId: groupId,

          title: title.trim(),

          description:
            description.trim(),

          amount: numericAmount,

          paidBy: currentUser.uid,
          paidByName: payerName,

          splitType: splitType,   

          splits: expenseSplits,
          settledUserIds: [],

          createdAt:
            serverTimestamp(),
        }
      );

      console.log(
        "Expense created:",
        expenseRef.id
      );

      // Update group total expense

      await updateDoc(
        doc(firestore, "groups", groupId),
        {
          totalExpense:
            increment(numericAmount),
        }
      );

      Alert.alert(
        "Success",
        "Expense added successfully."
      );

      router.replace({
        pathname: "/group/[id]",
        params: {
          id: groupId,
        },
      });

    } catch (error: any) {

      console.log(
        "ADD EXPENSE ERROR:",
        error
      );

      Alert.alert(
        "Error",
        error?.message ||
          "Could not add expense."
      );

    } finally {

      setSaving(false);

    }
  };
    return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() =>
            router.replace({
              pathname: "/group/[id]",
              params: {
                id: groupId,
              },
            })
          }
        >
          <Ionicons
            name="arrow-back"
            size={28}
            color="white"
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Add Expense
        </Text>

      </View>

      <Text style={styles.label}>
        Expense Title
      </Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Groceries"
        placeholderTextColor="#666"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>
        Description
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.descriptionInput,
        ]}
        placeholder="What was this expense for?"
        placeholderTextColor="#666"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>
        Amount
      </Text>

      <View style={styles.amountContainer}>

        <Text style={styles.currency}>
          ₹
        </Text>

        <TextInput
          style={styles.amountInput}
          placeholder="0"
          placeholderTextColor="#666"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

      </View>

      <Text style={styles.label}>
        Split Type
      </Text>

      <View style={styles.splitContainer}>

        <TouchableOpacity
          style={[
            styles.splitButton,

            splitType === "equal" &&
              styles.activeSplitButton,
          ]}
          onPress={() =>
            setSplitType("equal")
          }
        >

          <Ionicons
            name="people"
            size={24}
            color={
              splitType === "equal"
                ? "white"
                : "#8B949E"
            }
          />

          <Text
            style={[
              styles.splitText,

              splitType === "equal" &&
                styles.activeSplitText,
            ]}
          >
            Equal
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.splitButton,

            splitType === "unequal" &&
              styles.activeSplitButton,
          ]}
          onPress={() =>
            setSplitType("unequal")
          }
        >

          <Ionicons
            name="options"
            size={24}
            color={
              splitType === "unequal"
                ? "white"
                : "#8B949E"
            }
          />

          <Text
            style={[
              styles.splitText,

              splitType === "unequal" &&
                styles.activeSplitText,
            ]}
          >
            Unequal
          </Text>

        </TouchableOpacity>

      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveExpense}
        disabled={saving}
      >

        {saving ? (
          <ActivityIndicator
            color="white"
          />
        ) : (
          <Text style={styles.saveText}>
            Add Expense
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
    marginBottom: 35,
  },

  title: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 20,
  },

  label: {
    color: "white",
    fontSize: 15,
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

  descriptionInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },

  amountContainer: {
    backgroundColor: "#161B22",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  currency: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },

  amountInput: {
    flex: 1,
    color: "white",
    fontSize: 25,
    padding: 16,
  },

  splitContainer: {
    flexDirection: "row",
    gap: 12,
  },

  splitButton: {
    flex: 1,
    backgroundColor: "#161B22",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    gap: 7,
  },

  activeSplitButton: {
    backgroundColor: "#3D5AFE",
  },

  splitText: {
    color: "#8B949E",
    fontWeight: "600",
  },

  activeSplitText: {
    color: "white",
  },

  saveButton: {
    backgroundColor: "#3D5AFE",
    padding: 17,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 45,
  },

  saveText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
});
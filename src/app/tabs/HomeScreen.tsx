import React, { useEffect, useState } from "react";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, firestore } from "../../../config/firebase";

import {
  Expense,
  Group,
  UserData,
} from "../../../types/home";

import { router } from "expo-router";




// ------------------------------------------- Interface created -----------------------------------
interface ExpenseSplit {
  userId: string;
  amount: number;
}

// --------------------------------------------------------------------------------------------------



export default function HomeScreen() {

// -------------------------------- Creating variables from firestore database --------------------------------------

  const [userData, setUserData] = useState<UserData | null>(null);

  const [groups, setGroups] = useState<Group[]>([]);

  const [recentExpenses, setRecentExpenses] =
    useState<Expense[]>([]);

  const [totalExpenses, setTotalExpenses] = useState(0);

  const [youOwe, setYouOwe] = useState(0);

  const [youAreOwed, setYouAreOwed] = useState(0);

  const [loading, setLoading] = useState(true);

// -----------------------------------------------------------------------------------------------------------------------



// ------------------------------------ fetching uesrdata ----------------------------------------

const fetchUserData = async (uid: string) => {
  const userRef = doc(firestore, "users", uid);

  const userSnapshot = await getDoc(userRef);

  if (userSnapshot.exists()) {
    setUserData(userSnapshot.data() as UserData);
  }
};

// ------------------------------------------------------------------------------------------------------




// ------------------------------------------------- Finding group belongs to current user ---------------------------

const fetchUserGroups = async (uid: string) => {
  const groupsRef = collection(firestore, "groups");

  const groupsQuery = query(
    groupsRef,
    where("members", "array-contains", uid)
  );

  const snapshot = await getDocs(groupsQuery);

  const groupsData: Group[] = snapshot.docs.map((groupDoc) => ({
    id: groupDoc.id,
    ...(groupDoc.data() as Omit<Group, "id">),
  }));

  setGroups(groupsData);

  return groupsData;
};





// ---------------------------------------------Fetching expense for the user's groups --------------------------------------------------------------



const fetchExpenses = async (
  userGroups: Group[],
  currentUserId: string
) => {
  const allExpenses: Expense[] = [];

  for (const group of userGroups) {
    const expensesQuery = query(
      collection(firestore, "expenses"),
      where("groupId", "==", group.id)
    );

    const snapshot = await getDocs(expensesQuery);

    snapshot.docs.forEach((expenseDoc) => {
      allExpenses.push({
        id: expenseDoc.id,
        ...(expenseDoc.data() as Omit<Expense, "id">),
      });
    });
  }

  calculateSummary(allExpenses, currentUserId);

  setRecentExpenses(allExpenses.slice(0, 5));
};

const calculateSummary = (
  expenses: Expense[],
  currentUserId: string
) => {
  let total = 0;
  let owe = 0;
  let owed = 0;

  expenses.forEach((expense) => {
    const expenseAmount =
      Number(expense.amount);

    total += expenseAmount;

    const mySplit =
      expense.splits?.find(
        (split) =>
          split.userId === currentUserId
      );

    // Current user was not included
    if (!mySplit) {
      return;
    }

    const myShare =
      Number(mySplit.amount);

    // CASE 1:
    // I paid for the expense
    if (
      expense.paidBy === currentUserId
    ) {
      // Other members owe me
      owed +=
        expenseAmount - myShare;
    }

    // CASE 2:
    // Someone else paid
    else {
      // I owe my share to the payer
      owe += myShare;
    }
  });

  console.log("SUMMARY:", {
    total,
    owe,
    owed,
  });

  setTotalExpenses(total);
  setYouOwe(owe);
  setYouAreOwed(owed);
};


useEffect(() => {
  loadHomeData();
}, []);

const loadHomeData = async () => {
  try {
    setLoading(true);

    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.log("No logged-in user");
      return;
    }

    const uid = currentUser.uid;

    // Get profile
    await fetchUserData(uid);

    // Get groups
    const userGroups = await fetchUserGroups(uid);

    // Get expenses
    await fetchExpenses(userGroups, uid);

  } catch (error) {
    console.log("Error loading home data:", error);
  } finally {
    setLoading(false);
  }
};


if (loading) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator
        size="large"
        color="#3DA9FC"
      />

      <Text style={styles.loadingText}>
        Loading your expenses...
      </Text>
    </View>
  );
}





  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Evening 👋</Text>
            <Text style={styles.username}>{userData?.name || "User"}</Text>
          </View>

          <TouchableOpacity>
            <Ionicons
              name="notifications-outline"
              size={28}
              color="#3DA9FC"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryContainer}>

          <View style={styles.summaryCard}>
            <Ionicons name="wallet-outline" size={28} color="#3DA9FC" />
            <Text style={styles.summaryTitle}>Total Expenses</Text>
            <Text style={styles.summaryAmount}>₹{totalExpenses.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons name="arrow-down-circle" size={28} color="#ff7675" />
            <Text style={styles.summaryTitle}>You Owe</Text>
            <Text style={[styles.summaryAmount, { color: "#ff7675" }]}>
              ₹{youOwe.toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons name="arrow-up-circle" size={28} color="#55efc4" />
            <Text style={styles.summaryTitle}>You Are Owed</Text>
            <Text style={[styles.summaryAmount, { color: "#55efc4" }]}>
              ₹{youAreOwed.toFixed(2)}
            </Text>
          </View>

        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>

          {recentExpenses.map((expense) => (
            <TouchableOpacity key={expense.id} style={styles.expenseCard}>
              <View>
                <Text style={styles.expenseTitle}>{expense.title}</Text>
                <Text style={styles.expenseSubtitle}>
                  {/* {expense.group} • Paid by {expense.paidBy} */}
                </Text>
              </View>

              <Text style={styles.expenseAmount}>
                ₹{expense.amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Groups</Text>

          {groups.map((group) => (
            <TouchableOpacity key={group.id} style={styles.groupCard}
            onPress={()=>
              router.push({
                pathname: "/group/[id]",
                params:{
                  id: group.id,
                },
              })
            }
            >
              <View style={styles.groupIcon}>
                <Ionicons
                  name="people"
                  color="white"
                  size={20}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.groupName}>
                  {group.name}
                </Text>

                <Text style={styles.groupMembers}>
                  {group.members.length} Members
                </Text>
              </View>

              <View>
                <Text style={styles.groupTotal}>
                  ₹{group.totalExpense || 0}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />

      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  greeting: {
    color: "#8B949E",
    fontSize: 15,
  },

  username: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },

  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  summaryCard: {
    width: "31%",
    backgroundColor: "#161B22",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
  },

  summaryTitle: {
    color: "#AAB1B7",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },

  summaryAmount: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 6,
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 14,
  },

  expenseCard: {
    backgroundColor: "#161B22",
    padding: 16,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  expenseTitle: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },

  expenseSubtitle: {
    color: "#8B949E",
    marginTop: 5,
  },

  expenseAmount: {
    color: "#3DA9FC",
    fontWeight: "bold",
    fontSize: 18,
  },

  groupCard: {
    backgroundColor: "#161B22",
    padding: 16,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#3D5AFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  groupName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  groupMembers: {
    color: "#8B949E",
    marginTop: 4,
  },

  groupTotal: {
    color: "#55efc4",
    fontWeight: "bold",
    fontSize: 18,
  },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 25,
    backgroundColor: "#3D5AFE",
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  loadingContainer: {
  flex: 1,
  backgroundColor: "#0B1220",
  justifyContent: "center",
  alignItems: "center",
},

loadingText: {
  color: "white",
  marginTop: 12,
},
});
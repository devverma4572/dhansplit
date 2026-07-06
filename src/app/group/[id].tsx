import React, {
  useCallback,
  useRef,
  useState
} from "react";




import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  where,
  writeBatch
} from "firebase/firestore";

import { auth, firestore } from "../../../config/firebase";
import { ExpenseSplit } from "../../../types/group";

interface Group {
  id: string;
  name: string;
  createdBy: string;
  members: string[];
  totalExpense: number;
}

interface Expense {
  id: string;
  groupId: string;
  title: string;
  description: string;
  amount: number;
  paidBy: string;
  paidByName: string;
  splitType: "equal" | "unequal";
  splits: ExpenseSplit[];
  createdAt?: any;
}

export default function GroupDetails() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [group, setGroup] =
    useState<Group | null>(null);

  // ----------------------------------------- Creating variables for owe and owed amount ---------------------------------------------------

  // const [expense, setExpenses] = useState<Expense[]>([]);
  const [TotalSpent, setTotalSpent] = useState(0);
  const [YouOwe, setYouOwe] = useState(0);
  const [YouAreOwed, setYouAreOwed] = useState(0);

  const [groupMenuVisible, setGroupMenuVisible] = useState(false);






  // --------------------------- Three dots menu function for expenses --------------------------------------

  const [selectedExpense, setSelectedExpense] =
    useState<Expense | null>(null);

  const expenseMenuButtonRef = useRef<View>(null);

  const [expenseMenuPosition, setExpenseMenuPosition] = useState({
    top: 0,
    right: 0,
  });

  // ---------------------------------------------------------------------------------------------------------

  const [expenseMenuVisible, setExpenseMenuVisible] =
    useState(false);

  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [loading, setLoading] =
    useState(true);

  // ------------------------------ Function to delete Group --------------------------------------

  const deleteGroupFromFirebase = async () => {
    if (!group) return;

    try {
      const batch = writeBatch(firestore);

      expenses.forEach((expense) => {
        batch.delete(
          doc(firestore, "expenses", expense.id)
        );
      });

      batch.delete(
        doc(firestore, "groups", group.id)
      );

      await batch.commit();

      console.log("GROUP DELETED SUCCESSFULLY");

      router.replace("/tabs/groups");
    } catch (error: any) {
      console.log("DELETE GROUP ERROR:", error);
      console.log("ERROR CODE:", error?.code);
      console.log("ERROR MESSAGE:", error?.message);
    }
  };


  const handleDeleteGroup = () => {
    if (!group) return;

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${group.name}"? All expenses will also be deleted.`
      );

      if (confirmed) {
        deleteGroupFromFirebase();
      }

      return;
    }

    Alert.alert(
      "Delete Group",
      `Are you sure you want to delete "${group.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteGroupFromFirebase,
        },
      ]
    );
  };


  // ------------------------------------ Function to delete a expense ----------------------------------

  const deleteExpenseFromFirebase = async (
    expense: Expense
  ) => {
    if (!group) return;

    try {
      const batch = writeBatch(firestore);

      batch.delete(
        doc(
          firestore,
          "expenses",
          expense.id
        )
      );

      batch.update(
        doc(
          firestore,
          "groups",
          group.id
        ),
        {
          totalExpense: increment(
            -Number(expense.amount)
          ),
        }
      );

      await batch.commit();

      console.log(
        "EXPENSE DELETED SUCCESSFULLY"
      );

      setExpenses((currentExpenses) =>
        currentExpenses.filter(
          (item) => item.id !== expense.id
        )
      );

      setGroup((currentGroup) => {
        if (!currentGroup) return null;

        return {
          ...currentGroup,
          totalExpense: Math.max(
            0,
            currentGroup.totalExpense -
            Number(expense.amount)
          ),
        };
      });

      setSelectedExpense(null);
    } catch (error: any) {
      console.log(
        "DELETE EXPENSE ERROR:",
        error
      );

      console.log(
        "ERROR CODE:",
        error?.code
      );

      console.log(
        "ERROR MESSAGE:",
        error?.message
      );
    }
  };

  const handleDeleteExpense = (
    expense: Expense
  ) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${expense.title}"?`
      );

      if (confirmed) {
        deleteExpenseFromFirebase(expense);
      }

      return;
    }

    Alert.alert(
      "Delete Expense",
      `Delete "${expense.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            deleteExpenseFromFirebase(expense),
        },
      ]
    );
  };

  const calculateGroupSummary = (
  groupExpenses: Expense[]
) => {
  const currentUserId =
    auth.currentUser?.uid;

  if (!currentUserId) {
    return;
  }

  let total = 0;
  let owe = 0;
  let owed = 0;

  groupExpenses.forEach((expense) => {
    const expenseAmount =
      Number(expense.amount);

    // Add complete expense amount
    total += expenseAmount;

    // Find current user's share
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

    // I paid the expense
    if (
      expense.paidBy === currentUserId
    ) {
      owed +=
        expenseAmount - myShare;
    }

    // Another member paid
    else {
      owe += myShare;
    }
  });

  console.log("GROUP SUMMARY:", {
    total,
    owe,
    owed,
  });

  setTotalSpent(total);
  setYouOwe(owe);
  setYouAreOwed(owed);
};





  const fetchGroupDetails = async () => {
    if (!id) {
      return;
    }



    try {
      setLoading(true);

      console.log("Opening group:", id);

      // Fetch group
      const groupRef = doc(
        firestore,
        "groups",
        id
      );

      const groupSnapshot =
        await getDoc(groupRef);

      if (groupSnapshot.exists()) {
        setGroup({
          id: groupSnapshot.id,
          ...(groupSnapshot.data() as Omit<
            Group,
            "id"
          >),
        });
      }

      // Fetch expenses belonging to group
      const expenseQuery = query(
        collection(firestore, "expenses"),
        where("groupId", "==", id)
      );

      const expenseSnapshot =
        await getDocs(expenseQuery);

      const expenseList: Expense[] =
        expenseSnapshot.docs.map(
          (expenseDoc) => ({
            id: expenseDoc.id,
            ...(expenseDoc.data() as Omit<
              Expense,
              "id"
            >),
          })
        );

      console.log(
        "Expenses found:",
        expenseList.length
      );

      setExpenses(expenseList);
      calculateGroupSummary(expenseList);

    } catch (error) {
      console.log(
        "Error loading group:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGroupDetails();
    }, [id])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#3D5AFE"
        />
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Group not found
        </Text>
      </View>
    );
  }
  const formatExpenseDate = (timestamp: any) => {
    if (!timestamp) {
      return "";
    }

    const date = timestamp.toDate();

    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.container}>

      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            router.replace("/tabs/groups")
          }
        >
          <Ionicons
            name="arrow-back"
            size={28}
            color="white"
          />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.groupName}>
            {group.name}
          </Text>

          <Text style={styles.memberText}>
            {group.members.length} members
          </Text>
        </View>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setGroupMenuVisible(true)}>
          <Ionicons
            name="ellipsis-vertical"
            size={24}
            color="white" />
        </TouchableOpacity>

      </View>

      {/* Total Expense */}


      <View style={styles.summaryCard}>
        {/* Left Side */}
        <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>
          Total Group Expense
        </Text>

        <Text style={styles.summaryAmount}>
          ₹{group.totalExpense || 0}
        </Text>
        </View>

      {/* Vertical Divider */}
      <View style={styles.summaryDivider}/>

      {/* Right Side */}
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>
          You Owe
        </Text>

        <Text style={styles.oweAmount}>
          ₹{YouOwe.toFixed(2) || 0}
        </Text>
        </View>
      </View> 


      {/* Expense Header */}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Expenses
        </Text>

        <Text style={styles.expenseCount}>
          {expenses.length}
        </Text>
      </View>

      {/* Expense List */}

      <Modal
        visible={expenseMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setExpenseMenuVisible(false)
        }
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() =>
            setExpenseMenuVisible(false)
          }
        >
          <View
            style={[
              styles.menuContainer,
              styles.expenseMenuPositionStyle,
              {
                top: expenseMenuPosition.top,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (!selectedExpense) return;

                setExpenseMenuVisible(false);

                router.push({
                  pathname: "/group/add-expense",
                  params: {
                    expenseId: selectedExpense.id,
                    groupId: group.id,
                  },
                });
              }}
            >
              <Ionicons
                name="create-outline"
                size={21}
                color="white"
              />

              <Text style={styles.editMenuText}>
                Edit Expense
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (!selectedExpense) return;

                const expenseToDelete = selectedExpense;

                setExpenseMenuVisible(false);

                handleDeleteExpense(expenseToDelete);
              }}
            >
              <Ionicons
                name="trash-outline"
                size={21}
                color="#ff5c5c"
              />

              <Text style={styles.deleteMenuText}>
                Delete Expense
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {expenses.length === 0 ? (
        <View style={styles.emptyContainer}>

          <Ionicons
            name="receipt-outline"
            size={70}
            color="#555"
          />

          <Text style={styles.emptyTitle}>
            No expenses yet
          </Text>

          <Text style={styles.emptyText}>
            Add the first expense to this
            group.
          </Text>

        </View>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.expenseCard}>
              <View style={styles.expenseIcon}>
                <Ionicons
                  name="receipt"
                  size={23}
                  color="white"
                />
              </View>


              <View style={styles.expenseInfo}>
                <Text style={styles.expenseTitle}>
                  {item.title}
                </Text>

                {!!item.description && (
                  <Text style={styles.expenseDescription}>
                    {item.description}
                  </Text>
                )}

                <Text style={styles.paidByText}>
                  Paid by {item.paidByName || "Unknown User"}
                </Text>

                <Text style={styles.dateText}>
                  {formatExpenseDate(item.createdAt)}
                </Text>

                <Text style={styles.splitType}>
                  {item.splitType === "equal"
                    ? "Split equally"
                    : "Split unequally"}
                </Text>
              </View>

              <View style={styles.expenseRight}>

                {/* --------------------------------------Expense Menu Button--------------------------------------------- */}
                <TouchableOpacity
                  style={styles.expenseMenuButton}
                  onPress={(event) => {
                    setSelectedExpense(item);

                    const {
                      pageY,
                    } = event.nativeEvent;

                    setExpenseMenuPosition({
                      top: pageY + 10,
                      right: 15,
                    });

                    setExpenseMenuVisible(true);
                  }}
                >
                  <Ionicons
                    name="ellipsis-vertical"
                    size={20}
                    color="#8B949E"
                  />
                </TouchableOpacity>
                {/* --------------------------------------------------------------------------------------------- */}



                <Text style={styles.amount}>
                  ₹{item.amount}
                </Text>
              </View>
            </View>
          )}
        />
      )}

      {/* Add Expense Button */}

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push({
            pathname: "/group/add-expense",
            params: {
              groupId: group.id,
            },
          })
        }
      >
        <Ionicons
          name="add"
          size={30}
          color="white"
        />
      </TouchableOpacity>


      <Modal
        visible={groupMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setGroupMenuVisible(false)
        }
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() =>
            setGroupMenuVisible(false)
          }
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setGroupMenuVisible(false);
                handleDeleteGroup();
              }}
            >
              <Ionicons
                name="trash-outline"
                size={21}
                color="#ff5c5c"
              />

              <Text style={styles.deleteMenuText}>
                Delete Group
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>



    </View>
  );

}
const styles = StyleSheet.create({
  headerInfo: {
    marginLeft: 18,
    flex: 1,
  },

  menuButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },



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
    alignItems: "center",
    marginBottom: 25,
  },

  groupName: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },

  memberText: {
    color: "#8B949E",
    marginTop: 4,
  },

  summaryCard: {
    backgroundColor: "#161B22",
    padding: 22,
    borderRadius: 18,
    marginBottom: 28,

    flexDirection: "row",
    alignItems: "center"
  },
  summaryItem:{
    flex: 1
  },
  summaryDivider:{
    width: 1,
    height: 55,
    backgroundColor: "#30363D",
    marginHorizontal: 20,
  },

  summaryLabel: {
    color: "#8B949E",
    fontSize: 14,
  },

  summaryAmount: {
    color: "#55efc4",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 8,
  },

  oweAmount:{
    color: "red",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 8,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  sectionTitle: {
    color: "white",
    fontSize: 21,
    fontWeight: "bold",
  },

  expenseCount: {
    color: "#8B949E",
    marginLeft: 10,
  },

  expenseCard: {
    backgroundColor: "#161B22",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  expenseIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#3D5AFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  expenseInfo: {
    flex: 1,
  },

  expenseTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  expenseDescription: {
    color: "#8B949E",
    marginTop: 4,
  },

  splitType: {
    color: "#3DA9FC",
    fontSize: 12,
    marginTop: 5,
  },

  amount: {
    color: "white",
    fontSize: 18,
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
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
  },

  emptyText: {
    color: "#8B949E",
    marginTop: 7,
  },

  errorText: {
    color: "white",
    fontSize: 18,
  },

  fab: {
    position: "absolute",
    right: 25,
    bottom: 30,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#3D5AFE",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "flex-end",
    paddingTop: 85,
    paddingRight: 20,
  },

  menuContainer: {
    width: 180,
    backgroundColor: "#1C2129",
    borderRadius: 12,
    paddingVertical: 5,
    elevation: 10,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 15,
  },

  deleteMenuText: {
    color: "#ff5c5c",
    fontSize: 15,
    fontWeight: "600",
  },
  expenseRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    alignSelf: "stretch",
  },

  paidByText: {
    color: "#AAB1B7",
    fontSize: 12,
    marginTop: 5,
  },

  dateText: {
    color: "#6E7681",
    fontSize: 11,
    marginTop: 3,
  },
  editMenuText: {
    color: "white",
    fontSize: 15,
  },
  expenseMenuButton: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  
  expenseMenuOverlay: {
  flex: 1,
  backgroundColor: "transparent",
},

expenseMenuPositionStyle: {
  position: "absolute",
  right: 15,
},
});
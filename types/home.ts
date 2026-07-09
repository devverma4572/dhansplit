export interface Group {
  id: string;
  name: string;
  createdBy: string;
  members: string[];
  totalExpense: number;
}

export interface ExpenseSplit {
  userId: string;
  amount: number;
}

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  amount: number;
  paidBy: string;
  paidByName?: string;
  splitType: "equal" | "unequal";
  splits: ExpenseSplit[];
  settledUserIds: string[];
  createdAt?: any;
}

export interface UserData {
  uid: string;
  name: string;
  username: string;
  email: string;
  profileImage: string;
}
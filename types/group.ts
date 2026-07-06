export interface Group {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  members: string[];
  totalExpense: number;
  createdAt?: any;
}

export interface AppUser {
  uid: string;
  name: string;
  username: string;
  email: string;
  profileImage?: string;
}

export interface ExpenseSplit {
  userId: string;
  amount: number;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  title: string;
  amount: number;
  paidBy: string;
  paidByName: string;
  splitType: "equal" | "unequal";
  splits: ExpenseSplit[];
  createdAt?: any;
}
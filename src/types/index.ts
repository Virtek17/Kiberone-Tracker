export interface Student {
  id: string;
  name: string;
  birthDate: string;
  balance: number;
  groupId: string;
  isDeleted: boolean;
}

export interface Transaction {
  id: string;
  studentId: string;
  amount: number;
  type: "add" | "subtract";
  description: string;
  timestamp: Date;
}

export interface Group {
  id: string;
  name: string;
  createdAt: Date;
}
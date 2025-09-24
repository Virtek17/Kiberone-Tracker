"use client";

import React, { useState, useEffect } from "react";
import { Group, Student, Transaction } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Button } from "../components/ui/Button";
import { GroupCard } from "../components/GroupCard";
import { StudentCard } from "../components/StudentCard";
import { CreateGroupModal } from "../components/CreateGroupModal";
import { AddStudentModal } from "../components/AddStudentModal";
import { StudentDetailsModal } from "../components/StudentDetailsModal";
import { EditGroupModal } from "../components/EditGroupModal";
import { EditStudentModal } from "../components/EditStudentModal";
import { BulkRewardModal } from "../components/BulkRewardModal";
import { toast } from "react-toastify";

export default function Page() {
  const [groups, setGroups] = useLocalStorage<Group[]>("finance-groups", []);
  const [students, setStudents] = useLocalStorage<Student[]>(
    "finance-students",
    []
  );
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    "finance-transactions",
    []
  );

  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [showEditStudent, setShowEditStudent] = useState(false);
  const [showAddAll, setShowAddAll] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const currentGroup = groups.find((g) => g.id === currentGroupId);
  const currentGroupStudents = students.filter(
    (s) => s.groupId === currentGroupId
  );


  const createGroup = (name: string) => {
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      createdAt: new Date()
    };
    setGroups((prev) => [...prev, newGroup]);
  };

  const addStudent = (name: string, birthDate: string) => {
    if (!currentGroupId) return;

    const newStudent: Student = {
      id: Date.now().toString(),
      name,
      birthDate,
      balance: 0,
      groupId: currentGroupId,
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const addTransaction = (
  studentId: string,
  amount: number,
  description: string) =>
  {
    const newTransaction: Transaction = {
      id: Date.now().toString() + Math.random().toString(36),
      studentId,
      amount,
      type: amount >= 0 ? "add" : "subtract",
      description,
      timestamp: new Date()
    };

    setTransactions((prev) => [...prev, newTransaction]);
    setStudents((prev) =>
    prev.map((student) =>
    student.id === studentId ?
    { ...student, balance: student.balance + amount } :
    student
    )
    );
  };

  const deleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    setTransactions((prev) => prev.filter((t) => t.studentId !== studentId));
  };

  const updateGroup = (groupId: string, name: string) => {
    setGroups((prev) =>
    prev.map((group) => group.id === groupId ? { ...group, name } : group)
    );
  };

  const updateStudent = (
  studentId: string,
  name: string,
  birthDate: string) =>
  {
    setStudents((prev) =>
    prev.map((student) =>
    student.id === studentId ? { ...student, name, birthDate } : student
    )
    );
  };

  const getStudentTransactions = (studentId: string) => {
    return transactions.filter((t) => t.studentId === studentId);
  };

  // Helper function to format date for input type="date"
  const formatDateForInput = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch {
      return dateString;
    }
  };

  // 👇 Добавь эту функцию в тело компонента Page
const handleApplyToAll = (amount: number, description: string) => {
  if (!currentGroupId) return;

  const studentsInGroup = students.filter(s => s.groupId === currentGroupId);

  // Генерируем массив новых транзакций
  const newTransactions: Transaction[] = studentsInGroup.map(student => ({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    studentId: student.id,
    amount,
    type: amount >= 0 ? "add" : "subtract",
    description,
    timestamp: new Date(),
  }));
  

  // Создаем новый массив студентов с обновленными балансами
  const updatedStudents = students.map(student => {
    if (studentsInGroup.some(s => s.id === student.id)) {
      return { ...student, balance: student.balance + amount };
    }
    return student;
  });

  // Применяем изменения одним махом
  setTransactions(prev => [...prev, ...newTransactions]);
  setStudents(updatedStudents);
  toast.success(`Начислено ${amount}К всем ученикам`)
  setShowAddAll(false);
};

  if (currentGroupId && currentGroup) {
    

    return (
      <div className="min-h-screen bg-gray-900 p-4" data-oid="8k330ln">
        <div className="max-w-4xl mx-auto" data-oid="5731kn-">
          <div
            className="flex items-center justify-between mb-6"
            data-oid="n0.33ma"
            key="olk-t3Sk">

            <Button
              onClick={() => setCurrentGroupId(null)}
              variant="secondary"
              data-oid="moh7jhq">

              ← Назад
            </Button>
            <h1 className="text-2xl font-bold text-white" data-oid="nfh55sd">
              {currentGroup.name}
            </h1>
            <div className="flex gap-2">
              <Button onClick={() => setShowAddStudent(true)} data-oid="pn7et30">
                + Ученик
              </Button>

              <Button onClick={() => setShowAddAll(true) } disabled={students.length < 1} >
                Начислить всем
              </Button>
            </div>
            
          </div>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            data-oid="yqf3y._"
            key="olk-CXuA">

            {currentGroupStudents.map((student) =>
            <StudentCard
              key={student.id}
              student={student}
              onClick={() => {
                setSelectedStudent(student);
                setShowStudentDetails(true);
              }}
              data-oid="g8jew3n" />

            )}
          </div>

          {currentGroupStudents.length === 0 &&
          <div className="text-center text-gray-400 py-12" data-oid="__ww:gx">
              <p className="text-lg mb-4" data-oid="gxtk9w3">
                В группе пока нет учеников
              </p>
              <Button
              onClick={() => setShowAddStudent(true)}
              data-oid="94x9_g-">

                Добавить первого ученика
              </Button>
            </div>
          }
        </div>

        <AddStudentModal
          isOpen={showAddStudent}
          onClose={() => setShowAddStudent(false)}
          onAdd={addStudent}
          data-oid="64c_cci" />


        <StudentDetailsModal
          isOpen={showStudentDetails}
          onClose={() => setShowStudentDetails(false)}
          student={selectedStudent}
          transactions={
          selectedStudent ? getStudentTransactions(selectedStudent.id) : []
          }
          onAddTransaction={(amount, description) => {
            if (selectedStudent) {
              addTransaction(selectedStudent.id, amount, description);
              setSelectedStudent((prev) =>
              prev ? { ...prev, balance: prev.balance + amount } : null
              );
            }
          }}
          onDeleteStudent={() => {
            if (selectedStudent) {
              deleteStudent(selectedStudent.id);
            }
          }}
          onEditStudent={() => {
            if (selectedStudent) {
              setEditingStudent(selectedStudent);
              setShowEditStudent(true);
              setShowStudentDetails(false);
            }
          }}
          data-oid="iuj2wa1" />

          <EditStudentModal
            isOpen={showEditStudent}
            onClose={() => setShowEditStudent(false)}
            onUpdate={(name, birthDate) => {
              if (editingStudent) {
                updateStudent(editingStudent.id, name, birthDate);
                setSelectedStudent((prev) =>
                prev ? { ...prev, name, birthDate } : null
                );
              }
            }}
            currentName={editingStudent?.name || ""}
            currentBirthDate={
            editingStudent?.birthDate ?
            formatDateForInput(editingStudent.birthDate) :
            ""
            }
            data-oid="_ujuvvz" />

            <BulkRewardModal
              isOpen={showAddAll}
              onClose={() => setShowAddAll(false)}
              onApplyToAll={handleApplyToAll}
              data-oid="bulk-reward-modal"
            />

      </div>);

  }

  return (
    <div className="min-h-screen bg-gray-900 p-4" data-oid="2x50ljn">
      <div className="max-w-4xl mx-auto" data-oid="97z8c7:">
        <div className="text-center mb-8" data-oid="k8e4t8h">
          <h1 className="text-3xl font-bold text-white mb-2" data-oid="w9bw_u:">
            Учет киберонов
          </h1>
          <p className="text-gray-400" data-oid="p_:x5:0">
            Управляйте киберонами группы
          </p>
        </div>

        <div className="flex justify-center mb-8" data-oid="sadluj5">
          <Button
            onClick={() => setShowCreateGroup(true)}
            size="lg"
            data-oid="lekm_k-">

            + Создать группу
          </Button>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          data-oid="6-qrw-6">

          {groups.map((group) => {
            const studentsCount = students.filter(
              (s) => s.groupId === group.id
            ).length;
            return (
              <GroupCard
                key={group.id}
                group={group}
                studentsCount={studentsCount}
                onClick={() => setCurrentGroupId(group.id)}
                onEdit={(e) => {
                  e.stopPropagation();
                  setEditingGroup(group);
                  setShowEditGroup(true);
                }}
                data-oid="angyy_:" />);


          })}
        </div>

        {groups.length === 0 &&
        <div className="text-center text-gray-400 py-12" data-oid="vngs_1f">
            <p className="text-lg mb-4" data-oid="4mrn9c.">
              У вас пока нет групп
            </p>
            <p className="mb-6" data-oid="iu8mom.">
              Создайте первую группу для начала работы
            </p>
            <Button onClick={() => setShowCreateGroup(true)} data-oid="sl-0kl4">
              Создать первую группу
            </Button>
          </div>
        }
      </div>

      <CreateGroupModal
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onCreate={createGroup}
        data-oid="yf0srr2" />


      <EditGroupModal
        isOpen={showEditGroup}
        onClose={() => setShowEditGroup(false)}
        onUpdate={(name) => {
          if (editingGroup) {
            updateGroup(editingGroup.id, name);
          }
        }}
        currentName={editingGroup?.name || ""}
        data-oid="u7u1363" />


      

    </div>);

}
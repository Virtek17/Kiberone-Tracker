// Реализовать редактирование ученика и удаление, сделать loader
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
import useSound from "use-sound";
import { useGroups } from "@/hooks/useGroups";
import { useStudents } from "@/hooks/useStudents";
import { useTransactions } from "@/hooks/useTransactions";
import { supabase } from "@/lib/supabase";

const NOTIFICATION_SOUND = "/sound/notification.mp3";

export default function Page() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [studentTransactions, setStudentTransactions] = useState<Transaction[]>(
    []
  );
  const [allStudents, setAllStudents] = useState<Student[]>([]);
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
  const { fetchGroups, createGroup, updateGroup, loading, error } = useGroups();
  const {
    fetchStudents,
    createStudent,
    deleteStudent,
    updateStudent,
    loading: studentsLoading,
  } = useStudents();
  const { fetchTransactions, createTransaction, bulkCreateTransactions } =
    useTransactions();

  useEffect(() => {
    const loadAllStudents = async () => {
      // Предполагается, что fetchStudents() без аргументов возвращает всех
      const data = await fetchStudents(); // ← убедитесь, что хук поддерживает это!
      if (data) {
        setAllStudents(data);
      }
    };
    loadAllStudents();
  }, []);

  useEffect(() => {
    const loadGroupsFromSupabase = async () => {
      const data = await fetchGroups();
      if (data) {
        setGroups(data);
      }
    };
    loadGroupsFromSupabase();
  }, []);

  useEffect(() => {
    if (currentGroupId) {
      fetchStudents(currentGroupId).then((data) => {
        if (data) {
          setStudents(data);
        } else {
          setStudents([]);
        }
      });
    } else {
      setStudents([]); // очищаем при выходе из группы
    }
  }, [currentGroupId]);

  useEffect(() => {
    if (selectedStudent) {
      fetchTransactions(selectedStudent.id).then((data) => {
        if (data) setStudentTransactions(data);
      });
    }
  }, [selectedStudent]);

  const currentGroup = groups.find((g) => g.id === currentGroupId);
  const currentGroupStudents = students.filter(
    (s) => s.groupId === currentGroupId
  );

  // Звук для уведомления
  const [playNotification] = useSound(NOTIFICATION_SOUND, {
    volume: 0.4,
  });

  const handleCreateGroup = async (name: string) => {
    const newGroup = await createGroup(name);
    if (newGroup) {
      setGroups((prev) => [...prev, newGroup]);
      toast.success("Группа создана!");
      playNotification();
      setShowCreateGroup(false);
    } else {
      console.log("Ошибка");
    }
  };

  const handleAddStudent = async (name: string, birthDate: string) => {
    if (!currentGroupId) return;

    const newStudent = await createStudent(name, birthDate, currentGroupId);
    if (newStudent) {
      setStudents((prev) => [...prev, newStudent]);
      toast.success("Ученик добавлен!");
      playNotification();
      setShowAddStudent(false);
    }
  };

  const addTransaction = async (
    studentId: string,
    amount: number,
    description: string
  ) => {
    // 1. Сначала создаём транзакцию
    const { data: newTransaction, error: txError } = await supabase
      .from("Transactions")
      .insert({
        student_id: studentId,
        amount,
        description,
      })
      .select()
      .single();

    if (txError) {
      console.error("Ошибка создания транзакции:", txError);
      toast.error("Не удалось создать транзакцию");
      return;
    }

    // 2. Затем обновляем баланс ученика
    const { error: balError } = await supabase
      .from("Students")
      .update({ balance: selectedStudent!.balance + amount })
      .eq("id", studentId);

    if (balError) {
      console.error("Ошибка обновления баланса:", balError);
      toast.error("Транзакция создана, но баланс не обновлён");
      return;
    }

    // 3. Обновляем локальный стейт
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, balance: s.balance + amount } : s
      )
    );

    if (selectedStudent?.id === studentId) {
      setStudentTransactions((prev) => [
        {
          id: newTransaction.id,
          studentId: newTransaction.student_id,
          amount: newTransaction.amount,
          type: newTransaction.amount >= 0 ? "add" : "subtract",
          description: newTransaction.description,
          timestamp: newTransaction.created_at
            ? new Date(newTransaction.created_at)
            : new Date(),
        },
        ...prev,
      ]);
    }

    toast.success("Транзакция добавлена");
  };

  const handleDeleteStudent = async (studentId: string) => {
    const success = await deleteStudent(studentId);
    if (success) {
      // Удаляем из локального стейта
      setStudents((prev) => prev.filter((s) => s.id !== studentId));

      // Если открыт детальный просмотр — закрываем
      if (selectedStudent?.id === studentId) {
        setShowStudentDetails(false);
        setSelectedStudent(null);
      }

      toast.success("Ученик удалён");
    } else {
      toast.error("Не удалось удалить ученика");
    }
  };

  const handleUpdateGroup = async (groupId: string, name: string) => {
    const success = await updateGroup(groupId, name);
    if (success) {
      setGroups((prev) =>
        prev.map((g) => (g.id === groupId ? { ...g, name } : g))
      );
      toast.success("Группа обновлена!");
      setShowEditGroup(false);
    }
  };

  const handleUpdateStudent = async (
    studentId: string,
    name: string,
    birthDate: string
  ) => {
    const success = await updateStudent(studentId, name, birthDate);

    if (success) {
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, name, birthDate } : s))
      );

      toast.success("Ученик обновлен");
      setShowEditStudent(false);
      if (selectedStudent?.id === studentId) {
        setSelectedStudent((prev) =>
          prev ? { ...prev, name, birthDate } : null
        );
      }
    }
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

  const handleApplyToAll = async (amount: number, description: string) => {
    if (!currentGroupId) return;

    const studentsInGroup = students.filter(
      (s) => s.groupId === currentGroupId
    );

    // 1. Создаём все транзакции
    const transactionsData = studentsInGroup.map((student) => ({
      student_id: student.id,
      amount,
      description,
    }));

    const { error: txError } = await supabase
      .from("Transactions")
      .insert(transactionsData);

    if (txError) {
      console.error("Ошибка массового создания транзакций:", txError);
      toast.error("Не удалось создать транзакции");
      return;
    }

    // 2. Обновляем баланс каждого ученика
    const updates = studentsInGroup.map((student) =>
      supabase
        .from("Students")
        .update({ balance: student.balance + amount })
        .eq("id", student.id)
    );

    const results = await Promise.all(updates);
    const hasError = results.some((r) => r.error);
    if (hasError) {
      console.error(
        "Ошибки при обновлении балансов:",
        results.filter((r) => r.error)
      );
      toast.error("Частично не удалось обновить балансы");
    }

    // 3. Обновляем локальный стейт
    setStudents((prev) =>
      prev.map((s) =>
        studentsInGroup.some((st) => st.id === s.id)
          ? { ...s, balance: s.balance + amount }
          : s
      )
    );

    toast.success(`Начислено ${amount}К всем ученикам`);
    playNotification();
    setShowAddAll(false);
  };

  if (currentGroupId && currentGroup) {
    return (
      <div className="min-h-screen bg-gray-900 p-4" data-oid="8k330ln">
        <div className="max-w-4xl mx-auto" data-oid="5731kn-">
          <div
            className="flex flex-col gap-7 mb-10"
            data-oid="n0.33ma"
            key="olk-t3Sk"
          >
            <h1
              className="text-2xl font-bold text-white text-center"
              data-oid="nfh55sd"
            >
              {currentGroup.name}
            </h1>
            <div className="flex justify-between">
              <Button
                onClick={() => setCurrentGroupId(null)}
                variant="secondary"
                data-oid="moh7jhq"
                className="w-max h-max md:row-start-2 md:col-start-1 lg:w-max lg:self-center"
              >
                ←&nbsp;Назад
              </Button>

              <div
                className="flex flex-wrap gap-2 justify-end
               md:row-start-2 md:col-start-4 md:col-span-3
               lg:justify-end lg:self-center"
              >
                <Button
                  onClick={() => setShowAddStudent(true)}
                  data-oid="pn7et30"
                >
                  + Ученик
                </Button>
                <Button
                  onClick={() => setShowAddAll(true)}
                  disabled={students.length < 1}
                >
                  Начислить всем
                </Button>
              </div>
            </div>
          </div>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            data-oid="yqf3y._"
            key="olk-CXuA"
          >
            {currentGroupStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onClick={() => {
                  setSelectedStudent(student);
                  setShowStudentDetails(true);
                }}
                data-oid="g8jew3n"
              />
            ))}
          </div>
        </div>

        <AddStudentModal
          isOpen={showAddStudent}
          onClose={() => setShowAddStudent(false)}
          onAdd={handleAddStudent}
          data-oid="64c_cci"
        />

        <StudentDetailsModal
          isOpen={showStudentDetails}
          onClose={() => setShowStudentDetails(false)}
          student={selectedStudent}
          transactions={studentTransactions}
          onAddTransaction={(amount, description) => {
            if (selectedStudent) {
              addTransaction(selectedStudent.id, amount, description);
            }
          }}
          onDeleteStudent={() => {
            if (selectedStudent) {
              handleDeleteStudent(selectedStudent.id);
            }
          }}
          onEditStudent={() => {
            if (selectedStudent) {
              setEditingStudent(selectedStudent);
              setShowEditStudent(true);
              setShowStudentDetails(false);
            }
          }}
          data-oid="iuj2wa1"
        />

        <EditStudentModal
          isOpen={showEditStudent}
          onClose={() => setShowEditStudent(false)}
          onUpdate={(name, birthDate) => {
            if (editingStudent) {
              handleUpdateStudent(editingStudent.id, name, birthDate);
            }
          }}
          currentName={editingStudent?.name || ""}
          currentBirthDate={
            editingStudent?.birthDate
              ? formatDateForInput(editingStudent.birthDate)
              : ""
          }
          data-oid="_ujuvvz"
        />

        <BulkRewardModal
          isOpen={showAddAll}
          onClose={() => setShowAddAll(false)}
          onApplyToAll={handleApplyToAll}
          data-oid="bulk-reward-modal"
        />
      </div>
    );
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
            data-oid="lekm_k-"
          >
            + Создать группу
          </Button>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          data-oid="6-qrw-6"
        >
          {loading ? (
            <div className="col-span-full text-center py-4">Загрузка...</div>
          ) : (
            groups.map((group) => {
              console.log("Students: ", allStudents);
              const studentsCount = allStudents.filter(
                (s) => s.groupId == group.id
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
                  data-oid="angyy_:"
                />
              );
            })
          )}
        </div>
      </div>

      <CreateGroupModal
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onCreate={handleCreateGroup}
        data-oid="yf0srr2"
      />

      <EditGroupModal
        isOpen={showEditGroup}
        onClose={() => setShowEditGroup(false)}
        onUpdate={(name) => {
          if (editingGroup) {
            handleUpdateGroup(editingGroup.id, name);
          }
        }}
        currentName={editingGroup?.name || ""}
        data-oid="u7u1363"
      />
    </div>
  );
}

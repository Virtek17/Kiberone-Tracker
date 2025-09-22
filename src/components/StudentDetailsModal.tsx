"use client";

import React, { useState } from "react";
import { Student, Transaction } from "../types";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  transactions: Transaction[];
  onAddTransaction: (amount: number, description: string) => void;
  onDeleteStudent: () => void;
  onEditStudent: () => void;
}

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  isOpen,
  onClose,
  student,
  transactions,
  onAddTransaction,
  onDeleteStudent,
  onEditStudent
}) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!student) return null;

  const handleAddMoney = () => {
    const value = parseFloat(amount);
    if (!isNaN(value) && value !== 0) {
      onAddTransaction(value, description || "Пополнение");
      setAmount("");
      setDescription("");
    }
  };

  const handleSubtractMoney = () => {
    const value = parseFloat(amount);
    if (!isNaN(value) && value > 0) {
      onAddTransaction(-value, description || "Списание");
      setAmount("");
      setDescription("");
    }
  };

  const handleDeleteStudent = () => {
    onDeleteStudent();
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleEditStudent = () => {
    onEditStudent();
    console.log("Клик изменить");
  };

  const age = Math.floor(
    (new Date().getTime() - new Date(student.birthDate).getTime()) / (
    1000 * 60 * 60 * 24 * 365)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
      <div
        className="flex items-center justify-between w-full"
        data-oid="-awr83c">

          <span data-oid="j:.7-yr">Ученик: {student.name}</span>
          <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            // console.log("Edit button clicked!");
            handleEditStudent();
          }}
          className="text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded ml-2"
          title="Редактировать ученика"
          data-oid="2.zu:9m">

            <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            data-oid="ujfh:u1">

              <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              data-oid="n00z6s3" />

            </svg>
          </button>
        </div>
      }
      data-oid="qrl5oo7">

      <div className="space-y-6" data-oid="1ae384l">
        {/* Student Info */}
        <div className="bg-gray-700 rounded-lg p-4" data-oid="-.vswrr">
          <div className="space-y-2 mb-2" data-oid="rioacbk">
            <div
              className="flex items-center justify-between"
              data-oid="x5rwq1k">

              <span className="text-gray-300" data-oid="bx_gwxh">
                Возраст: {age} лет
              </span>
            </div>
            <div
              className="flex items-center justify-between"
              data-oid="1-q2dj4">

              <span className="text-gray-300" data-oid="k159bc0">
                Дата рождения:{" "}
                {new Date(student.birthDate).toLocaleDateString("ru-RU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-end" data-oid="vdds4cc">
            <span
              className={`text-2xl font-bold ${student.balance >= 0 ? "text-green-400" : "text-red-400"}`}
              data-oid="2xjkmwv">

              {student.balance} К
            </span>
          </div>
        </div>

        {/* Add/Subtract Money */}
        <div className="space-y-3" data-oid="adyvp51">
          <h3 className="text-lg font-semibold text-white" data-oid="n6r_dot">
            Изменить баланс
          </h3>
          <Input
            label="Сумма"
            type="number"
            value={amount}
            onChange={setAmount}
            placeholder="Введите сумму"
            data-oid="wk47-t." />


          <Input
            label="Описание (необязательно)"
            value={description}
            onChange={setDescription}
            placeholder="Описание операции"
            data-oid="obvas:e" />


          <div className="flex space-x-3" data-oid="0fovvce">
            <Button
              onClick={handleAddMoney}
              disabled={!amount || parseFloat(amount) <= 0}
              data-oid="uiuhgvy">

              + Добавить
            </Button>
            <Button
              onClick={handleSubtractMoney}
              disabled={!amount || parseFloat(amount) <= 0}
              variant="secondary"
              data-oid="y89x59b">

              - Списать
            </Button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="space-y-3" data-oid="8qjg0w9">
          <h3 className="text-lg font-semibold text-white" data-oid="bkrs-ot">
            История операций
          </h3>
          <div
            className="max-h-48 overflow-y-auto space-y-2"
            data-oid="cu26mkk">

            {transactions.length === 0 ?
            <p className="text-gray-400 text-center py-4" data-oid="ooe76:p">
                Операций пока нет
              </p> :

            transactions.
            sort(
              (a, b) =>
              new Date(b.timestamp).getTime() -
              new Date(a.timestamp).getTime()
            ).
            map((transaction) =>
            <div
              key={transaction.id}
              className="bg-gray-700 rounded p-3"
              data-oid="2:6a4ox">

                    <div
                className="flex items-center justify-between"
                data-oid="zk.5ml4">

                      <span className="text-gray-300" data-oid="6tv2nv7">
                        {transaction.description}
                      </span>
                      <span
                  className={`font-semibold ${transaction.amount >= 0 ? "text-green-400" : "text-red-400"}`}
                  data-oid="i8hyi01">

                        {transaction.amount >= 0 ? "+" : ""}
                        {transaction.amount} К
                      </span>
                    </div>
                    <div
                className="text-xs text-gray-500 mt-1"
                data-oid="6frhl3-">

                      {new Date(transaction.timestamp).toLocaleString()}
                    </div>
                  </div>
            )
            }
          </div>
        </div>

        {/* Delete Student */}
        <div className="pt-4 border-t border-gray-700" data-oid="2t-54k:">
          {!showDeleteConfirm ?
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            variant="danger"
            size="sm"
            data-oid="-vzw73m">

              Удалить ученика
            </Button> :

          <div className="space-y-2" data-oid="vf2jzbg">
              <p className="text-yellow-400 text-sm" data-oid="augwnh-">
                Вы уверены? Это действие нельзя отменить.
              </p>
              <div className="flex space-x-2" data-oid="c3ba0:7">
                <Button
                onClick={handleDeleteStudent}
                variant="danger"
                size="sm"
                data-oid="x6wc9lu">

                  Да, удалить
                </Button>
                <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="secondary"
                size="sm"
                data-oid="sdxv1y3">

                  Отмена
                </Button>
              </div>
            </div>
          }
        </div>
      </div>
    </Modal>);

};
"use client";

import React, { useState } from "react";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface BulkRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToAll: (amount: number, description: string) => void; // Функция, которая применит начисление ко всем студентам
}

export const BulkRewardModal: React.FC<BulkRewardModalProps> = ({
  isOpen,
  onClose,
  onApplyToAll
}) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleApply = () => {
    const value = parseFloat(amount);
    if (!isNaN(value) && value !== 0) {
      onApplyToAll(value, description || "Массовое начисление");
      setAmount("");
      setDescription("");
      onClose(); // Закрываем после применения
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Начислить всем студентам"
      data-oid="bulk-reward-modal"
    >
      <div className="space-y-6">
        {/* Форма начисления */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">
            Укажите сумму для начисления всем студентам
          </h3>

          <Input
            label="Сумма"
            type="number"
            value={amount}
            onChange={setAmount}
            placeholder="Например: 100"
            data-oid="bulk-amount-input"
          />

          <Input
            label="Описание (необязательно)"
            value={description}
            onChange={setDescription}
            placeholder="Например: Премия за прошлый сезон"
            data-oid="bulk-description-input"
          />

          <div className="flex space-x-3 pt-2">
            <Button
              onClick={handleApply}
              disabled={!amount || parseFloat(amount) === 0}
              className="flex-1"
              data-oid="bulk-apply-button"
            >
              🎁 Начислить всем
            </Button>
            <Button
              onClick={onClose}
              variant="secondary"
              className="flex-1"
              data-oid="bulk-cancel-button"
            >
              Отмена
            </Button>
          </div>
        </div>

        <div className="text-sm text-gray-400 p-3 bg-gray-800 rounded">
          <p>Сумма будет добавлена к балансу <strong>каждого студента</strong>.</p>
          <p>Операция отразится в истории каждого студента.</p>
        </div>
      </div>
    </Modal>
  );
};
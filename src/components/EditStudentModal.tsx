"use client";

import React, { useState } from "react";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (name: string, birthDate: string) => void;
  currentName: string;
  currentBirthDate: string;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  currentName,
  currentBirthDate
}) => {
  const [name, setName] = useState(currentName);
  const [birthDate, setBirthDate] = useState(currentBirthDate);

  React.useEffect(() => {
    setName(currentName);
    setBirthDate(currentBirthDate);
  }, [currentName, currentBirthDate, isOpen]);

  const handleSubmit = () => {
    if (
    name.trim() &&
    birthDate && (
    name.trim() !== currentName || birthDate !== currentBirthDate))
    {
      onUpdate(name.trim(), birthDate);
      onClose();
    }
  };

  const handleClose = () => {
    setName(currentName);
    setBirthDate(currentBirthDate);
    onClose();
  };

  const hasChanges =
  name.trim() !== currentName || birthDate !== currentBirthDate;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Редактировать ученика"
      data-oid="d0mba:t">

      <div className="space-y-4" data-oid="gzbw-8t">
        <Input
          label="Имя ученика"
          value={name}
          onChange={setName}
          placeholder="Введите имя ученика"
          required
          data-oid="38e42iw" />


        <Input
          label="Дата рождения"
          type="date"
          value={birthDate}
          onChange={setBirthDate}
          required
          data-oid="pjnop2s" />


        <div className="flex space-x-3" data-oid=".3hxqoz">
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || !birthDate || !hasChanges}
            data-oid="zxvxgsy">

            Сохранить
          </Button>
          <Button onClick={handleClose} variant="secondary" data-oid="nw5voql">
            Отмена
          </Button>
        </div>
      </div>
    </Modal>);

};
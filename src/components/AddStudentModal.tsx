"use client";

import React, { useState } from "react";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, birthDate: string) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const handleSubmit = () => {
    if (name.trim() && birthDate) {
      onAdd(name.trim(), birthDate);
      setName("");
      setBirthDate("");
      onClose();
    }
  };

  const handleClose = () => {
    setName("");
    setBirthDate("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Добавить ученика"
      data-oid="16la-fw">

      <div className="space-y-4" data-oid="_sjypmc">
        <Input
          label="Имя ученика"
          value={name}
          onChange={setName}
          placeholder="Введите имя ученика"
          required
          data-oid="af6tn8d" />


        <Input
          label="Дата рождения"
          type="date"
          value={birthDate}
          onChange={setBirthDate}
          required
          data-oid="ylh6g:8" />


        <div className="flex space-x-3" data-oid="k7r3ymu">
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || !birthDate}
            data-oid=".y_syl0">

            Добавить
          </Button>
          <Button onClick={handleClose} variant="secondary" data-oid="54b-0hs">
            Отмена
          </Button>
        </div>
      </div>
    </Modal>);

};
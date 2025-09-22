"use client";

import React, { useState } from "react";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (name: string) => void;
  currentName: string;
}

export const EditGroupModal: React.FC<EditGroupModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  currentName
}) => {
  const [groupName, setGroupName] = useState(currentName);

  React.useEffect(() => {
    setGroupName(currentName);
  }, [currentName, isOpen]);

  const handleSubmit = () => {
    if (groupName.trim() && groupName.trim() !== currentName) {
      onUpdate(groupName.trim());
      onClose();
    }
  };

  const handleClose = () => {
    setGroupName(currentName);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Редактировать название группы"
      data-oid="sfnmy54">

      <div className="space-y-4" data-oid="i7mw13c">
        <Input
          label="Название группы"
          value={groupName}
          onChange={setGroupName}
          placeholder="Введите название группы"
          required
          data-oid="d9hth-q" />


        <div className="flex space-x-3" data-oid="fa6n1uz">
          <Button
            onClick={handleSubmit}
            disabled={!groupName.trim() || groupName.trim() === currentName}
            data-oid=".tsocs_">

            Сохранить
          </Button>
          <Button onClick={handleClose} variant="secondary" data-oid="ka4t9su">
            Отмена
          </Button>
        </div>
      </div>
    </Modal>);

};
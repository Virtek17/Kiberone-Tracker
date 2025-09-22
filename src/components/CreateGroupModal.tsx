"use client";

import React, { useState } from "react";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [groupName, setGroupName] = useState("");

  const handleSubmit = () => {
    if (groupName.trim()) {
      onCreate(groupName.trim());
      setGroupName("");
      onClose();
    }
  };

  const handleClose = () => {
    setGroupName("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Создать новую группу"
      data-oid="m28dizf">

      <div className="space-y-4" data-oid="5nl_b6_">
        <Input
          label="Название группы"
          value={groupName}
          onChange={setGroupName}
          placeholder="Введите название группы"
          required
          data-oid="41fjhfj" />


        <div className="flex space-x-3" data-oid="g1.84za">
          <Button
            onClick={handleSubmit}
            disabled={!groupName.trim()}
            data-oid="-z:j04n">

            Создать
          </Button>
          <Button onClick={handleClose} variant="secondary" data-oid="tl9_d4e">
            Отмена
          </Button>
        </div>
      </div>
    </Modal>);

};
"use client";

import React from "react";
import { Group, Student } from "../types";
import { Card } from "./ui/Card";

interface GroupCardProps {
  group: Group;
  studentsCount: number;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  studentsCount,
  onClick,
  onEdit
}) => {
  return (
    <Card className="hover:scale-105 relative" data-oid="-dz.4yb">
      <div className="flex flex-col" onClick={onClick} data-oid="3hk8hxl">
        <div
          className="flex items-center justify-between mb-2"
          data-oid="z3q:e49">

          <h3 className="text-lg font-semibold text-white" data-oid=":0bntjm">
            {group.name}
          </h3>
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded"
            title="Редактировать группу"
            data-oid="p88koom">

            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              data-oid="fapxzrf">

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                data-oid="bo90-8c" />

            </svg>
          </button>
        </div>
        <div
          className="flex items-center justify-between text-sm text-gray-400"
          data-oid="s5-va70">

          <span data-oid="cakd-9k">{studentsCount} учеников</span>
          <span data-oid="jai2evs">
            Создана {new Date(group.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Card>);

};
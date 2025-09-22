"use client";

import React from "react";
import { Student } from "../types";
import { Card } from "./ui/Card";

interface StudentCardProps {
  student: Student;
  onClick: () => void;
}

const seasons = [
  "Зима", "Зима", "Весна",
  "Весна", "Весна", "Лето",
  "Лето", "Лето", "Осень",
  "Осень", "Осень", "Зима"
];

function getCurrentSeason() {
  const month = new Date().getMonth();
  return seasons[month];
}

function getPrevSeason() {
  const month = new Date().getMonth();
  const prevMonth = month === 0 ? 11 : month - 1; // Обработка перехода с января на декабрь
  return seasons[prevMonth];
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onClick
}) => {
  const age = Math.floor(
    (new Date().getTime() - new Date(student.birthDate).getTime()) / (
      1000 * 60 * 60 * 24 * 365.25) // Учтём високосные года
  );

  const studentSeasonNumber = new Date(student.birthDate).getMonth();
  const studentSeason = seasons[studentSeasonNumber];
  const prevSeason = getPrevSeason();

  const shouldHighlight = studentSeason === prevSeason;

  // Для отладки:
  // console.log("Время года ученика: ", studentSeason);
  // console.log("Текущее время года: ", getCurrentSeason());
  // console.log("Предыдущее время года: ", prevSeason);

  return (
    <Card
      onClick={onClick}
      className={`hover:scale-105 transition-shadow duration-200 ${shouldHighlight ? 'shadow-xl ring-2 ring-yellow-500' : ''}`}
      data-oid="5zqvef9"
    >
      <div className="flex items-center justify-between" data-oid="in_hkcj">
        <div className="flex flex-col" data-oid="6e3cw:2">
          <h3 className="text-lg font-semibold text-white" data-oid="aiiud7-">
            {student.name}
          </h3>
          <span className="text-sm text-gray-400" data-oid="wn:ylke">
            {age} лет
          </span>
          <span className="text-xs text-gray-500">{studentSeason}</span>
        </div>
        <div className="text-right" data-oid="jth3cvi">
          <div
            className={`text-xl font-bold ${student.balance >= 0 ? "text-green-400" : "text-red-400"}`}
            data-oid="6zop9xt">
            {student.balance} К
          </div>
        </div>
      </div>
    </Card>
  );
};
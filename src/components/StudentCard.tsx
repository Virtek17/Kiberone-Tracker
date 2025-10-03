"use client";

import React from "react";
import { Student } from "../types";
import { Card } from "./ui/Card";

interface StudentCardProps {
  student: Student;
  onClick: () => void;
}

const seasons = [
  "Зима",   // 0 — январь
  "Зима",   // 1 — февраль
  "Весна",  // 2 — март
  "Весна",  // 3 — апрель
  "Весна",  // 4 — май
  "Лето",   // 5 — июнь
  "Лето",   // 6 — июль
  "Лето",   // 7 — август
  "Осень",  // 8 — сентябрь
  "Осень",  // 9 — октябрь
  "Осень",  // 10 — ноябрь
  "Зима",   // 11 — декабрь
];

const seasonOrder = ["Зима", "Весна", "Лето", "Осень"];

function getCurrentSeason() {
  const month = new Date().getMonth(); // 0–11
  return seasons[month];
}

function getPrevSeason() {
  const currentSeason = getCurrentSeason();
  const currentIndex = seasonOrder.indexOf(currentSeason);
  if (currentIndex === -1) return "Зима"; // fallback
  const prevIndex = (currentIndex + 3) % 4; // эквивалентно (currentIndex - 1 + 4) % 4
  return seasonOrder[prevIndex];
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onClick,
}) => {
  const age = Math.floor(
    (new Date().getTime() - new Date(student.birthDate).getTime()) /
      (1000 * 60 * 60 * 24 * 365.25)
  );

  const studentMonth = new Date(student.birthDate).getMonth();
  const studentSeason = seasons[studentMonth];
  const prevSeason = getPrevSeason();

  const shouldHighlight = studentSeason === prevSeason;

  // Для отладки:
  // console.log("Сезон студента:", studentSeason);
  // console.log("Текущий сезон:", getCurrentSeason());
  // console.log("Прошлый сезон:", prevSeason);

  return (
    <Card
      onClick={onClick}
      className={`hover:scale-105 transition-all duration-200 ${
        shouldHighlight ? "shadow-xl ring-2 ring-yellow-500" : ""
      }`}
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
            className={`text-xl font-bold ${
              student.balance >= 0 ? "text-green-400" : "text-red-400"
            }`}
            data-oid="6zop9xt"
          >
            {student.balance} К
          </div>
        </div>
      </div>
    </Card>
  );
};

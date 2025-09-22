"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  onClick
}) => {
  const baseClasses =
  "bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg transition-all duration-200";
  const clickableClasses = onClick ?
  "hover:bg-gray-750 hover:border-gray-600 hover:shadow-xl cursor-pointer" :
  "";

  return (
    <div
      className={`${baseClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
      data-oid="3u8x72i">

      {children}
    </div>);

};
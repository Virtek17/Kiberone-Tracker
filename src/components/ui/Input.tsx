"use client";

import React from "react";

interface InputProps {
  label?: string;
  type?: "text" | "number" | "date";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = ""
}) => {
  return (
    <div className={`flex flex-col space-y-1 ${className}`} data-oid="d1irpis">
      {label &&
      <label className="text-sm font-medium text-gray-300" data-oid="-uqxpsn">
          {label}
          {required &&
        <span className="text-red-400 ml-1" data-oid=".56h-18">
              *
            </span>
        }
        </label>
      }
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        data-oid=".efs:sc" />

    </div>);

};
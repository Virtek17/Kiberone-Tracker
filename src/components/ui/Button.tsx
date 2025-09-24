"use client";

import React from "react";
import useSound from "use-sound";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  withSound?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  withSound = true,
}) => {
  const [playClick] = useSound("/sound/btn-click.mp3", {
    volume: 0.5,
  });

  const baseClasses =
    "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";

  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary:
      "bg-gray-700 hover:bg-gray-600 text-gray-200 focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (withSound && !disabled) {
      playClick();
    }
    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      data-oid="-b-ecym"
    >
      {children}
    </button>
  );
};

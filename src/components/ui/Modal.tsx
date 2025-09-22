"use client";

import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      data-oid="rmjrczt">

      <div
        className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
        data-oid="1v_ggoq">

        <div
          className="flex items-center justify-between p-4 border-b border-gray-700"
          data-oid="bzggcqi">

          {typeof title === "string" ?
          <h2 className="text-lg font-semibold text-white" data-oid="c5_05ig">
              {title}
            </h2> :

          <div
            className="text-lg font-semibold text-white flex-1"
            data-oid="boxdg99">

              {title}
            </div>
          }
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
            data-oid="j8grm64">

            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              data-oid="jc_38c9">

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
                data-oid="7ghovcq" />

            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[70vh]" data-oid="u-b24pf">
          {children}
        </div>
      </div>
    </div>);

};
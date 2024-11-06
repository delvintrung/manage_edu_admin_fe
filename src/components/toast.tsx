import { Toast } from "flowbite-react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";
import { useState } from "react";

export const ToastComponent = (type: string, text: string) => {
  switch (type) {
    case "success":
      return (
        <Toast className="fixed top-4 right-4">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">{text}</div>
          <Toast.Toggle />
        </Toast>
      );
    case "error":
      return (
        <Toast className="fixed top-4 right-4">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
            <HiX className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">{text}</div>
          <Toast.Toggle />
        </Toast>
      );
    case "warning":
      return (
        <Toast className="fixed top-4 right-4">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-500 dark:bg-yellow-800 dark:text-yellow-200">
            <HiExclamation className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">{text}</div>
          <Toast.Toggle />
        </Toast>
      );
  }
};

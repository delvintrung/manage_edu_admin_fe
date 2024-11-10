import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import "./toast.css";

import { removeToast } from "../Slice/toast";
import { RootState } from "../store";
import { Toast } from "flowbite-react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";

const ToastComponent = () => {
  const dispatch = useDispatch();
  const toasts = useSelector((state: RootState) => state.toast.toasts);

  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => dispatch(removeToast(toast.id)), 2000)
    );
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [toasts, dispatch]);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast className="toast">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            {toast.toast.type == "success" ? (
              <HiCheck className="h-5 w-5" />
            ) : toast.toast.type == "error" ? (
              <HiX className="h-5 w-5" />
            ) : (
              <HiExclamation className="h-5 w-5" />
            )}
          </div>
          <div className="ml-3 text-sm font-normal">{toast.toast.message}</div>
        </Toast>
      ))}
    </div>
  );
};

export default ToastComponent;

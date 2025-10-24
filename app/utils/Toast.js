"use client";
import React, { useState } from "react";
import { Toast, ToastBody, ToastHeader, Button } from "reactstrap";
import { AiOutlineClose } from "react-icons/ai";
const ToastNotification = (() => {
  let setToast;

  const ToastComponent = (
    type = "success",
    message = "Something went wrong!"
  ) => {
    if (setToast) {
      setToast({ isOpen: true, type, message });

      setTimeout(
        () => setToast((prev) => ({ ...prev, isOpen: false })),
        type === "error" ? 10000 : 5000 // Longer duration for errors
      );
    }
  };

  const ToastContainer = () => {
    const [toast, _setToast] = useState({
      isOpen: false,
      type: "",
      message: "",
    });
    setToast = _setToast;

    const getColor = () => {
      switch (toast.type) {
        case "success":
          return "success";
        case "error":
          return "danger";
        case "info":
          return "info";
        case "warning":
          return "warning";
        default:
          return "secondary";
      }
    };

    return (
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
        <Toast
          isOpen={toast.isOpen}
          fade
          className={`bg-${getColor()} text-white`}
        >
          <ToastHeader className="text-white bg-dark d-flex justify-content-between toast-header">
           <span> {toast?.type?.toUpperCase()}</span>
            {toast.type === "error" && (
              <Button onClick={() => setToast({ isOpen: false })}>
                <AiOutlineClose />
              </Button>
            )}
          </ToastHeader>
          <ToastBody>{toast.message}</ToastBody>
        </Toast>
      </div>
    );
  };

  return { ToastComponent, ToastContainer };
})();

export default ToastNotification;

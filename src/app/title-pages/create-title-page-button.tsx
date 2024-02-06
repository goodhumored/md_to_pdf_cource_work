"use client";

import { AlertColor, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import Snackbar from "../components/common/snackbar";
import handleCreateTitlePage from "./handle-create-title-page";

const initialState = {
  message: "",
  ok: true
};

export default function CreateTitlePageButton({ className }: { className?: string }) {
  const [state, formAction] = useFormState(handleCreateTitlePage, initialState);
  const [snackState, setSnackState] = useState<{
    text: string;
    severity: AlertColor;
    open: boolean;
  }>({
    text: "",
    severity: "success",
    open: false
  });

  useEffect(() => {
    if (state?.message) {
      setSnackState({
        text: state.message,
        open: true,
        severity: state.ok ? "success" : "error"
      });
    }
  }, [state]);
  const [open, setOpen] = useState(false);
  return (
    <div className={`${className}`}>
      <button
        className="block rounded-2xl mx-auto w-52 align-middle text-center bg-soft-brown text-white py-2"
        onClick={() => setOpen(true)}
      >
        + создать
      </button>
      <Modal
        className="flex flex-col items-center justify-around overflow-y-scroll"
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={() => setOpen(false)}
      >
        <div className="bg-white px-8 py-6 rounded-2xl">
          <form action={formAction}>
            <div className="text-3xl">Создать шаблон</div>
            <input
              className="border border-brown-gray-semitransparent mt-8 text-gray-600 text-base bg-white py-2.5 px-4 rounded-2xl w-full"
              type="file"
              name="file"
              required
              placeholder="Файл"
            />
            <button className="w-full bg-soft-brown py-2 rounded-2xl mt-6 text-white">Создать</button>
          </form>
        </div>
      </Modal>
      {snackState.open ? (
        <Snackbar
          onClose={() => {
            setSnackState({ open: false, severity: "info", text: "" });
          }}
          open={snackState.open}
          severity={snackState.severity}
          text={snackState.text}
        />
      ) : (
        <span />
      )}
    </div>
  );
}

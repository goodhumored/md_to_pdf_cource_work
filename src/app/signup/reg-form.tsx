"use client";

import { AlertColor } from "@mui/material";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import handleReg from "../auth/handle-reg";
import Snackbar from "../components/common/snackbar";

const initialState = {
  message: "",
  ok: true
};

export default function RegistrationForm() {
  const [state, formAction] = useFormState(handleReg, initialState);
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
  return (
    <div className="mt-12 pt-7 pb-4 px-8 rounded-3xl border border-brown-gray-semitransparent bg-soft-brown-semitransparent">
      <div className="text-3xl">Регистрация</div>
      <form className="p-4 flex flex-col space-y-4" action={formAction}>
        <input
          className="text-gray-600 text-base bg-white py-2.5 px-4 rounded-2xl w-full"
          name="username"
          required
          placeholder="Имя пользователя"
        />
        <input
          className="text-gray-600 text-base bg-white py-2.5 px-4 rounded-2xl w-full"
          name="password"
          required
          type="password"
          placeholder="Пароль"
        />
        <button className="grow h-14 shadow-none bg-beige rounded-2xl text-light_black">Отправить</button>
      </form>
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

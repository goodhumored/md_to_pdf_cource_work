"use client";

import { AlertColor } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import handleAuth from "../auth/handle-auth";
import Snackbar from "../components/common/snackbar";

const initialState = {
  message: "",
  ok: true
};

export default function AuthForm() {
  const [state, formAction] = useFormState(handleAuth, initialState);
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
    <div className="">
      <form className=" mt-11 w-full max-w-xl flex-col space-y-4" action={formAction}>
        <label className="font-medium" htmlFor="username">Имя пользователя</label>
        <input
          className="mt-4 text-gray-600 text-base bg-slate-50 rounded-md border-1 border-slate-400/20 py-2.5 px-4  w-full"
          id="username"
          name="username"
          required
          placeholder="some_username"
        />
        <label className="font-medium mt-4.5" htmlFor="password">Пароль</label>
        <input
          className="mt-4 text-gray-600 text-base bg-slate-50 rounded-md border-1 border-slate-400/20 py-2.5 px-4  w-full"
          name="password"
          id="password"
          required
          type="password"
          placeholder="••••••••••"
        />
        <div className=" mt-2">
          <input
            className=""
            name="remember"
            id="remember"
            type="checkbox"
          />
          <label className="font-medium ml-2.5 text-black/80" htmlFor="remember">Запомнить меня</label>
        </div>
        <button className="w-full py-2.5 bg-slate-700 text-white rounded-md font-medium mt-2.5">Войти</button>
        <Link className={"text-xs text-right w-full block"} href={"/signup"}>
          Нет аккаунта? <span className="underline font-medium">Зарегестрироваться</span>
        </Link>
      </form>
    </div>
  );
}

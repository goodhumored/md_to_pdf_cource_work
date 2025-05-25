"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import useToast from "../../common/toast/use-toast";
import handleReg from "../../api/auth/handle-reg";

const initialState = {
  message: "",
  ok: true
};

export default function RegistrationForm() {
  const [state, formAction] = useActionState(handleReg, initialState);
  const { showToast } = useToast();

  useEffect(() => {
    if (state?.message) {
      showToast(state.message, !state.ok);
    }
  }, [state]);
  return (
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
      <label className="font-medium mt-4.5" htmlFor="password-repeat">Повторите пароль</label>
      <input
        className="mt-4 text-gray-600 text-base bg-slate-50 rounded-md border-1 border-slate-400/20 py-2.5 px-4  w-full"
        name="password-repeat"
        id="password-repeat"
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
      <button className="w-full py-2.5 bg-slate-700 text-white rounded-md font-medium mt-2.5">Зарегистрироваться</button>
      <Link className={"text-xs text-right w-full block"} href={"/signin"}>
        Уже есть аккаунт? <span className="underline font-medium">Войти</span>
      </Link>
    </form>
  );
}

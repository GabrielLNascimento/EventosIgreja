"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<{ error?: string }, FormData>(
    login,
    {}
  );

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-10">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-lg">
        <h1 className="text-xl font-bold text-white">Acesso administrativo</h1>
        <p className="mt-1 text-sm text-neutral-400">Digite a senha para gerenciar os eventos.</p>

        <form action={formAction} className="mt-6 flex flex-col gap-4">
          {state.error && (
            <p className="rounded-md bg-red-950/60 px-3 py-2 text-sm text-red-300">{state.error}</p>
          )}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-neutral-300">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:opacity-50"
          >
            {isPending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}

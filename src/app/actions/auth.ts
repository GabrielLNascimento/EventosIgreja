"use server";

import { redirect } from "next/navigation";
import { ADMIN_PASSWORD, setSessionCookie, clearSessionCookie, isAdmin } from "@/lib/auth";

export async function login(_prev: { error?: string }, formData: FormData) {
  const password = String(formData.get("password") || "");

  if (!ADMIN_PASSWORD) {
    return { error: "Senha de administrador não configurada no servidor (ADMIN_PASSWORD)." };
  }

  if (password !== ADMIN_PASSWORD) {
    return { error: "Senha incorreta." };
  }

  await setSessionCookie();
  redirect("/admin");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/");
}

export async function checkAdmin() {
  return isAdmin();
}

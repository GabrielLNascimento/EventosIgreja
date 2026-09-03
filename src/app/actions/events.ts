"use server";

import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { createEvent, deleteEvent, editEvent, toggleFixedEvent } from "@/lib/events";
import type { EventoInput } from "@/lib/types";

export type ActionState = { ok?: boolean; error?: string };

export async function createEventAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await isAdmin())) {
    return { error: "Acesso negado." };
  }

  const nome = String(formData.get("nome") || "").trim();
  const horario = String(formData.get("horario") || "").trim();
  const local = String(formData.get("local") || "").trim();
  const fixo = formData.get("fixo") === "on";
  const data = fixo ? null : String(formData.get("data") || "").trim();
  const diaSemana = fixo ? (formData.get("diaSemana") as string) || null : null;
  const foto = (formData.get("foto") as string) || null;

  if (!nome || !horario || !local) {
    return { error: "Preencha nome, horário e local." };
  }

  if (!fixo && !data) {
    return { error: "Preencha a data." };
  }

  if (foto && foto.length > 5_000_000) {
    return { error: "A foto é muito grande. Use uma imagem menor." };
  }

  const input: EventoInput = { nome, horario, local, data, foto, fixo, diaSemana };

  try {
    await createEvent(input);
  } catch {
    return { error: "Não foi possível salvar o evento. Tente uma foto menor." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

export async function editEventAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await isAdmin())) {
    return { error: "Acesso negado." };
  }

  const id = Number(formData.get("id") || "0");
  if (!id) {
    return { error: "ID do evento não informado." };
  }

  const nome = String(formData.get("nome") || "").trim();
  const horario = String(formData.get("horario") || "").trim();
  const local = String(formData.get("local") || "").trim();
  const fixo = formData.get("fixo") === "on";
  const data = fixo ? null : String(formData.get("data") || "").trim();
  const diaSemana = fixo ? (formData.get("diaSemana") as string) || null : null;
  const foto = (formData.get("foto") as string) || null;

  if (!nome || !horario || !local) {
    return { error: "Preencha nome, horário e local." };
  }

  if (!fixo && !data) {
    return { error: "Preencha a data." };
  }

  if (foto && foto.length > 5_000_000) {
    return { error: "A foto é muito grande. Use uma imagem menor." };
  }

  const input: EventoInput = { nome, horario, local, data, foto, fixo, diaSemana };

  try {
    await editEvent(id, input);
  } catch {
    return { error: "Não foi possível salvar o evento. Tente uma foto menor." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/admin/edit/${id}`);
  return { ok: true };
}

export async function toggleFixedEventAction(id: number) {
  if (!(await isAdmin())) {
    return;
  }
  await toggleFixedEvent(id);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteEventAction(id: number) {
  if (!(await isAdmin())) {
    return;
  }
  await deleteEvent(id);
  revalidatePath("/");
  revalidatePath("/admin");
}
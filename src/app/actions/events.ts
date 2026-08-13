"use server";

import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { createEvent, deleteEvent } from "@/lib/events";
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
  const data = String(formData.get("data") || "").trim();
  const foto = (formData.get("foto") as string) || null;

  if (!nome || !horario || !local || !data) {
    return { error: "Preencha nome, horário, local e data." };
  }

  if (foto && foto.length > 5_000_000) {
    return { error: "A foto é muito grande. Use uma imagem menor." };
  }

  const input: EventoInput = { nome, horario, local, data, foto };

  try {
    await createEvent(input);
  } catch {
    return { error: "Não foi possível salvar o evento. Tente uma foto menor." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteEventAction(id: number) {
  if (!(await isAdmin())) {
    return;
  }
  await deleteEvent(id);
  revalidatePath("/");
  revalidatePath("/admin");
}

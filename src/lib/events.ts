import { sql, requireDb } from "./db";
import type { Evento, EventoInput } from "./types";

const FUSO_IGREJA = "America/Sao_Paulo";

function hojeNoFuso(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSO_IGREJA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function getUpcomingEvents(): Promise<Evento[]> {
  requireDb();
  const hoje = hojeNoFuso();
  const rows = (await sql`
    SELECT id, nome, horario, local, data, foto, criado_em
    FROM events
    WHERE data >= ${hoje}::date
    ORDER BY data ASC, horario ASC
  `) as Evento[];
  return rows;
}

export async function getAllEvents(): Promise<Evento[]> {
  requireDb();
  const rows = (await sql`
    SELECT id, nome, horario, local, data, foto, criado_em
    FROM events
    ORDER BY data DESC, horario ASC
  `) as Evento[];
  return rows;
}

export async function createEvent(input: EventoInput): Promise<Evento> {
  requireDb();
  const rows = (await sql`
    INSERT INTO events (nome, horario, local, data, foto)
    VALUES (${input.nome}, ${input.horario}, ${input.local}, ${input.data}, ${input.foto ?? null})
    RETURNING id, nome, horario, local, data, foto, criado_em
  `) as Evento[];
  return rows[0];
}

export async function deleteEvent(id: number): Promise<void> {
  requireDb();
  await sql`DELETE FROM events WHERE id = ${id}`;
}

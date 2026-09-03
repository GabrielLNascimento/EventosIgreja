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
    SELECT id, nome, horario, local, data, dia_semana as "diaSemana", foto, fixo, criado_em
    FROM events
    WHERE fixo = true OR data >= ${hoje}::date
    ORDER BY fixo DESC, data ASC NULLS LAST, horario ASC
  `) as Evento[];
  return rows;
}

export async function getAllEvents(): Promise<Evento[]> {
  requireDb();
  const rows = (await sql`
    SELECT id, nome, horario, local, data, dia_semana as "diaSemana", foto, fixo, criado_em
    FROM events
    ORDER BY fixo DESC, data ASC NULLS LAST, horario ASC
  `) as Evento[];
  return rows;
}

export async function getFixedEvents(): Promise<Evento[]> {
  requireDb();
  const rows = (await sql`
    SELECT id, nome, horario, local, data, dia_semana as "diaSemana", foto, fixo, criado_em
    FROM events
    WHERE fixo = true
    ORDER BY horario ASC
  `) as Evento[];
  return rows;
}

export async function createEvent(input: EventoInput): Promise<Evento> {
  requireDb();
  const rows = (await sql`
    INSERT INTO events (nome, horario, local, data, foto, fixo, dia_semana)
    VALUES (${input.nome}, ${input.horario}, ${input.local}, ${input.data ?? null}, ${input.foto ?? null}, ${input.fixo ?? false}, ${input.diaSemana ?? null})
    RETURNING id, nome, horario, local, data, dia_semana as "diaSemana", foto, fixo, criado_em
  `) as Evento[];
  return rows[0];
}

export async function getEventById(id: number): Promise<Evento | null> {
  requireDb();
  if (!id) return null;
  const rows = (await sql`
    SELECT id, nome, horario, local, data, dia_semana as "diaSemana", foto, fixo, criado_em
    FROM events
    WHERE id = ${id}
  `) as Evento[];
  return rows[0] ?? null;
}

export async function editEvent(id: number, input: EventoInput): Promise<void> {
  requireDb();
  await sql`
    UPDATE events
    SET nome = ${input.nome}, horario = ${input.horario}, local = ${input.local},
        data = ${input.data ?? null}, foto = ${input.foto ?? null}, fixo = ${input.fixo ?? false},
        dia_semana = ${input.diaSemana ?? null}
    WHERE id = ${id}
  `;
}

export async function toggleFixedEvent(id: number): Promise<void> {
  requireDb();
  await sql`UPDATE events SET fixo = NOT fixo WHERE id = ${id}`;
}

export async function deleteEvent(id: number): Promise<void> {
  requireDb();
  await sql`DELETE FROM events WHERE id = ${id}`;
}
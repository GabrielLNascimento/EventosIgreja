import { getUpcomingEvents, getFixedEvents } from "@/lib/events";
import { isAdmin } from "@/lib/auth";
import EventCard from "@/components/EventCard";
import FixedEventsSection from "@/components/FixedEventsSection";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  let eventos: Awaited<ReturnType<typeof getUpcomingEvents>> = [];
  let eventosFixos: Awaited<ReturnType<typeof getFixedEvents>> = [];
  let erroDb = false;
  try {
    eventos = await getUpcomingEvents();
    eventosFixos = await getFixedEvents();
  } catch {
    erroDb = true;
  }
  const admin = await isAdmin();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Programação Igreja Aba Pomerode
          </h1>
          <p className="text-sm text-neutral-400">Confira o que está rolando</p>
        </div>
        <Link
          href={admin ? "/admin" : "/login"}
          className="self-start rounded-md border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-200 transition hover:bg-neutral-800"
        >
          {admin ? "Painel administrativo" : "Acesso administrativo"}
        </Link>
      </header>

      <FixedEventsSection eventos={eventosFixos} />

      {erroDb ? (
        <p className="rounded-lg border border-dashed border-neutral-800 bg-neutral-900 p-10 text-center text-neutral-400">
          Banco de dados não configurado. Defina DATABASE_URL no .env.local e
          rode <code className="text-amber-400">npm run db:setup</code>.
        </p>
      ) : eventos.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-800 bg-neutral-900 p-10 text-center text-neutral-400">
          Nenhum evento agendado no momento.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {eventos
            .filter((evento) => !evento.fixo)
            .map((evento) => (
              <EventCard key={evento.id} evento={evento} />
            ))}
        </div>
      )}
    </main>
  );
}

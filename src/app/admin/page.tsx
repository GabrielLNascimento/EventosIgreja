import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAllEvents } from "@/lib/events";
import { logout } from "@/app/actions/auth";
import EventCard from "@/components/EventCard";
import EventForm from "@/components/EventForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    redirect("/login");
  }

  const eventos = await getAllEvents();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Painel administrativo</h1>
          <p className="text-sm text-neutral-400">Crie e gerencie os eventos da igreja</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-md border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-200 transition hover:bg-neutral-800"
          >
            Ver site
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-200 transition hover:bg-neutral-700"
            >
              Sair
            </button>
          </form>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <EventForm />

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-white">
            Eventos cadastrados ({eventos.length})
          </h2>
          {eventos.length === 0 ? (
            <p className="text-sm text-neutral-500">Nenhum evento cadastrado ainda.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {eventos.map((evento) => (
                <EventCard key={evento.id} evento={evento} admin />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

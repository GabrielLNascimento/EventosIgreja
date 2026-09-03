import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getEventById } from "@/lib/events";
import EventForm from "@/components/EventForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    redirect("/login");
  }

  const { id } = await params;
  const numericId = Number(id);
  if (!numericId) {
    redirect("/admin");
  }

  const evento = await getEventById(numericId);

  if (!evento) {
    return (
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <div className="rounded-lg border border-dashed border-neutral-800 bg-neutral-900 p-10 text-center text-neutral-400">
          <p className="text-lg font-semibold">Evento não encontrado.</p>
          <Link href="/admin" className="mt-4 inline-block text-amber-400 underline">
            Voltar ao painel
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Editar evento</h1>
          <p className="text-sm text-neutral-400">{evento.nome}</p>
        </div>
        <Link
          href="/admin"
          className="self-start rounded-md border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-200 transition hover:bg-neutral-800"
        >
          Voltar ao painel
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <EventForm evento={evento} />

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-white">Dados do evento</h2>
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
            <p className="text-sm text-neutral-400">
              <span className="font-medium text-neutral-300">Nome:</span>{" "}
              {evento.nome}
            </p>
            <p className="text-sm text-neutral-400">
              <span className="font-medium text-neutral-300">Horário:</span>{" "}
              {evento.horario}
            </p>
            <p className="text-sm text-neutral-400">
              <span className="font-medium text-neutral-300">Local:</span>{" "}
              {evento.local}
            </p>
            {evento.fixo ? (
              <p className="text-sm text-neutral-400">
                <span className="font-medium text-neutral-300">Dia:</span>{" "}
                {evento.diaSemana}
              </p>
            ) : evento.data ? (
              <p className="text-sm text-neutral-400">
                <span className="font-medium text-neutral-300">Data:</span>{" "}
                {new Date(evento.data).toLocaleDateString("pt-BR")}
              </p>
            ) : null}
            {evento.fixo && (
              <span className="inline-block rounded-md bg-amber-500/20 px-2 py-1 text-xs font-medium text-amber-400">
                Fixo
              </span>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
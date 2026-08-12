import type { Evento } from "@/lib/types";
import { deleteEventAction } from "@/app/actions/events";

function formatarData(data: string | Date): { dia: string; mes: string; ano: string } {
  const d =
    data instanceof Date
      ? data
      : (() => {
          const [ano, mes, dia] = data.split("-").map(Number);
          return new Date(ano, mes - 1, dia);
        })();
  return {
    dia: d.toLocaleDateString("pt-BR", { day: "2-digit" }),
    mes: d.toLocaleDateString("pt-BR", { month: "short" }).toUpperCase(),
    ano: String(d.getFullYear()),
  };
}

export default function EventCard({ evento, admin = false }: { evento: Evento; admin?: boolean }) {
  const data = formatarData(evento.data);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-neutral-700 hover:shadow-2xl">
      <div className="relative h-52 w-full overflow-hidden bg-neutral-800">
        {evento.foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={evento.foto}
            alt={evento.nome}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 text-neutral-600">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        <div className="absolute left-4 top-4 flex flex-col items-center rounded-xl bg-black/70 px-3 py-2 backdrop-blur">
          <span className="text-xl font-bold leading-none text-amber-400">{data.dia}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-300">{data.mes}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold text-white">{evento.nome}</h3>
        <div className="flex flex-col gap-1.5 text-sm text-neutral-400">
          <p className="flex items-center gap-2">
            <span className="text-amber-400">🕒</span>
            <span>{evento.horario}</span>
            <span className="text-neutral-600">•</span>
            <span>{data.ano}</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-amber-400">📍</span>
            <span>{evento.local}</span>
          </p>
        </div>
        {admin && (
          <form action={deleteEventAction.bind(null, evento.id)} className="mt-auto pt-2">
            <button
              type="submit"
              className="w-full rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950/70"
            >
              Excluir evento
            </button>
          </form>
        )}
      </div>
    </article>
  );
}

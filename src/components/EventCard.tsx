import type { Evento } from "@/lib/types";
import {
  deleteEventAction,
} from "@/app/actions/events";
import Link from "next/link";

const DIAS_SEMANA_PT: Record<string, string> = {
  Domingo: "Domingo",
  "Segunda-feira": "Segunda-feira",
  "Terça-feira": "Terça-feira",
  "Quarta-feira": "Quarta-feira",
  "Quinta-feira": "Quinta-feira",
  "Sexta-feira": "Sexta-feira",
  Sábado: "Sábado",
};

function formatarData(data: string | Date): {
  dia: string;
  mes: string;
  ano: string;
} {
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

export default function EventCard({
  evento,
  admin = false,
}: {
  evento: Evento;
  admin?: boolean;
}) {
  const ehFixo = evento.fixo;
  const dataFormatada = evento.data ? formatarData(evento.data) : null;

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
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
        <div className="absolute left-4 top-4 flex flex-col items-center rounded-xl bg-black/70 px-3 py-2 backdrop-blur">
          <span
            className={`font-bold leading-none text-amber-400 ${
              ehFixo ? "text-sm" : "text-xl"
            }`}
          >
            {ehFixo && evento.diaSemana
              ? DIAS_SEMANA_PT[evento.diaSemana]
              : dataFormatada?.dia}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-300">
            {!ehFixo && dataFormatada?.mes}
          </span>
        </div>
        {evento.fixo && (
          <div className="absolute right-4 top-4 rounded-xl bg-amber-500/80 px-3 py-1 backdrop-blur">
            <span className="text-xs font-bold text-black">Fixo</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold text-white">{evento.nome}</h3>
        <div className="flex flex-col gap-1.5 text-sm text-neutral-400">
          <p className="flex items-center gap-2">
            <span className="text-amber-400">🕒</span>
            <span>{evento.horario}</span>
            {ehFixo && evento.diaSemana && (
              <>
                <span className="text-neutral-600">•</span>
                <span>{evento.diaSemana}</span>
              </>
            )}
            {!ehFixo && dataFormatada && (
              <>
                <span className="text-neutral-600">•</span>
                <span>{dataFormatada.ano}</span>
              </>
            )}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-amber-400">📍</span>
            <span>{evento.local}</span>
          </p>
        </div>
        {admin && (
          <>
            <Link
              href={`/admin/edit/${evento.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-900/60 bg-emerald-950/40 px-3 py-2 text-sm font-medium text-emerald-400 transition hover:bg-emerald-950/70"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Editar
            </Link>
            <form
              action={deleteEventAction.bind(null, evento.id)}
              className="mt-2 pt-2"
            >
              <button
                type="submit"
                className="w-full rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950/70"
              >
                Excluir evento
              </button>
            </form>
            {/* <form
              action={toggleFixedEventAction.bind(null, evento.id)}
              className="mt-2"
            >
              <button
                type="submit"
                className="w-full rounded-lg border border-amber-900/60 bg-amber-950/40 px-3 py-2 text-sm font-medium text-amber-400 transition hover:bg-amber-950/70"
              >
                {evento.fixo ? "Desmarcar como fixo" : "Marcar como fixo"}
              </button>
            </form> */}
          </>
        )}
      </div>
    </article>
  );
}

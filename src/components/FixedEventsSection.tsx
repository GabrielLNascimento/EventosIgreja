"use client";

import { useState } from "react";
import type { Evento } from "@/lib/types";
import EventCard from "@/components/EventCard";

export default function FixedEventsSection({ eventos }: { eventos: Evento[] }) {
  const [aberto, setAberto] = useState(false);

  if (eventos.length === 0) return null;

  return (
    <section className="mt-10 overflow-hidden rounded-2xl bg-amber-500/10">
      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        className="flex w-full items-center gap-3 px-6 py-4 text-left transition hover:bg-amber-500/15"
      >
        <span className="text-2xl">📌</span>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-amber-400">Eventos Fixos</h2>
          <p className="text-sm text-neutral-400">
            {eventos.length} evento{eventos.length !== 1 ? "s" : ""} que acontecem regularmente
          </p>
        </div>
        <span
          className={`text-neutral-400 transition-transform duration-300 ${aberto ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {aberto && (
        <div className="border-t border-amber-500/20 px-6 pb-6 pt-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {eventos.map((evento) => (
              <EventCard key={evento.id} evento={evento} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
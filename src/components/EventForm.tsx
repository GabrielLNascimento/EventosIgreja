"use client";

import { useActionState, useRef, useState, useEffect } from "react";
import { createEventAction, editEventAction, type ActionState } from "@/app/actions/events";
import type { Evento } from "@/lib/types";

function resizeImage(file: File, maxSize = 1000, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Arquivo não é uma imagem válida"));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas indisponível"));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const DIAS_SEMANA = [
  { value: "", label: "Selecione o dia" },
  { value: "Domingo", label: "Domingo" },
  { value: "Segunda-feira", label: "Segunda-feira" },
  { value: "Terça-feira", label: "Terça-feira" },
  { value: "Quarta-feira", label: "Quarta-feira" },
  { value: "Quinta-feira", label: "Quinta-feira" },
  { value: "Sexta-feira", label: "Sexta-feira" },
  { value: "Sábado", label: "Sábado" },
];

export default function EventForm({ evento }: { evento?: Evento | null }) {
  const isEditing = !!evento;
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    isEditing ? editEventAction : createEventAction,
    {}
  );
  const fotoRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [erroFoto, setErroFoto] = useState<string | null>(null);
  const [ehFixo, setEhFixo] = useState(evento?.fixo ?? false);
  const [nome, setNome] = useState(evento?.nome ?? "");
  const [horario, setHorario] = useState(evento?.horario ?? "");
  const [local, setLocal] = useState(evento?.local ?? "");
  const [data, setData] = useState(evento?.data ? new Date(evento.data).toISOString().slice(0, 10) : "");
  const [diaSemana, setDiaSemana] = useState(evento?.diaSemana ?? "");
  const [fotoExistente, setFotoExistente] = useState(evento?.foto ?? null);

  useEffect(() => {
    if (evento) {
      setNome(evento.nome);
      setHorario(evento.horario);
      setLocal(evento.local);
      setData(evento.data ? new Date(evento.data).toISOString().slice(0, 10) : "");
      setDiaSemana(evento.diaSemana ?? "");
      setEhFixo(evento.fixo);
      setFotoExistente(evento.foto);
      setPreview(evento.foto);
      if (fotoRef.current) fotoRef.current.value = evento.foto ?? "";
    }
  }, [evento]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setErroFoto(null);
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(fotoExistente);
      if (fotoRef.current) fotoRef.current.value = fotoExistente ?? "";
      return;
    }
    try {
      const dataUrl = await resizeImage(file);
      setPreview(dataUrl);
      if (fotoRef.current) fotoRef.current.value = dataUrl;
    } catch (err) {
      setErroFoto(err instanceof Error ? err.message : "Erro ao processar imagem");
      setPreview(fotoExistente);
      if (fotoRef.current) fotoRef.current.value = fotoExistente ?? "";
    }
  }

  function handleReset() {
    setPreview(null);
    setErroFoto(null);
    setEhFixo(false);
    setNome("");
    setHorario("");
    setLocal("");
    setData("");
    setDiaSemana("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (fotoRef.current) fotoRef.current.value = "";
    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={() => {
        if (state.ok) handleReset();
      }}
      className="flex flex-col gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-lg"
    >
      <h2 className="text-lg font-semibold text-white">
        {isEditing ? "Editar evento" : "Novo evento"}
      </h2>

      {isEditing && (
        <input type="hidden" name="id" value={evento!.id} />
      )}

      {state.error && (
        <p className="rounded-md bg-red-950/60 px-3 py-2 text-sm text-red-300">{state.error}</p>
      )}
      {state.ok && (
        <p className="rounded-md bg-green-950/60 px-3 py-2 text-sm text-green-300">
          {isEditing ? "Evento atualizado com sucesso!" : "Evento criado com sucesso!"}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="nome" className="text-sm font-medium text-neutral-300">Nome</label>
        <input id="nome" name="nome" value={nome} onChange={(e) => setNome(e.target.value)} required className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-500" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ehFixo ? (
          <div className="flex flex-col gap-1">
            <label htmlFor="diaSemana" className="text-sm font-medium text-neutral-300">Dia da semana</label>
            <select id="diaSemana" name="diaSemana" value={diaSemana} onChange={(e) => setDiaSemana(e.target.value)} required className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-500 [color-scheme:dark]">
              {DIAS_SEMANA.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <label htmlFor="data" className="text-sm font-medium text-neutral-300">Data</label>
            <input id="data" name="data" type="date" value={data} onChange={(e) => setData(e.target.value)} required className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-500 [color-scheme:dark]" />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label htmlFor="horario" className="text-sm font-medium text-neutral-300">Horário</label>
          <input id="horario" name="horario" type="time" value={horario} onChange={(e) => setHorario(e.target.value)} required className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-500 [color-scheme:dark]" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="local" className="text-sm font-medium text-neutral-300">Local</label>
        <input id="local" name="local" value={local} onChange={(e) => setLocal(e.target.value)} required className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-500" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="foto" className="text-sm font-medium text-neutral-300">Foto (opcional)</label>
        <input
          id="foto"
          name="foto-file"
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="text-sm text-neutral-400 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-800 file:px-3 file:py-1.5 file:text-sm file:text-neutral-200 hover:file:bg-neutral-700"
        />
        <input type="hidden" name="foto" ref={fotoRef} />
        {erroFoto && <p className="text-xs text-red-400">{erroFoto}</p>}
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Pré-visualização" className="mt-2 h-40 w-40 rounded-md object-cover ring-1 ring-neutral-700" />
        )}
      </div>

      <div className="flex items-center gap-2">
        <input id="fixo" name="fixo" type="checkbox" checked={ehFixo} onChange={(e) => setEhFixo(e.target.checked)} className="h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-amber-500 focus:ring-amber-500" />
        <label htmlFor="fixo" className="text-sm font-medium text-amber-400">Evento fixo</label>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:opacity-50"
        >
          {isPending ? (isEditing ? "Salvando..." : "Salvando...") : (isEditing ? "Salvar alterações" : "Salvar evento")}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800"
        >
          Limpar
        </button>
      </div>
    </form>
  );
}
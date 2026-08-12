"use client";

import { useActionState, useRef, useState } from "react";
import { createEventAction, type ActionState } from "@/app/actions/events";

function resizeImage(file: File, maxSize = 1000, quality = 0.75): Promise<string> {
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

export default function EventForm() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    createEventAction,
    {}
  );
  const fotoRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [erroFoto, setErroFoto] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setErroFoto(null);
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      if (fotoRef.current) fotoRef.current.value = "";
      return;
    }
    try {
      const dataUrl = await resizeImage(file);
      setPreview(dataUrl);
      if (fotoRef.current) fotoRef.current.value = dataUrl;
    } catch (err) {
      setErroFoto(err instanceof Error ? err.message : "Erro ao processar imagem");
      setPreview(null);
      if (fotoRef.current) fotoRef.current.value = "";
    }
  }

  function handleReset() {
    setPreview(null);
    setErroFoto(null);
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
      <h2 className="text-lg font-semibold text-white">Novo evento</h2>

      {state.error && (
        <p className="rounded-md bg-red-950/60 px-3 py-2 text-sm text-red-300">{state.error}</p>
      )}
      {state.ok && (
        <p className="rounded-md bg-green-950/60 px-3 py-2 text-sm text-green-300">
          Evento criado com sucesso!
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="nome" className="text-sm font-medium text-neutral-300">Nome</label>
        <input id="nome" name="nome" required className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-500" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="data" className="text-sm font-medium text-neutral-300">Data</label>
          <input id="data" name="data" type="date" required className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-500 [color-scheme:dark]" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="horario" className="text-sm font-medium text-neutral-300">Horário</label>
          <input id="horario" name="horario" type="time" required className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-500 [color-scheme:dark]" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="local" className="text-sm font-medium text-neutral-300">Local</label>
        <input id="local" name="local" required className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-500" />
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

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:opacity-50"
        >
          {isPending ? "Salvando..." : "Salvar evento"}
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

export type Evento = {
  id: number;
  nome: string;
  horario: string;
  local: string;
  data: string | null;
  foto: string | null;
  fixo: boolean;
  diaSemana: string | null;
  criado_em: string;
};

export type EventoInput = {
  nome: string;
  horario: string;
  local: string;
  data?: string | null;
  foto?: string | null;
  fixo?: boolean;
  diaSemana?: string | null;
};
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL ?? "";

export const sql = neon(connectionString);

export function requireDb() {
  if (!connectionString) {
    throw new Error(
      "Variável de ambiente DATABASE_URL não definida. Configure o arquivo .env.local com a string de conexão do Neon."
    );
  }
}

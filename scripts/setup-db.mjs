import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Defina DATABASE_URL no arquivo .env.local antes de rodar o setup.");
  process.exit(1);
}

const sql = neon(connectionString);

await sql`
  CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    horario TEXT NOT NULL,
    local TEXT NOT NULL,
    data DATE NOT NULL,
    foto TEXT,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
  )
`;

console.log("Tabela 'events' criada (ou já existente) com sucesso.");

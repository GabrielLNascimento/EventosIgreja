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
    data DATE,
    foto TEXT,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
  )
`;

await sql`
  DO $$ BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'events' AND column_name = 'dia_semana'
    ) THEN
      ALTER TABLE events ADD COLUMN dia_semana TEXT;
    END IF;
  END $$
`;

await sql`
  DO $$ BEGIN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'events' AND column_name = 'data' AND is_nullable = 'NO'
    ) THEN
      ALTER TABLE events ALTER COLUMN data DROP NOT NULL;
    END IF;
  END $$
`;

await sql`
  DO $$ BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'events' AND column_name = 'fixo'
    ) THEN
      ALTER TABLE events ADD COLUMN fixo BOOLEAN DEFAULT false;
    END IF;
  END $$
`;

console.log("Tabela 'events' criada (ou já existente) com sucesso.");
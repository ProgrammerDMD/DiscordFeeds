import { config } from "dotenv";
import { defineConfig } from 'drizzle-kit';
config({ path: "./.env.development" });

export default defineConfig({
  schema: './app/components/backend/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: "",
    user: "",
    password: "",
    database: "website",
    ssl: false
  }
});
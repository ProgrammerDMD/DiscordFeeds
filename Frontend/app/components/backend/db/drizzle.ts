import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
config({ path: ".env" });

const client = new Pool({
    host: process.env.POSTGRESQL_HOST!,
    port: 5432,
    user: process.env.POSTGRESQL_USER!,
    password: process.env.POSTGRESQL_PASSWORD!,
    database: process.env.POSTGRESQL_DATABASE!
});

export const db = drizzle(client);
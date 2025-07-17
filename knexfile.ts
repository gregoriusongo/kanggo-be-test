import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

// Update with your config settings.
console.log(process.env);
const config: { [key: string]: Knex.Config } = {
   development: {
      client: "postgresql",
      connection: {
         host: process.env.DB_HOST || "localhost",
         port: parseInt(process.env.DB_PORT || "5432"),
         database: process.env.DB_NAME || "my_db",
         user: process.env.DB_USER || "username",
         password: process.env.DB_PASSWORD || "password",
      },
      migrations: {
         tableName: "knex_migrations",
         directory: "./src/database/migrations",
      },
      seeds: {
         directory: "./src/database/seeds",
      },
   },
};

export default config;
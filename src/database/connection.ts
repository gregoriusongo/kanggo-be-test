import knex from "knex";
import { env } from "@/common/utils/envConfig";

const db = knex({
	client: "pg",
	connection: {
		host: env.DB_HOST,
		port: env.DB_PORT,
		user: env.DB_USER,
		password: env.DB_PASSWORD,
		database: env.DB_NAME,
	},
});

export default db;

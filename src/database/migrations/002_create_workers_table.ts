import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable("workers", (table) => {
		table.increments("id").primary();
		table.string("worker_name").notNullable();
		table.integer("price").notNullable();
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("workers");
}

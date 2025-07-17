import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable("order_workers", (table) => {
		table.increments("id").primary();
		table.integer("order_id").notNullable().references("id").inTable("orders").onDelete("CASCADE");
		table.integer("worker_id").notNullable().references("id").inTable("workers").onDelete("CASCADE");
		table.timestamps(true, true);

		table.unique(["order_id", "worker_id"]);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("order_workers");
}

import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable("orders", (table) => {
		table.increments("id").primary();
		table.integer("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
		table.date("start_date").notNullable();
		table.date("end_date").notNullable();
		table.integer("total_day").notNullable();
		table.enum("status", ["paid", "active", "completed", "cancel"]).notNullable().defaultTo("paid");
		table.bigint("total_price").notNullable();
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("orders");
}

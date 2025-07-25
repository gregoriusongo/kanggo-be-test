import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable("users", (table) => {
		table.increments("id").primary();
		table.string("fullname").notNullable();
		table.string("cellphone").notNullable().unique();
		table.string("email").notNullable().unique();
		table.string("role",).notNullable();
		table.string("password").notNullable();
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("users");
}

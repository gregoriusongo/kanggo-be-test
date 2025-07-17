import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
	// Deletes ALL existing entries
	await knex("workers").del();

	// Inserts seed entries
	await knex("workers").insert([
		{ worker_name: "Tukang Pipa", price: 200000 },
		{ worker_name: "Tukang Cat", price: 250000 },
		{ worker_name: "Tukang Besi", price: 300000 },
	]);
}

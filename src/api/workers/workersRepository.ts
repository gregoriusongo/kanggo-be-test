import db from "@/database/connection";
import type { CreateWorkerRequest, UpdateWorkerRequest, Worker } from "./workersModel";

export class WorkersRepository {
	async getAllWorkers(): Promise<Worker[]> {
		return await db("workers").select("*").orderBy("id");
	}

	async getWorkerById(id: number): Promise<Worker | null> {
		const worker = await db("workers").where({ id }).first();
		return worker || null;
	}

	async createWorker(workerData: CreateWorkerRequest): Promise<Worker> {
		const [worker] = await db("workers").insert(workerData).returning("*");
		return worker;
	}

	async updateWorker(id: number, workerData: UpdateWorkerRequest): Promise<Worker | null> {
		const [worker] = await db("workers")
			.where({ id })
			.update({ ...workerData, updated_at: new Date() })
			.returning("*");
		return worker || null;
	}

	async deleteWorker(id: number): Promise<boolean> {
		const deletedCount = await db("workers").where({ id }).del();
		return deletedCount > 0;
	}

	async getWorkersByIds(ids: number[]): Promise<Worker[]> {
		return await db("workers").whereIn("id", ids);
	}

	async checkWorkersAvailability(
		workerIds: number[],
		startDate: string,
		endDate: string,
	): Promise<{ workerId: number; workerName: string; conflictDate: string }[]> {
		const conflicts = await db("orders")
			.join("order_workers", "orders.id", "order_workers.order_id")
			.join("workers", "order_workers.worker_id", "workers.id")
			.whereIn("order_workers.worker_id", workerIds)
			.whereIn("orders.status", ["paid", "active"])
			.where(function () {
				this.whereBetween("orders.start_date", [startDate, endDate])
					.orWhereBetween("orders.end_date", [startDate, endDate])
					.orWhere(function () {
						this.where("orders.start_date", "<=", startDate).andWhere("orders.end_date", ">=", endDate);
					});
			})
			.select(
				"order_workers.worker_id as workerId",
				"workers.worker_name as workerName",
				"orders.start_date as conflictDate",
			);

		return conflicts;
	}
}

import db from "@/database/connection";
import type { Order, OrderResponse, OrderWorker } from "./ordersModel";

export class OrdersRepository {
	async createOrder(orderData: Omit<Order, "id" | "created_at" | "updated_at">): Promise<Order> {
		const [order] = await db("orders").insert(orderData).returning("*");
		return order;
	}

	async createOrderWorkers(orderWorkers: OrderWorker[]): Promise<void> {
		await db("order_workers").insert(orderWorkers);
	}

	async getOrdersByUserId(userId: number): Promise<OrderResponse[]> {
		const ordersData = await db("orders")
			.join("order_workers", "orders.id", "order_workers.order_id")
			.join("workers", "order_workers.worker_id", "workers.id")
			.where("orders.user_id", userId)
			.select(
				"orders.id as order_id",
				"orders.status",
				"orders.start_date",
				"orders.end_date",
				"orders.total_day",
				"orders.total_price",
				"orders.created_at",
				"workers.id as worker_id",
				"workers.worker_name",
				"workers.price",
			)
			.orderBy("orders.created_at", "desc");

		// Group by order_id
		const ordersMap = new Map<number, OrderResponse>();

		ordersData.forEach((row) => {
			if (!ordersMap.has(row.order_id)) {
				ordersMap.set(row.order_id, {
					order_id: row.order_id,
					status: row.status,
					start_date: row.start_date,
					end_date: row.end_date,
					total_day: row.total_day,
					total_price: row.total_price,
					workers: [],
					created_at: new Date(row.created_at),
				});
			}

			ordersMap.get(row.order_id)?.workers.push({
				worker_id: row.worker_id,
				worker_name: row.worker_name,
				price: row.price,
			});
		});

		return Array.from(ordersMap.values());
	}

	async getOrderById(id: number): Promise<Order | null> {
		const order = await db("orders").where({ id }).first();
		return order || null;
	}

	async getOrderByIdAndUserId(id: number, userId: number): Promise<Order | null> {
		const order = await db("orders").where({ id, user_id: userId }).first();
		return order || null;
	}

	async updateOrderStatus(id: number, status: string): Promise<Order | null> {
		const [order] = await db("orders").where({ id }).update({ status, updated_at: new Date() }).returning("*");
		return order || null;
	}

	async updateOrdersStatusByDateAndCurrentStatus(
		currentStatus: string,
		newStatus: string,
		dateField: string,
		date: string,
	): Promise<void> {
		await db("orders")
			.where({ status: currentStatus })
			.where(dateField, date)
			.update({ status: newStatus, updated_at: new Date() });
	}
}

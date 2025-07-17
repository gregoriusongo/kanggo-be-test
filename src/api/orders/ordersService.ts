import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { WorkersRepository } from "../workers/workersRepository";
import type { CreateOrderRequest } from "./ordersModel";
import { OrdersRepository } from "./ordersRepository";

export class OrdersService {
	private ordersRepository: OrdersRepository;
	private workersRepository: WorkersRepository;

	constructor() {
		this.ordersRepository = new OrdersRepository();
		this.workersRepository = new WorkersRepository();
	}

	private calculateDaysBetweenDates(startDate: string, endDate: string): number {
		const start = new Date(startDate);
		const end = new Date(endDate);
		const timeDifference = end.getTime() - start.getTime();
		const daysDifference = timeDifference / (1000 * 3600 * 24);
		return Math.ceil(daysDifference) + 1; // Include both start and end dates
	}

	async createOrder(orderData: CreateOrderRequest, userId: number): Promise<ServiceResponse<any>> {
		try {
			// Validate workers exist
			const workers = await this.workersRepository.getWorkersByIds(orderData.workers);
			if (workers.length !== orderData.workers.length) {
				return ServiceResponse.failure("Some workers not found", null, StatusCodes.BAD_REQUEST);
			}

			// Check workers availability
			const conflicts = await this.workersRepository.checkWorkersAvailability(
				orderData.workers,
				orderData.start_date,
				orderData.end_date,
			);

			if (conflicts.length > 0) {
				const conflictMessage = `${conflicts[0].workerName} already has schedule at ${conflicts[0].conflictDate}`;
				return ServiceResponse.failure(conflictMessage, null, StatusCodes.BAD_REQUEST);
			}

			// Calculate total days and price
			const totalDays = this.calculateDaysBetweenDates(orderData.start_date, orderData.end_date);
			const totalPrice = workers.reduce((sum, worker) => sum + worker.price * totalDays, 0);

			// Create order
			const order = await this.ordersRepository.createOrder({
				user_id: userId,
				start_date: orderData.start_date,
				end_date: orderData.end_date,
				total_day: totalDays,
				status: "paid",
				total_price: totalPrice,
			});

			// Create order-worker relationships
			const orderWorkers = orderData.workers.map((workerId) => ({
				order_id: order.id,
				worker_id: workerId,
			}));

			await this.ordersRepository.createOrderWorkers(orderWorkers);

			const responseData = {
				order_id: order.id,
				workers: orderData.workers,
				total_day: totalDays,
				status: "paid",
				total_price: totalPrice,
				created_at: order.created_at,
			};

			return ServiceResponse.success("Order Created", responseData, StatusCodes.CREATED);
		} catch (_error) {
			return ServiceResponse.failure("Failed to create order", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async getOrdersByUserId(userId: number): Promise<ServiceResponse<any>> {
		try {
			const orders = await this.ordersRepository.getOrdersByUserId(userId);
			return ServiceResponse.success("List Order", orders, StatusCodes.OK);
		} catch (_error) {
			return ServiceResponse.failure("Failed to get orders", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async cancelOrder(orderId: number, userId: number): Promise<ServiceResponse<any>> {
		try {
			const order = await this.ordersRepository.getOrderByIdAndUserId(orderId, userId);
			if (!order) {
				return ServiceResponse.failure("Order not found", null, StatusCodes.NOT_FOUND);
			}

			if (order.status !== "paid") {
				return ServiceResponse.failure("Order cannot be cancelled", null, StatusCodes.BAD_REQUEST);
			}

			const updatedOrder = await this.ordersRepository.updateOrderStatus(orderId, "cancel");

			const responseData = {
				order_id: updatedOrder?.id,
				status: "cancel",
				created_at: updatedOrder?.created_at,
				updated_at: updatedOrder?.updated_at,
			};

			return ServiceResponse.success("Order Canceled", responseData, StatusCodes.OK);
		} catch (_error) {
			return ServiceResponse.failure("Failed to cancel order", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async updateOrdersToActive(): Promise<void> {
		const today = new Date().toISOString().split("T")[0];
		await this.ordersRepository.updateOrdersStatusByDateAndCurrentStatus("paid", "active", "start_date", today);
	}

	async updateOrdersToCompleted(): Promise<void> {
		const today = new Date().toISOString().split("T")[0];
		await this.ordersRepository.updateOrdersStatusByDateAndCurrentStatus("active", "completed", "end_date", today);
	}
}

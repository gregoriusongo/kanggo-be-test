import type { Request, Response } from "express";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { OrdersService } from "./ordersService";

export class OrdersController {
	private ordersService: OrdersService;

	constructor() {
		this.ordersService = new OrdersService();
	}

	createOrder = async (req: Request, res: Response) => {
		const userId = req.user?.userId;
		if (!userId) {
			return res.status(400).json({ message: "User ID is required" });
		}

		const serviceResponse = await this.ordersService.createOrder(req.body, userId);
		return handleServiceResponse(serviceResponse, res);
	};

	getOrders = async (req: Request, res: Response) => {
		const userId = req.user?.userId;
		if (!userId) {
			return res.status(400).json({ message: "User ID is required" });
		}

		const serviceResponse = await this.ordersService.getOrdersByUserId(userId);
		return handleServiceResponse(serviceResponse, res);
	};

	cancelOrder = async (req: Request, res: Response) => {
		const orderId = parseInt(req.params.order_id);
		const userId = req.user?.userId;
		if (!userId) {
			return res.status(400).json({ message: "User ID is required" });
		}

		const serviceResponse = await this.ordersService.cancelOrder(orderId, userId);
		return handleServiceResponse(serviceResponse, res);
	};
}

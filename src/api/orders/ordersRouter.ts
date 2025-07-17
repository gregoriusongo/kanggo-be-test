import { Router } from "express";
import { z } from "zod";
import { authenticateToken, requireRole } from "@/common/middleware/auth";
import { validateRequest } from "@/common/utils/httpHandlers";
import { OrdersController } from "./ordersController";

const ordersRouter = Router();
const ordersController = new OrdersController();

const createOrderSchema = z.object({
	body: z.object({
		workers: z.array(z.number()).min(1, "At least one worker is required"),
		start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
		end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
	}),
});

const cancelOrderSchema = z.object({
	body: z.object({
		status: z.literal("cancel"),
	}),
});

// Customer routes
ordersRouter.post(
	"/",
	authenticateToken,
	requireRole(["customer"]),
	validateRequest(createOrderSchema),
	ordersController.createOrder,
);
ordersRouter.get("/", authenticateToken, requireRole(["customer"]), ordersController.getOrders);
ordersRouter.put(
	"/cancel_order/:order_id",
	authenticateToken,
	requireRole(["customer"]),
	validateRequest(cancelOrderSchema),
	ordersController.cancelOrder,
);

export { ordersRouter };

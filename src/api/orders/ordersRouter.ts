import { Router } from "express";
import { z } from "zod";
import { authenticateToken, requireRole } from "@/common/middleware/auth";
import { validateRequest } from "@/common/utils/httpHandlers";
import { OrdersController } from "./ordersController";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";

export const ordersRegistry = new OpenAPIRegistry();
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

// Response schemas
const OrderSchema = z.object({
	id: z.number(),
	customer_id: z.number(),
	start_date: z.string(),
	end_date: z.string(),
	status: z.string(),
	total_price: z.number(),
	created_at: z.string(),
	updated_at: z.string(),
});

// Register OpenAPI paths
ordersRegistry.registerPath({
	method: "post",
	path: "/orders",
	tags: ["Orders"],
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: createOrderSchema.shape.body,
				},
			},
		},
	},
	responses: createApiResponse(OrderSchema, "Order created successfully"),
});

ordersRegistry.registerPath({
	method: "get",
	path: "/orders",
	tags: ["Orders"],
	security: [{ bearerAuth: [] }],
	responses: createApiResponse(z.array(OrderSchema), "Orders retrieved successfully"),
});

ordersRegistry.registerPath({
	method: "put",
	path: "/orders/cancel_order/{order_id}",
	tags: ["Orders"],
	security: [{ bearerAuth: [] }],
	request: {
		params: z.object({ order_id: z.string() }),
		body: {
			content: {
				"application/json": {
					schema: cancelOrderSchema.shape.body,
				},
			},
		},
	},
	responses: createApiResponse(OrderSchema, "Order cancelled successfully"),
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

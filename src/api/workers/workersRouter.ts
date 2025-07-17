import { Router } from "express";
import { z } from "zod";
import { authenticateToken, requireRole } from "@/common/middleware/auth";
import { validateRequest } from "@/common/utils/httpHandlers";
import { WorkersController } from "./workersController";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";

export const workersRegistry = new OpenAPIRegistry();
const workersRouter = Router();
const workersController = new WorkersController();

// Admin routes
const createWorkerSchema = z.object({
	body: z.object({
		worker_name: z.string().min(1, "Worker name is required"),
		price: z.number().min(1, "Price must be greater than 0"),
	}),
});

const updateWorkerSchema = z.object({
	body: z.object({
		worker_name: z.string().min(1, "Worker name is required").optional(),
		price: z.number().min(1, "Price must be greater than 0").optional(),
	}),
});

// Response schemas
const WorkerSchema = z.object({
	id: z.number(),
	worker_name: z.string(),
	price: z.number(),
	created_at: z.string(),
	updated_at: z.string(),
});

// Register OpenAPI paths
workersRegistry.registerPath({
	method: "get",
	path: "/workers",
	tags: ["Workers"],
	responses: createApiResponse(z.array(WorkerSchema), "Workers retrieved successfully"),
});

workersRegistry.registerPath({
	method: "get",
	path: "/workers/admin",
	tags: ["Workers"],
	security: [{ bearerAuth: [] }],
	responses: createApiResponse(z.array(WorkerSchema), "Workers retrieved successfully for admin"),
});

workersRegistry.registerPath({
	method: "post",
	path: "/workers/admin",
	tags: ["Workers"],
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: createWorkerSchema.shape.body,
				},
			},
		},
	},
	responses: createApiResponse(WorkerSchema, "Worker created successfully"),
});

workersRegistry.registerPath({
	method: "put",
	path: "/workers/admin/{id}",
	tags: ["Workers"],
	security: [{ bearerAuth: [] }],
	request: {
		params: z.object({ id: z.string() }),
		body: {
			content: {
				"application/json": {
					schema: updateWorkerSchema.shape.body,
				},
			},
		},
	},
	responses: createApiResponse(WorkerSchema, "Worker updated successfully"),
});

workersRegistry.registerPath({
	method: "delete",
	path: "/workers/admin/{id}",
	tags: ["Workers"],
	security: [{ bearerAuth: [] }],
	request: {
		params: z.object({ id: z.string() }),
	},
	responses: createApiResponse(z.null(), "Worker deleted successfully"),
});

// Public route - get all workers
workersRouter.get("/", workersController.getAllWorkers);

workersRouter.get("/admin", authenticateToken, requireRole(["admin"]), workersController.getAllWorkersForAdmin);
workersRouter.post(
	"/admin",
	authenticateToken,
	requireRole(["admin"]),
	validateRequest(createWorkerSchema),
	workersController.createWorker,
);
workersRouter.put(
	"/admin/:id",
	authenticateToken,
	requireRole(["admin"]),
	validateRequest(updateWorkerSchema),
	workersController.updateWorker,
);
workersRouter.delete("/admin/:id", authenticateToken, requireRole(["admin"]), workersController.deleteWorker);

export { workersRouter };

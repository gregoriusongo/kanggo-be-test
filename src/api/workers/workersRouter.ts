import { Router } from "express";
import { z } from "zod";
import { authenticateToken, requireRole } from "@/common/middleware/auth";
import { validateRequest } from "@/common/utils/httpHandlers";
import { WorkersController } from "./workersController";

const workersRouter = Router();
const workersController = new WorkersController();

// Public route - get all workers
workersRouter.get("/", workersController.getAllWorkers);

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

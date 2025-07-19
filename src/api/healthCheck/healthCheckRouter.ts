import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Request, type Response, type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { ServiceResponse } from "@/common/models/serviceResponse";
import db from "@/database/connection";

export const healthCheckRegistry = new OpenAPIRegistry();
export const healthCheckRouter: Router = express.Router();

const HealthCheckResponseSchema = z.object({
	status: z.string(),
	timestamp: z.string(),
	database: z.object({
		connected: z.boolean(),
		status: z.string(),
	}),
});

healthCheckRegistry.registerPath({
	method: "get",
	path: "/health-check",
	tags: ["Health Check"],
	responses: createApiResponse(HealthCheckResponseSchema, "Health check status"),
});

healthCheckRouter.get("/", async (_req: Request, res: Response) => {
	let dbStatus = { connected: false, status: "disconnected" };
	
	try {
		// Test database connection
		await db.raw("SELECT 1");
		dbStatus = { connected: true, status: "connected" };
	} catch (error) {
		console.error("Database health check failed:", error);
		dbStatus = { connected: false, status: "error" };
	}

	const healthData = {
		status: dbStatus.connected ? "healthy" : "unhealthy",
		timestamp: new Date().toISOString(),
		database: dbStatus,
	};

	const statusCode = dbStatus.connected ? 200 : 503;
	const serviceResponse = dbStatus.connected 
		? ServiceResponse.success("Health check completed", healthData, statusCode)
		: ServiceResponse.failure("Health check failed - database unavailable", healthData, statusCode);
	
	res.status(serviceResponse.statusCode).send(serviceResponse);
});

import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { healthCheckRegistry } from "@/api/healthCheck/healthCheckRouter";
import { userRegistry } from "@/api/user/userRouter";
import { authRegistry } from "@/api/auth/authRouter";
import { ordersRegistry } from "@/api/orders/ordersRouter";
import { workersRegistry } from "@/api/workers/workersRouter";

export type OpenAPIDocument = ReturnType<OpenApiGeneratorV3["generateDocument"]>;

export function generateOpenAPIDocument(): OpenAPIDocument {
	const registry = new OpenAPIRegistry([
		healthCheckRegistry, 
		userRegistry, 
		authRegistry, 
		ordersRegistry, 
		workersRegistry
	]);
	const generator = new OpenApiGeneratorV3(registry.definitions);

	return generator.generateDocument({
		openapi: "3.0.0",
		info: {
			version: "1.0.0",
			title: "Express TypeScript API",
			description: "A comprehensive REST API built with Express.js and TypeScript",
		},
		servers: [
			{
				url: "http://localhost:3000",
				description: "Development server",
			},
		],
		externalDocs: {
			description: "View the raw OpenAPI Specification in JSON format",
			url: "/swagger.json",
		},
	});
}

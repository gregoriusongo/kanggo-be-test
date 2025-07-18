import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "@/common/utils/httpHandlers";
import { authController } from "./authController";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";

export const authRegistry = new OpenAPIRegistry();
export const authRouter = Router();

// Register validation schema
const registerSchema = z.object({
	body: z.object({
		fullname: z.string().min(1, "Fullname is required"),
		cellphone: z.string().min(1, "Cellphone is required"),
		email: z.string().email("Invalid email format"),
		role: z.enum(["customer", "admin"]),
		password: z.string().min(6, "Password must be at least 6 characters"),
	}),
});

// Login validation schema
const loginSchema = z.object({
	body: z.object({
		email_cellphone: z.string().min(1, "Email or cellphone is required"),
		password: z.string().min(1, "Password is required"),
	}),
});

// Response schemas
const AuthResponseSchema = z.object({
	user: z.object({
		id: z.number(),
		fullname: z.string(),
		email: z.string(),
		role: z.enum(["customer", "admin"]),
	}),
	token: z.string(),
});

// Register OpenAPI paths
authRegistry.registerPath({
	method: "post",
	path: "/register",
	tags: ["Authentication"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: registerSchema.shape.body,
				},
			},
		},
	},
	responses: createApiResponse(AuthResponseSchema, "User registered successfully"),
});

authRegistry.registerPath({
	method: "post",
	path: "/login",
	tags: ["Authentication"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: loginSchema.shape.body,
				},
			},
		},
	},
	responses: createApiResponse(AuthResponseSchema, "User logged in successfully"),
});

// Routes
authRouter.post("/register", validateRequest(registerSchema), authController.register);
authRouter.post("/login", validateRequest(loginSchema), authController.login);

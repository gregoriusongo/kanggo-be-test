import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";

export interface JwtPayload {
	userId: number;
	email: string;
	role: "customer" | "admin";
}

declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	const token = authHeader?.split(" ")[1];

	if (!token) {
		const serviceResponse = ServiceResponse.failure("Access token required", null, StatusCodes.UNAUTHORIZED);
		return res.status(serviceResponse.statusCode).send(serviceResponse);
	}

	try {
		const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
		req.user = decoded;
		next();
	} catch (_error) {
		const serviceResponse = ServiceResponse.failure("Invalid token", null, StatusCodes.UNAUTHORIZED);
		return res.status(serviceResponse.statusCode).send(serviceResponse);
	}
};

export const requireRole = (roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) {
			const serviceResponse = ServiceResponse.failure("Authentication required", null, StatusCodes.UNAUTHORIZED);
			return res.status(serviceResponse.statusCode).send(serviceResponse);
		}

		if (!roles.includes(req.user.role)) {
			const serviceResponse = ServiceResponse.failure("Insufficient permissions", null, StatusCodes.FORBIDDEN);
			return res.status(serviceResponse.statusCode).send(serviceResponse);
		}

		next();
	};
};

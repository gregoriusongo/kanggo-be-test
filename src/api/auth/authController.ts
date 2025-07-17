import type { Request, Response } from "express";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { AuthService } from "./authService";

export class AuthController {
	private authService: AuthService;

	constructor() {
		this.authService = new AuthService();
	}

	register = async (req: Request, res: Response) => {
		const serviceResponse = await this.authService.register(req.body);
		return handleServiceResponse(serviceResponse, res);
	};

	login = async (req: Request, res: Response) => {
		const serviceResponse = await this.authService.login(req.body);
		return handleServiceResponse(serviceResponse, res);
	};
}

export const authController = new AuthController();

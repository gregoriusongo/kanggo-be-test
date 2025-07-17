import type { Request, Response } from "express";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { WorkersService } from "./workersService";

export class WorkersController {
	private workersService: WorkersService;

	constructor() {
		this.workersService = new WorkersService();
	}

	getAllWorkers = async (_req: Request, res: Response) => {
		const serviceResponse = await this.workersService.getAllWorkers();
		return handleServiceResponse(serviceResponse, res);
	};

	getAllWorkersForAdmin = async (_req: Request, res: Response) => {
		const serviceResponse = await this.workersService.getAllWorkersForAdmin();
		return handleServiceResponse(serviceResponse, res);
	};

	createWorker = async (req: Request, res: Response) => {
		const serviceResponse = await this.workersService.createWorker(req.body);
		return handleServiceResponse(serviceResponse, res);
	};

	updateWorker = async (req: Request, res: Response) => {
		const workerId = parseInt(req.params.id);
		const serviceResponse = await this.workersService.updateWorker(workerId, req.body);
		return handleServiceResponse(serviceResponse, res);
	};

	deleteWorker = async (req: Request, res: Response) => {
		const workerId = parseInt(req.params.id);
		const serviceResponse = await this.workersService.deleteWorker(workerId);
		return handleServiceResponse(serviceResponse, res);
	};
}

import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { CreateWorkerRequest, UpdateWorkerRequest } from "./workersModel";
import { WorkersRepository } from "./workersRepository";

export class WorkersService {
	private workersRepository: WorkersRepository;

	constructor() {
		this.workersRepository = new WorkersRepository();
	}

	async getAllWorkers(): Promise<ServiceResponse<any>> {
		try {
			const workers = await this.workersRepository.getAllWorkers();

			const responseData = workers.map((worker) => ({
				worker_id: worker.id,
				worker_name: worker.worker_name,
				price: worker.price,
			}));

			return ServiceResponse.success("List Of Workers", responseData, StatusCodes.OK);
		} catch (_error) {
			return ServiceResponse.failure("Failed to get workers", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async getAllWorkersForAdmin(): Promise<ServiceResponse<any>> {
		try {
			const workers = await this.workersRepository.getAllWorkers();

			const responseData = workers.map((worker) => ({
				worker_id: worker.id,
				worker_name: worker.worker_name,
				price: worker.price,
				created_at: new Date(worker.created_at).toISOString().replace("T", " ").slice(0, 19),
				updated_at: new Date(worker.updated_at).toISOString().replace("T", " ").slice(0, 19),
			}));

			return ServiceResponse.success("List Of Workers", responseData, StatusCodes.OK);
		} catch (_error) {
			return ServiceResponse.failure("Failed to get workers", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async createWorker(workerData: CreateWorkerRequest): Promise<ServiceResponse<any>> {
		try {
			const worker = await this.workersRepository.createWorker(workerData);

			const responseData = {
				worker_id: worker.id,
				worker_name: worker.worker_name,
				price: worker.price,
				created_at: new Date(worker.created_at).toISOString().replace("T", " ").slice(0, 19)
			};

			return ServiceResponse.success("New Worker Created!", responseData, StatusCodes.CREATED);
		} catch (_error) {
			return ServiceResponse.failure("Failed to create worker", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async updateWorker(id: number, workerData: UpdateWorkerRequest): Promise<ServiceResponse<any>> {
		try {
			const existingWorker = await this.workersRepository.getWorkerById(id);
			if (!existingWorker) {
				return ServiceResponse.failure("Worker not found", null, StatusCodes.NOT_FOUND);
			}

			const updatedWorker = await this.workersRepository.updateWorker(id, workerData);

			const responseData = {
				worker_id: updatedWorker?.id,
				worker_name: updatedWorker?.worker_name,
				price: updatedWorker?.price,
				created_at: updatedWorker?.created_at,
				updated_at: updatedWorker?.updated_at,
			};

			return ServiceResponse.success(`Worker With ID ${id} Updated!`, responseData, StatusCodes.OK);
		} catch (_error) {
			return ServiceResponse.failure("Failed to update worker", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async deleteWorker(id: number): Promise<ServiceResponse<any>> {
		try {
			const existingWorker = await this.workersRepository.getWorkerById(id);
			if (!existingWorker) {
				return ServiceResponse.failure("Worker not found", null, StatusCodes.NOT_FOUND);
			}

			const deleted = await this.workersRepository.deleteWorker(id);
			if (!deleted) {
				return ServiceResponse.failure("Failed to delete worker", null, StatusCodes.INTERNAL_SERVER_ERROR);
			}

			return ServiceResponse.success(`Worker With ID ${id} Deleted`, null, StatusCodes.OK);
		} catch (_error) {
			return ServiceResponse.failure("Failed to delete worker", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
}

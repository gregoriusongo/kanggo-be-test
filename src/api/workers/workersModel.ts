export interface Worker {
	id: number;
	worker_name: string;
	price: number;
	created_at: Date;
	updated_at: Date;
}

export interface CreateWorkerRequest {
	worker_name: string;
	price: number;
}

export interface UpdateWorkerRequest {
	worker_name?: string;
	price?: number;
}

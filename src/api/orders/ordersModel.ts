export interface Order {
	id: number;
	user_id: number;
	start_date: string;
	end_date: string;
	total_day: number;
	status: "paid" | "active" | "completed" | "cancel";
	total_price: number;
	created_at: Date;
	updated_at: Date;
}

export interface CreateOrderRequest {
	workers: number[];
	start_date: string;
	end_date: string;
}

export interface OrderWorker {
	order_id: number;
	worker_id: number;
}

export interface OrderResponse {
	order_id: number;
	status: string;
	start_date: string;
	end_date: string;
	total_day: number;
	total_price: number;
	workers: {
		worker_id: number;
		worker_name: string;
		price: number;
	}[];
	created_at: Date;
}

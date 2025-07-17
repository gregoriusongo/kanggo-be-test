export interface User {
	id: number;
	fullname: string;
	cellphone: string;
	email: string;
	role: "customer" | "admin";
	password: string;
	created_at: Date;
	updated_at: Date;
}

export interface CreateUserRequest {
	fullname: string;
	cellphone: string;
	email: string;
	role: "customer" | "admin";
	password: string;
}

export interface LoginRequest {
	email_cellphone: string;
	password: string;
}

export interface LoginResponse {
	user_id: number;
	email: string;
	token: string;
}

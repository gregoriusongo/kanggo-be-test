import db from "@/database/connection";
import type { CreateUserRequest, User } from "./authModel";

export class AuthRepository {
	async createUser(userData: CreateUserRequest): Promise<User> {
		const [user] = await db("users").insert(userData).returning("*");
		return user;
	}

	async findUserByEmail(email: string): Promise<User | null> {
		const user = await db("users").where({ email }).first();
		return user || null;
	}

	async findUserByCellphone(cellphone: string): Promise<User | null> {
		const user = await db("users").where({ cellphone }).first();
		return user || null;
	}

	async findUserByEmailOrCellphone(emailOrCellphone: string): Promise<User | null> {
		const user = await db("users").where("email", emailOrCellphone).orWhere("cellphone", emailOrCellphone).first();
		return user || null;
	}

	async findUserById(id: number): Promise<User | null> {
		const user = await db("users").where({ id }).first();
		return user || null;
	}
}

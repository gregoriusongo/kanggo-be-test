import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import type { CreateUserRequest, LoginRequest, LoginResponse } from "./authModel";
import { AuthRepository } from "./authRepository";

export class AuthService {
	private authRepository: AuthRepository;

	constructor() {
		this.authRepository = new AuthRepository();
	}

	async register(userData: CreateUserRequest): Promise<ServiceResponse<any>> {
		try {
			// Check if user already exists
			const existingUserByEmail = await this.authRepository.findUserByEmail(userData.email);
			if (existingUserByEmail) {
				return ServiceResponse.failure("Email already exists", null, StatusCodes.BAD_REQUEST);
			}

			const existingUserByCellphone = await this.authRepository.findUserByCellphone(userData.cellphone);
			if (existingUserByCellphone) {
				return ServiceResponse.failure("Cellphone already exists", null, StatusCodes.BAD_REQUEST);
			}

			// Hash password
			const hashedPassword = await bcrypt.hash(userData.password, 10);

			// Create user
			const user = await this.authRepository.createUser({
				...userData,
				password: hashedPassword,
			});

			const responseData = {
				user_id: user.id,
				email: user.email,
				fullname: user.fullname,
				created_at: new Date(user.created_at).toISOString().replace("T", " ").slice(0, 19),
			};

			return ServiceResponse.success("Register Success", responseData, StatusCodes.CREATED);
		} catch (_error) {
			return ServiceResponse.failure("Registration failed", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async login(loginData: LoginRequest): Promise<ServiceResponse<LoginResponse | null>> {
		try {
			// Find user by email or cellphone
			const user = await this.authRepository.findUserByEmailOrCellphone(loginData.email_cellphone);
			if (!user) {
				return ServiceResponse.failure("Invalid credentials", null, StatusCodes.UNAUTHORIZED);
			}

			// Check password
			const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
			if (!isPasswordValid) {
				return ServiceResponse.failure("Invalid credentials", null, StatusCodes.UNAUTHORIZED);
			}

			// Generate JWT token
			const payload = { userId: user.id, email: user.email, role: user.role };
			const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "24h" });

			const responseData: LoginResponse = {
				user_id: user.id,
				email: user.email,
				token,
			};

			return ServiceResponse.success("Login Success", responseData, StatusCodes.OK);
		} catch (_error) {
			return ServiceResponse.failure("Login failed", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
}

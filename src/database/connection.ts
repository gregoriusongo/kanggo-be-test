import knex from "knex";
import { env } from "@/common/utils/envConfig";

const db = knex({
	client: "pg",
	connection: {
		host: env.DB_HOST,
		port: env.DB_PORT,
		user: env.DB_USER,
		password: env.DB_PASSWORD,
		database: env.DB_NAME,
	},
	pool: {
		min: 2,
		max: 10,
	},
	acquireConnectionTimeout: 10000,
});

// Function to test database connection
export const testDatabaseConnection = async (maxRetries: number = 5): Promise<void> => {
	let lastError: Error | null = null;
	
	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			console.log(`Testing database connection (attempt ${attempt}/${maxRetries})...`);
			
			// Test the connection by running a simple query
			await db.raw("SELECT 1");
			
			console.log("✅ Database connection successful");
			return;
		} catch (error) {
			lastError = error instanceof Error ? error : new Error("Unknown database error");
			console.error(`❌ Database connection attempt ${attempt} failed:`, lastError.message);
			
			if (attempt < maxRetries) {
				const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff, max 10s
				console.log(`Retrying in ${delay}ms...`);
				await new Promise(resolve => setTimeout(resolve, delay));
			}
		}
	}
	
	throw new Error(`Database connection failed after ${maxRetries} attempts: ${lastError?.message || "Unknown error"}`);
};

// Function to gracefully close database connection
export const closeDatabaseConnection = async (): Promise<void> => {
	try {
		await db.destroy();
		console.log("Database connection closed gracefully");
	} catch (error) {
		console.error("Error closing database connection:", error);
	}
};

export default db;

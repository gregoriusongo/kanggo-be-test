import { env } from "@/common/utils/envConfig";
import { app, logger } from "@/server";
import { testDatabaseConnection, closeDatabaseConnection } from "@/database/connection";

const startServer = async () => {
	try {
		// Test database connection before starting the server
		await testDatabaseConnection();

		const server = app.listen(env.PORT, () => {
			const { NODE_ENV, HOST, PORT } = env;
			logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
		});

		const onCloseSignal = () => {
			logger.info("sigint received, shutting down");
			server.close(async () => {
				try {
					await closeDatabaseConnection();
					logger.info("server closed");
					process.exit();
				} catch (error) {
					logger.error("Error during shutdown:", error);
					process.exit(1);
				}
			});
			setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
		};

		process.on("SIGINT", onCloseSignal);
		process.on("SIGTERM", onCloseSignal);

	} catch (error) {
		logger.error("Failed to start server:", error);
		process.exit(1);
	}
};

// Start the server
startServer();

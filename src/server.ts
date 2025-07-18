import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import { authRouter } from "@/api/auth/authRouter";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { ordersRouter } from "@/api/orders/ordersRouter";
import { userRouter } from "@/api/user/userRouter";
import { workersRouter } from "@/api/workers/workersRouter";
import { openAPIRouter } from "@/api-docs/openAPIRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { startAllCronJobs } from "@/common/utils/cronJobs";
import { env } from "@/common/utils/envConfig";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use("/health-check", healthCheckRouter);
// app.use("/users", userRouter);
app.use("/api/v1", authRouter);
app.use("/api/v1/workers", workersRouter);
app.use("/api/v1/orders", ordersRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

// Start cron jobs
startAllCronJobs();

export { app, logger };

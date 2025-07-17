import * as cron from "node-cron";
import { OrdersService } from "@/api/orders/ordersService";
import { logger } from "@/server";

const ordersService = new OrdersService();

// NOTE Only for testing purposes
export const testCron = () => {
	cron.schedule(
		"* * * * *",
		async () => {
			try {
				logger.info("Running test cron job");
			} catch (error) {
				logger.error("Error in test cron job:", error);
			}
		},
		{
			timezone: "Asia/Jakarta", // WIB timezone
		},
	);
};

// Run at 07:00 WIB every day to update orders from 'paid' to 'active'
export const startOrdersActivationCron = () => {
	cron.schedule(
		"0 7 * * *",
		async () => {
			try {
				logger.info("Running orders activation cron job");
				await ordersService.updateOrdersToActive();
				logger.info("Orders activation cron job completed successfully");
			} catch (error) {
				logger.error("Error in orders activation cron job:", error);
			}
		},
		{
			timezone: "Asia/Jakarta", // WIB timezone
		},
	);
};

// Run at 17:00 WIB every day to update orders from 'active' to 'completed'
export const startOrdersCompletionCron = () => {
	cron.schedule(
		"0 17 * * *",
		async () => {
			try {
				logger.info("Running orders completion cron job");
				await ordersService.updateOrdersToCompleted();
				logger.info("Orders completion cron job completed successfully");
			} catch (error) {
				logger.error("Error in orders completion cron job:", error);
			}
		},
		{
			timezone: "Asia/Jakarta", // WIB timezone
		},
	);
};

export const startAllCronJobs = () => {
	// testCron(); //NOTE enable to test cron functionality
   startOrdersActivationCron();
	startOrdersCompletionCron();
	logger.info("All cron jobs started");
};

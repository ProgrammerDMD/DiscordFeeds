import paddle from "./paddle";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "./db/drizzle";
import { GuildPayment, GuildPayments, Sessions, User, UserPayment, UserPayments, Users } from "./db/schema";
import { and, desc, eq, gt, sql } from "drizzle-orm";

export const adapter = new DrizzlePostgreSQLAdapter(db, Sessions, Users);

export async function isGuildActive(guildId: string): Promise<{
	payment: GuildPayment | undefined,
	user: User | undefined
}> {
	try {
		return await db.transaction(async (tx) => {
			const [payment] = await tx.select().from(GuildPayments).where(
				and(
					eq(GuildPayments.guildId, guildId),
					gt(GuildPayments.expiresAt, new Date())
				)
			).limit(1).orderBy(desc(GuildPayments.expiresAt));

			if (!payment) {
				return {
					payment: undefined,
					user: undefined
				}
			}

			const [user] = await tx.select().from(Users).where(eq(Users.id, payment.userId)).limit(1);
			if (!user) {
				return {
					payment: payment,
					user: undefined
				}
			}

			return {
				payment: payment,
				user: user
			}
		});
	} catch (error) {
		console.error(error);
		return Promise.reject(new Error(`An error has occurred while checking if guild with id ${guildId} is active!`));
	}
}

const PAYMENT_DURATION = 31 * 86400 * 1000;
export async function upgradeGuild(guildId: string, userId: string): Promise<GuildPayment | undefined> {
	try {
		return await db.transaction(async (tx) => {
			const [user] = await tx.update(Users).set({
				guildCredits: sql`${Users.guildCredits} - 1`
			}).where(and(
				eq(Users.id, userId),
				and(gt(Users.guildCredits, 0))
			)).returning({ id: Users.id });

			if (!user) {
				await tx.rollback();
				return Promise.reject(new Error(`User with id ${userId} could not be found!`));
			}

			const now = new Date();
			const expiresAt = new Date(now.getTime() + PAYMENT_DURATION);
			const totalPayments = await tx.select().from(GuildPayments).where(and(
				eq(GuildPayments.guildId, guildId),
				gt(GuildPayments.expiresAt, now)
			));

			if (totalPayments.length > 0) {
				await tx.rollback();
				return Promise.reject(new Error(`A payment already exists for guild with id ${guildId}!`));
			}

			const [payment] = await tx.insert(GuildPayments).values({
				guildId: guildId,
				userId: userId,
				transactionDate: now,
				expiresAt: expiresAt
			}).returning();

			const response = await fetch(`${process.env.API_URL}/purger/guild`, {
				method: "POST",
				body: JSON.stringify({
					"id": guildId,
					"purgeAtMillis": payment.expiresAt.getTime() + (1 * 86400 * 1000)
				}),
				headers: {
					"Content-Type": "application/json"
				}
			});

			if (!response.ok) {
				await tx.rollback();
				return Promise.reject(new Error(`Couldn't schedule the guild for purging!`));
			}
			return payment;
		});
	} catch (error) {
		console.error(error);
		return Promise.reject(new Error(`An error has occurred while upgrading the guild with id ${guildId} and user with id ${userId}!`));
	}
}

export async function getUserPayment(userId: string): Promise<UserPayment | undefined> {
	try {
		const now = new Date();
		const [payment] = await db.select().from(UserPayments).where(and(
			eq(UserPayments.userId, userId),
			gt(UserPayments.expiresAt, now)
		)).orderBy(desc(UserPayments.expiresAt)).limit(1);
		return payment;
	} catch (error) {
		console.error(error);
		return Promise.reject(new Error(`An error has occurred while getting the user payment with id ${userId}!`));
	}
}

export async function resumeSubscription(userId: string): Promise<void> {
	try {
		return await db.transaction(async (tx) => {
			const [payment] = await tx.update(UserPayments).set({
				status: "active"
			}).where(and(
				eq(UserPayments.status, "canceled"),
				gt(UserPayments.expiresAt, new Date())
			)).returning({ subscriptionId: UserPayments.subscriptionId });

			if (!payment) {
				await tx.rollback();
				return Promise.reject(new Error(`Couldn't find a payment for user with id ${userId} was not found!`));
			}

			await paddle.subscriptions.update(payment.subscriptionId, {
				scheduledChange: null
			});
		})
	} catch (error) {
		console.error(error);
		return Promise.reject(new Error(`An unknown error occurred while resuming subscription for user with id ${userId}`));
	}
}

export async function cancelSubscription(userId: string): Promise<void> {
	try {
		try {
			return await db.transaction(async (tx) => {
				const [payment] = await tx.update(UserPayments).set({
					status: "canceled"
				}).where(and(
					eq(UserPayments.status, "active"),
					gt(UserPayments.expiresAt, new Date())
				)).returning({ subscriptionId: UserPayments.subscriptionId });

				if (!payment) {
					await tx.rollback();
					return Promise.reject(new Error(`Couldn't find a payment for user with id ${userId} was not found!`));
				}

				await paddle.subscriptions.cancel(payment.subscriptionId, {
					effectiveFrom: "next_billing_period"
				});
			});
		} catch (error) {
			console.error(error);
			return Promise.reject(new Error(`An unknown error occurred while canceling subscription for user with id ${userId}`));
		}
	} catch (error) {
		console.error(error);
		return Promise.reject(new Error(`An unknown error occurred while canceling subscription for user with id ${userId}`));
	}
}

export async function cancelUserDeletion(userId: string) {
	try {
		await db.transaction(async (tx) => {
			const [user] = await db.update(Users).set({
				deleting: false,
				deleteAt: null
			}).where(eq(Users.id, userId)).returning();

			if (!user) {
				await tx.rollback();
				return Promise.reject(new Error("No user found for canceling the deletion process!"));
			}

			const [payment] = await db.select().from(UserPayments).where(and(
				eq(UserPayments.userId, userId),
				gt(UserPayments.expiresAt, new Date())
			)).orderBy(desc(UserPayments.expiresAt)).limit(1);

			if (payment) {
				const response = await fetch(`${process.env.API_URL}/purger/user`, {
					method: "POST",
					body: JSON.stringify({
						"id": userId,
						"purgeAtMillis": payment.expiresAt.getTime() + (2 * 86400 * 1000)
					}),
					headers: {
						"Content-Type": "application/json"
					}
				});

				if (!response.ok) return Promise.reject(new Error("Couldn't unschedule the user for purging: " + response.statusText));
			}
		})
	} catch (error) {
		console.error(error);
		return Promise.reject(new Error(`An error has occurred when canceling the deletion process for user with id ${userId}!`));
	}
}

export async function deleteUser(userId: string) {
	try {
		await db.transaction(async (tx) => {
			const [payment] = await tx.select().from(UserPayments).where(and(
				eq(UserPayments.userId, userId),
				gt(UserPayments.expiresAt, new Date())
			)).orderBy(desc(UserPayments.expiresAt));

			if (!payment) {
				const deleteResult = await tx.delete(Users).where(eq(Users.id, userId));
				if (!deleteResult.rowCount || deleteResult.rowCount < 1) return Promise.reject(new Error("No user found for deletion!"));
				return;
			}

			const result = await tx.update(Users).set({
				deleting: true,
				deleteAt: payment.expiresAt
			}).where(eq(Users.id, userId)).returning();

			if (result.length < 1) {
				return Promise.reject(new Error("No user found for deletion!"));
			}

			const response = await fetch(`${process.env.API_URL}/purger/user`, {
				method: "POST",
				body: JSON.stringify({
					"id": userId,
					"purgeAtMillis": payment.expiresAt.getTime()
				}),
				headers: {
					"Content-Type": "application/json"
				}
			});

			if (!response.ok) {
				await tx.rollback();
				return Promise.reject(new Error("Couldn't schedule the user for purging!"));
			}
		});
	} catch (error) {
		console.error(error);
		return Promise.reject(new Error(`An error has occurred when deleting user with id ${userId}!`));
	}
}

export async function upgradeUser(userId: string, subscriptionId: string) {
	try {
		await db.transaction(async (tx) => {
			const now = new Date();
			const expiresAt = new Date(now.getTime() + PAYMENT_DURATION);

			const [payment] = await tx.insert(UserPayments).values({
				userId: userId,
				subscriptionId: subscriptionId,
				transactionDate: now,
				expiresAt: expiresAt,
				status: "active"
			}).onConflictDoUpdate({
				target: UserPayments.subscriptionId,
				set: {
					expiresAt: sql`${UserPayments.expiresAt} + interval '31 days'`
				}
			}).returning();

			await tx.update(Users).set({
				guildCredits: sql`${Users.guildCredits} + 1`
			}).where(eq(Users.id, userId)).returning();

			const response = await fetch(`${process.env.API_URL}/purger/user`, {
				method: "POST",
				body: JSON.stringify({
					"id": userId,
					"purgeAtMillis": payment.expiresAt.getTime() + (2 * 86400 * 1000)
				}),
				headers: {
					"Content-Type": "application/json"
				}
			});

			if (!response.ok) {
				await tx.rollback();
				return Promise.reject(new Error("Couldn't schedule the user for purging!"));
			}
		});
	} catch (error) {
		console.error(error);
		return Promise.reject(new Error(`An error has occurred while upgrading the user with id ${userId} and transaction id ${subscriptionId}!`));
	}
} 
import { boolean, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
	id: text("id").notNull().primaryKey(),
	username: text("username").notNull(),
	avatar: text("avatar"),
	guildCredits: integer("guild_credits").default(0).notNull(),
	deleting: boolean("deleting").default(false).notNull(),
	deleteAt: timestamp("deleteAt", {
		withTimezone: true,
		mode: "date"
	})
});

export type User = typeof Users.$inferSelect;

export const Sessions = pgTable("sessions", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id").notNull().references(() => Users.id, { onDelete: "cascade" }),
	accessToken: text("access_token").notNull(),
	refreshToken: text("refresh_token").notNull(),
	dtExpiresAt: timestamp("dt_expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull(),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});

export const GuildPayments = pgTable("guild_payments", {
	guildId: text("guild_id").notNull(),
	userId: text("user_id").notNull(),
	transactionDate: timestamp("transaction_date", {
		withTimezone: true,
		mode: "date"
	}).notNull(),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});

export type GuildPayment = typeof GuildPayments.$inferSelect;

export const PaymentStatus = pgEnum("payment_status", ["active", "canceled"]);
export const UserPayments = pgTable("user_payments", {
	subscriptionId: text("subscription_id").notNull().primaryKey(),
	userId: text("user_id").notNull(),
	transactionDate: timestamp("transaction_date", {
		withTimezone: true,
		mode: "date"
	}).notNull(),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull(),
	status: PaymentStatus("status").notNull()
});

export type UserPayment = typeof UserPayments.$inferSelect;
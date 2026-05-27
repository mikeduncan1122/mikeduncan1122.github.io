import { mysqlTable, mysqlSchema, AnyMySqlColumn, index, int, varchar, text, mysqlEnum, timestamp, boolean } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const users = mysqlTable("users", {
	id: int().autoincrement().notNull(),
	openId: varchar({ length: 64 }).notNull(),
	name: text(),
	email: varchar({ length: 320 }),
	loginMethod: varchar({ length: 64 }),
	role: mysqlEnum(['user','admin']).default('user').notNull(),
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp().defaultNow().onUpdateNow().notNull(),
	lastSignedIn: timestamp().defaultNow().notNull(),
},
(table) => [
	index("users_openId_unique").on(table.openId),
]);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const owner = mysqlTable("owner", {
	id: int().autoincrement().notNull(),
	username: varchar({ length: 255 }).notNull(),
	passwordHash: text().notNull(),
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp().defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("owner_username_unique").on(table.username),
]);

export type Owner = typeof owner.$inferSelect;
export type InsertOwner = typeof owner.$inferInsert;

export const settings = mysqlTable("settings", {
	id: int().autoincrement().notNull(),
	primaryColor: varchar({ length: 7 }).notNull(),
	secondaryColor: varchar({ length: 7 }).notNull(),
	accentColor: varchar({ length: 7 }).notNull(),
	backgroundColor: varchar({ length: 7 }).notNull(),
	textColor: varchar({ length: 7 }).notNull(),
	fontFamily: varchar({ length: 100 }).notNull(),
	backgroundStyle: varchar({ length: 50 }).notNull(),
	backgroundGradient: text(),
	showHero: boolean().notNull(),
	showFeatures: boolean().notNull(),
	showCTA: boolean().notNull(),
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp().defaultNow().onUpdateNow().notNull(),
});

export type Settings = typeof settings.$inferSelect;
export type InsertSettings = typeof settings.$inferInsert;

export const content = mysqlTable("content", {
	id: int().autoincrement().notNull(),
	heroHeadline: text().notNull(),
	heroSubheadline: text().notNull(),
	heroDescription: text().notNull(),
	heroCTAText: varchar({ length: 255 }).default('Get Started').notNull(),
	heroCTALink: varchar({ length: 500 }).default('#').notNull(),
	featuresTitle: text().notNull(),
	featuresDescription: text().notNull(),
	ctaTitle: text().notNull(),
	ctaDescription: text().notNull(),
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp().defaultNow().onUpdateNow().notNull(),
});

export type Content = typeof content.$inferSelect;
export type InsertContent = typeof content.$inferInsert;

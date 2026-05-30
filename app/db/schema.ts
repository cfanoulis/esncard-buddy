import { relations } from "drizzle-orm";
import { datetime, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm/sql/sql";

export const partnersTable = mysqlTable("partners", {
  id: int().autoincrement().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  partnercode: varchar({ length: 255 }).notNull(),
});

export const usersRelations = relations(partnersTable, ({ many }) => ({
  offers: many(offerTable),
}));

export const offerTable = mysqlTable("offers", {
  id: int().autoincrement().primaryKey(),
  partnerId: int("partner_id")
    .notNull()
    .references(() => partnersTable.id, { onDelete: "cascade" }),
  offerDescription: varchar("offer_description", { length: 127 }).notNull(),
});

export const offerRelations = relations(offerTable, ({ one, many }) => ({
  partner: one(partnersTable, {
    fields: [offerTable.partnerId],
    references: [partnersTable.id],
  }),
  redemptionEvents: many(redemptionEventTable),
}));

export const redemptionEventTable = mysqlTable("redemption_events", {
  id: int().autoincrement().primaryKey(),
  offerId: int("offer_id")
    .references(() => offerTable.id, { onDelete: "cascade" })
    .notNull(),
  redeemedAt: datetime("redeemed_at", {
    fsp: 0,
  })
    .notNull()
    .default(sql`NOW()`),
});

export const redemptionEventRelations = relations(
  redemptionEventTable,
  ({ one }) => ({
    offer: one(offerTable, {
      fields: [redemptionEventTable.offerId],
      references: [offerTable.id],
    }),
  }),
);

import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const schema = defineSchema({
  events: defineTable({
    type: v.literal('take_damage'),
    timestamp: v.number(),
    damage: v.object({
      amount: v.number(),
    }),
  }).index('by_timestamp', ['timestamp']),
});
export default schema;

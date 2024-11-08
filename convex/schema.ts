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
  gameState: defineTable({
    status: v.object({
      type: v.literal('started'),
      startedAt: v.optional(v.number()),
    }),
  }),
  barrierTimerState: defineTable({
    barrierState: v.union(v.literal('barrier_up'), v.literal('barrier_down')),
    maxTime: v.number(),
    nextTransition: v.object({
      at: v.number(),
      nextState: v.union(v.literal('barrier_up'), v.literal('barrier_down')),
    }),
  }),
});
export default schema;

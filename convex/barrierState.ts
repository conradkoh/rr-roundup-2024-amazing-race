import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const state = await ctx.db
      .query('barrierTimerState')
      .withIndex('by_creation_time')
      .order('desc')
      .first();
    return state;
  },
});

export const set = mutation({
  args: {
    barrierState: v.union(v.literal('barrier_up'), v.literal('barrier_down')),
    maxTime: v.number(),
    nextTransition: v.object({
      at: v.number(),
      nextState: v.union(v.literal('barrier_up'), v.literal('barrier_down')),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('barrierTimerState', {
      barrierState: args.barrierState,
      maxTime: args.maxTime,
      nextTransition: {
        at: args.nextTransition.at,
        nextState: args.nextTransition.nextState,
      },
    });
  },
});

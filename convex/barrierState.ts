import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const BARRIER_UP_INTERVAL = 30 * 1000;
export const BARRIER_DOWN_INTERVAL = 10 * 1000;

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

/**
 * This function can be called any number of times, but expected to trigger a state change only when latest state has expired
 */
export const tickToggle = mutation({
  args: {},
  handler: async (ctx) => {
    const LATENCY_BUFFER = 300; //500 ms
    const latestState = await ctx.db
      .query('barrierTimerState')
      .withIndex('by_creation_time')
      .order('desc')
      .first();
    if (!latestState) {
      return; //do nothing if there is not state
    }
    // check expiry
    if (latestState.nextTransition.at > Date.now()) {
      return; //do nothing if not needed
    }
    switch (latestState.barrierState) {
      case 'barrier_up': {
        await ctx.db.insert('barrierTimerState', {
          barrierState: 'barrier_down',
          maxTime: BARRIER_DOWN_INTERVAL,
          nextTransition: {
            at: Date.now() + LATENCY_BUFFER + BARRIER_DOWN_INTERVAL,
            nextState: 'barrier_up',
          },
        });
        break;
      }
      case 'barrier_down': {
        await ctx.db.insert('barrierTimerState', {
          barrierState: 'barrier_up',
          maxTime: BARRIER_UP_INTERVAL,
          nextTransition: {
            at: Date.now() + LATENCY_BUFFER + BARRIER_UP_INTERVAL,
            nextState: 'barrier_down',
          },
        });
        break;
      }
    }
  },
});

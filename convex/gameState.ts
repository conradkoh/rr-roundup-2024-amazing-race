import { mutation, query } from './_generated/server';
import { z } from 'zod';
import { BARRIER_UP_INTERVAL } from './barrierState';

export const start = mutation({
  args: {},
  handler: async (ctx) => {
    await ctx.db.insert('gameState', {
      status: {
        type: 'started',
        startedAt: Date.now(),
      },
    });
    // set the barrier to up initially
    await ctx.db.insert('barrierTimerState', {
      barrierState: 'barrier_up',
      maxTime: BARRIER_UP_INTERVAL,
      nextTransition: {
        at: Date.now() + BARRIER_UP_INTERVAL,
        nextState: 'barrier_down',
      },
    });
  },
});

export const stop = mutation({
  args: {},
  handler: async (ctx) => {
    const state = await ctx.db.query('gameState').collect();
    await Promise.all(state.map((e) => ctx.db.delete(e._id)));

    // clear the barrier state
    const barrierState = await ctx.db.query('barrierTimerState').collect();
    await Promise.all(barrierState.map((e) => ctx.db.delete(e._id)));
  },
});

export const reset = mutation({
  args: {},
  handler: async (ctx) => {
    // reset the game state
    const stateRows = await ctx.db.query('gameState').collect();
    await Promise.all(stateRows.map((e) => ctx.db.delete(e._id)));

    // clear the events
    const events = await ctx.db.query('events').collect();
    await Promise.all(events.map((e) => ctx.db.delete(e._id)));

    // clear the barrier state
    const barrierState = await ctx.db.query('barrierTimerState').collect();
    await Promise.all(barrierState.map((e) => ctx.db.delete(e._id)));
  },
});

export const get = query({
  args: {},
  handler: async (ctx): Promise<z.infer<typeof gameStateSchema>> => {
    const gameState = await ctx.db.query('gameState').first();
    if (gameState === null) {
      return {
        status: {
          type: 'ready',
        },
      };
    }
    return gameStateSchema.parse(gameState);
  },
});

// internal
const gameStateSchema = z.object({
  status: z.union([
    z.object({
      type: z.literal('started'),
      startedAt: z.number(),
    }),
    z.object({
      type: z.literal('ready'),
    }),
  ]),
});

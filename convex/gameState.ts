import { mutation, query } from './_generated/server';
import { z } from 'zod';

export const start = mutation({
  args: {},
  handler: async (ctx) => {
    await ctx.db.insert('gameState', {
      status: {
        type: 'started',
        startedAt: Date.now(),
      },
    });
  },
});

export const stop = mutation({
  args: {},
  handler: async (ctx) => {
    const state = await ctx.db.query('gameState').collect();
    await Promise.all(state.map((e) => ctx.db.delete(e._id)));
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
  },
});

export const get = query({
  args: {},
  handler: async (ctx): Promise<z.infer<typeof gameStateSchema>> => {
    let gameState = await ctx.db.query('gameState').first();
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

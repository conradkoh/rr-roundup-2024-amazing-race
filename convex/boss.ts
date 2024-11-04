import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const takeDamage = mutation({
  args: {
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert('events', {
      type: 'take_damage',
      timestamp: Date.now(),
      damage: {
        amount: args.amount,
      },
    });
  },
});

export const reset = mutation({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query('events').collect();
    await Promise.all(events.map((e) => ctx.db.delete(e._id)));
  },
});

export const health = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query('events').collect();
    const MAX_HEALTH = 100;
    const damageTaken = events
      .filter((e) => e.type === 'take_damage')
      .map((e) => e.damage.amount)
      .reduce((a, b) => a + b, 0);

    return {
      config: {
        maxHealth: MAX_HEALTH,
      },
      remainder: Math.max(MAX_HEALTH - damageTaken, 0),
    };
  },
});

export const eventLog = query({
  args: {},
  handler: async (ctx) => {
    const latest10Events = await ctx.db
      .query('events')
      .withIndex('by_timestamp')
      .order('desc')
      .collect();
    return latest10Events.map((e) => ({
      ...e,
      icon: e.type === 'take_damage' ? '💥' : '💤',
      text:
        e.type === 'take_damage'
          ? `Captain Chaos took ${e.damage.amount} damage`
          : '',
    }));
  },
});

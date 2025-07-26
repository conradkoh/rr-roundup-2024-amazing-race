import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
const MAX_HEALTH = 100;

export const takeDamage = mutation({
  args: {
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const events = await ctx.db.query('events').collect();
    const damageTaken = events
      .filter((e) => e.type === 'take_damage')
      .map((e) => e.damage.amount)
      .reduce((a, b) => a + b, 0);
    
    if (damageTaken === MAX_HEALTH) {
      return; //all health is taken
    }
    
    const wasAlive = damageTaken < MAX_HEALTH;
    let actualDamage = args.amount;
    
    if (damageTaken + args.amount >= MAX_HEALTH) {
      const remainingHealth = MAX_HEALTH - damageTaken;
      if (remainingHealth > 0) {
        actualDamage = remainingHealth;
        await ctx.db.insert('events', {
          type: 'take_damage',
          timestamp: Date.now(),
          damage: {
            amount: remainingHealth,
          },
        });
      }
    } else {
      await ctx.db.insert('events', {
        type: 'take_damage',
        timestamp: Date.now(),
        damage: {
          amount: args.amount,
        },
      });
    }

    // Check if the boss just died and update game state
    const newDamageTaken = damageTaken + actualDamage;
    if (wasAlive && newDamageTaken >= MAX_HEALTH) {
      const gameState = await ctx.db.query('gameState').first();
      if (gameState && gameState.status.type === 'started') {
        await ctx.db.delete(gameState._id);
        await ctx.db.insert('gameState', {
          status: {
            type: 'boss_defeated',
            startedAt: gameState.status.startedAt,
            defeatedAt: Date.now(),
          },
        });
      }
    }
  },
});

export const health = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query('events').collect();
    const damageTaken = events
      .filter((e) => e.type === 'take_damage')
      .map((e) => e.damage.amount)
      .reduce((a, b) => a + b, 0);

    const remainder = Math.max(MAX_HEALTH - damageTaken, 0);
    const isDead = remainder === 0;

    return {
      config: {
        maxHealth: MAX_HEALTH,
      },
      remainder,
      isDead,
    };
  },
});

export const getBossDeathInfo = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query('events').collect();
    const damageTaken = events
      .filter((e) => e.type === 'take_damage')
      .map((e) => e.damage.amount)
      .reduce((a, b) => a + b, 0);

    if (damageTaken < MAX_HEALTH) {
      return null; // Boss is not dead yet
    }

    // Find the event that killed the boss (brought total damage to MAX_HEALTH)
    const damageEvents = events
      .filter((e) => e.type === 'take_damage')
      .sort((a, b) => a.timestamp - b.timestamp);

    let cumulativeDamage = 0;
    let deathTimestamp = null;

    for (const event of damageEvents) {
      cumulativeDamage += event.damage.amount;
      if (cumulativeDamage >= MAX_HEALTH) {
        deathTimestamp = event.timestamp;
        break;
      }
    }

    return {
      deathTimestamp,
      totalDamage: damageTaken,
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

    return latest10Events.map((e) => {
      let desc = '';
      let icon = '';
      if (e.type === 'take_damage') {
        if (e.damage.amount === 5) {
          desc = '[HEADSHOT] ';
          icon = '💥';
        } else {
          icon = '➖';
        }
      }
      return {
        ...e,
        icon,
        text:
          e.type === 'take_damage'
            ? `${desc}Captain Chaos took ${e.damage.amount} damage`
            : '',
      };
    });
  },
});

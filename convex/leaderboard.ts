import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const addRecord = mutation({
  args: {
    teamName: v.string(),
    gameStartTime: v.number(),
    gameEndTime: v.number(),
  },
  handler: async (ctx, args) => {
    const completionTime = args.gameEndTime - args.gameStartTime;
    const createdAt = Date.now();

    const recordId = await ctx.db.insert('leaderboard', {
      teamName: args.teamName,
      completionTime,
      gameStartTime: args.gameStartTime,
      gameEndTime: args.gameEndTime,
      createdAt,
    });

    return recordId;
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const records = await ctx.db
      .query('leaderboard')
      .withIndex('by_completion_time')
      .order('asc')
      .collect();

    return records.map((record) => ({
      _id: record._id,
      teamName: record.teamName,
      completionTime: record.completionTime,
      gameStartTime: record.gameStartTime,
      gameEndTime: record.gameEndTime,
      createdAt: record.createdAt,
      rank: 0, // Will be calculated on frontend
    }));
  },
});

export const updateRecord = mutation({
  args: {
    id: v.id('leaderboard'),
    teamName: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      teamName: args.teamName,
    });
  },
});

export const deleteRecord = mutation({
  args: {
    id: v.id('leaderboard'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getTopRecords = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    
    const records = await ctx.db
      .query('leaderboard')
      .withIndex('by_completion_time')
      .order('asc')
      .take(limit);

    return records.map((record, index) => ({
      _id: record._id,
      teamName: record.teamName,
      completionTime: record.completionTime,
      gameStartTime: record.gameStartTime,
      gameEndTime: record.gameEndTime,
      createdAt: record.createdAt,
      rank: index + 1,
    }));
  },
});

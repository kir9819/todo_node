const queries = require('./queries');

module.exports = {
  insert: async (ctx, next) => {
    await queries.insertItem(ctx, next);
  },
  change: async (ctx, next) => {
    await queries.changeItem(ctx, next);
  },
  changeCheck: async (ctx, next) => {
    await queries.changeItemCheck(ctx, next);
  },
  remove: async (ctx, next) => {
    await queries.removeItem(ctx, next);
  }
}

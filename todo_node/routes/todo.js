const queries = require('./queries');

module.exports = {
  display: async (ctx, next) => {
    await queries.getAllItems(ctx, next);
  },
  removechecked: async (ctx, next) => {
    await queries.removeCheckedItems(ctx, next);
  },
  sort: async (ctx, next) => {
    await queries.sortItems(ctx, next);
  }
}

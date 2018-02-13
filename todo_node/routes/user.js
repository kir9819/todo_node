const queries = require('./queries');


module.exports = {
    create: async (ctx) => {
        await queries.createUser(ctx);
    },
    login: async (ctx, next) => {
        await queries.authorizeUser(ctx, next);
    },
    logout: async (ctx, next) => {
        await queries.discardUser(ctx, next);
    }
}
module.exports =  {
    Koa: require('koa'), // core
    Router: require('koa-router'), // routing
    bodyParser: require('koa-bodyparser'), // POST parser
    serve: require('koa-static'), // serves static files like index.html
    logger: require('koa-logger'), // optional module for logging
    passport: require('koa-passport'), //passport for Koa
    LocalStrategy: require('passport-local'), //local Auth Strategy
    JwtStrategy: require('passport-jwt').Strategy, // Strategy for auth via JWT
    ExtractJwt: require('passport-jwt').ExtractJwt, // ExtractJWT for auth via JWT
    jwt: require('jsonwebtoken'), // auth via JWT for hhtp
    socketioJwt: require('socketio-jwt'), // auth via JWT for socket.io
    socketIO: require('socket.io'),
    crypto: require('crypto'), // crypto module for node.js for e.g. creating hashes
    path: require('path'),
    jwtsecret: "mysecretkey"
};

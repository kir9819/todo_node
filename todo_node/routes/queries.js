const User          = require('./userSchema');
const Todo          = require('./todoSchema');
const requires      = require('../config/requires');


//-------------Passport Strategies--------------//

const passport = requires.passport;
passport.use(new requires.LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
 },
    function (email, password, done) {
        User.findOne({ email }, (err, user) => {
            if (err) {
                return done(err);
            }

            if (!user || !user.checkPassword(password)) {
                return done(null, false, { message: 'User does not exist or wrong password.' });
            }
            return done(null, user);
        });
    }
));

// Expect JWT in the http header
const jwtOptions = {
    jwtFromRequest: requires.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: requires.jwtsecret
};

passport.use(new requires.JwtStrategy(jwtOptions, function (payload, done) {
    User.findById(payload.id, (err, user) => {
        if (err) {
            return done(err, false)
        }
        if (user) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    });
}));




module.exports = {

  getAllItems: async (ctx, next) => {
    await passport.authenticate('jwt', async (err, user) => {
      if (user) {
        let sorting = ""; // порядок сортировки 1 или 0

        if (!ctx.cookies.get('sortName')) {
          sorting = "-beginningDateTime";
        }
        else {
          sorting = JSON.parse(ctx.cookies.get('order')) ? 
                    ctx.cookies.get('sortName') : "-" + ctx.cookies.get('sortName');
        }
    
        try {
          let todos = await Todo.find({userId : user.id}).sort(sorting).exec();
          //ВОТ ЭТО НАДО КАК ТО ВЕРНУТЬ
          ctx.body = todos;
          ctx.status = 200;
        }
    
        catch (er) {
          ctx.status = 400;
          ctx.body = err;
        }
      } else {
          ctx.body = "Token isn't true";
          ctx.status = 400;
      }
    })(ctx, next);
  },

  changeItem: async (ctx, next) => {
    await passport.authenticate('jwt', async (err, user) => {
      if (user) {
        try {
          let item = await Todo.findOne({ _id: ctx.request.body.id });
          item.name = ctx.request.body.name;
          item.check = JSON.parse(ctx.request.body.check);
          item.info = ctx.request.body.info;
          item.beginningDateTime = ctx.request.body.beginningDateTime;
          item.endDateTime = ctx.request.body.endDateTime;
          item.save();
          ctx.status = 200;
        }
        catch (err) {
          ctx.status = 400;
          ctx.body = err;
        }
      } else {
          ctx.body = "Token isn't true";
          ctx.status = 400;
      }
    })(ctx, next);
  },

  changeItemCheck: async (ctx, next) => {
    await passport.authenticate('jwt', async (err, user) => {
      if (user) {
        try {
          let item = await Todo.findOne({_id: ctx.request.body.id, userId : user.id});
          item.check = JSON.parse(ctx.request.body.check);
          item.save();
          ctx.status = 200;
        }
        catch (err) {
          ctx.status = 400;
          ctx.body = err;
        }
      } else {
          ctx.body = "Token isn't true";
          ctx.status = 400;
      }
    })(ctx, next);
  },

  removeItem: async (ctx, next) => {
    await passport.authenticate('jwt', async (err, user) => {
      if (user) {
        try {
          await Todo.remove( {_id: ctx.request.body.id, userId : user.id}, (err, r) => {
              if (err) throw err;
              ctx.status = 200;
            }
          )
        }
        catch (err) {
          ctx.status = 400;
          ctx.body = err;
        }
      } else {
          ctx.body = "Token isn't true";
          ctx.status = 400;
      }
    })(ctx, next);
  },

  insertItem: async (ctx, next) => {
    await passport.authenticate('jwt', async (err, user) => {
      if (user) {
        let item = {
          name: ctx.request.body.name,
          check: ctx.request.body.check,
          info: ctx.request.body.info,
          beginningDateTime: ctx.request.body.beginningDateTime,
          endDateTime: ctx.request.body.endDateTime,
          userId: user.id
        };
        
        try {
          await Todo.create(item);
          ctx.status = 200;
        }
        catch (err) {
          ctx.status = 400;
          ctx.body = err;
        }
      } else {
          ctx.body = "Token isn't true";
          ctx.status = 400;
      }
    })(ctx, next);
  },

  removeCheckedItems: async (ctx, next) => {
    await passport.authenticate('jwt', async  (err, user) => {
      if (user) {
        try {
          await Todo.remove( {check: true, userId : user.id}, (err, r) => {
              if (err) throw err;
              ctx.status = 200;
            }
          )
        }
        catch (err) {
          ctx.status = 400;
          ctx.body = err;
        }
      } else {
          ctx.body = "Token isn't true";
          ctx.status = 400;
      }
    })(ctx, next);
  },

  sortItems: async (ctx, next) => {
    await passport.authenticate('jwt', async  (err, user) =>  {
      if (user) {
        ctx.cookies.set('sortName', ctx.params.sortName);
        ctx.cookies.set('order', ctx.params.order);
        ctx.status = 200;
      } else {
        ctx.body = "Token isn't true";
        ctx.status = 400;
      }
    })(ctx, next);
  },

  createUser: async (ctx) => {
    try {
      await User.create(ctx.request.body);
      ctx.status = 200;
    }
    catch (err) {
      ctx.status = 400;
      ctx.body = err;
    }
  },

  authorizeUser: async (ctx, next) => {
    await passport.authenticate('local', function (err, user) {
      if (!user) {
          ctx.body = "Login failed";
      } else {
          //--payload - info to put in the JWT
          const payload = {
              id: user.id,
              displayName: user.displayName,
              email: user.email
          };
          const token = requires.jwt.sign(payload, requires.jwtsecret); //JWT is created here
          ctx.cookies.set('tokenJWT', 'JWT ' + token);
          ctx.status = 200;
      }
    })(ctx, next);
  },

  discardUser: async (ctx, next) => {
    await passport.authenticate('jwt', function (err, user) {
      if (user) {
          ctx.cookies.set('tokenJWT', 'NuN', {maxAge: -1});
          ctx.status = 200;
      } else {
          ctx.body = "Token isn't true";
          ctx.status = 400;
      }
    })(ctx, next);
  }


}

const todo           = require('./routes/todo'); 
const task           = require('./routes/task'); 
const userjs         = require('./routes/user'); 
const requires       = require('./config/requires');

const app = new requires.Koa();
const router = new requires.Router();

// middleware для обработки данных 

app.use(requires.cors({origin: '*'}))
    .use(requires.serve('public')) // static files located in `public` folder
    .use(requires.logger())
    .use(requires.bodyParser())
    .use(requires.passport.initialize()) // initialize passport first
    .use(router.routes())
    .use(router.allowedMethods());
    
const server = app.listen(3000, () => {
    console.log("Server is running on port 3000");
}); // launch server on port  3000



//-------------Routing---------------//

router.get('/', todo.display); 
router.post('/addtask', task.insert);
router.post('/changetask', task.change);
router.post('/changecheck', task.changeCheck);
router.post('/remove', task.remove);
router.post('/removechecked', todo.removechecked);
router.get('/sort/:sortName/order/:order', todo.sort);

router.post('/createuser', userjs.create);
router.post('/login', userjs.login);
router.post('/logout', userjs.logout);


//---Socket Communication-----//
let io = requires.socketIO(server);

io.on('connection', requires.socketioJwt.authorize({
    secret: requires.jwtsecret,
    timeout: 15000
})).on('authenticated', function (socket) {

    console.log('this is the name from the JWT: ' + socket.decoded_token.displayName);

    socket.on("clientEvent", (data) => {
        console.log(data);
    })
});

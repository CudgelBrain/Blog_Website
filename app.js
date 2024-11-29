 require('dotenv').config();  

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');

const connectDB = require('./public/server/config/db');
const {isActiveRoute} = require('./public/server/helpers/routeHelpers')
const session = require('express-session');
// const {Session} = require('express-session');

const app = express();
const PORT = 5000 || process.env.PORT;
// const PORT = process.env.PORT || 5000;


//Connect to db
connectDB();

app.use(express.urlencoded({ extended : true} ));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized:true,
    store: MongoStore.create({
        mongoUrl:process.env.MONGODB_URI
    })

    // cookie: {maxAge: new Date (Date.now() + (3600000)) }
}))

app.use(express.static('public'));


//templating engine
app.use(expressLayout);
app.set('layout','./layouts/main')
app.set('view engine','ejs')
app.set('views', './public/views');
app.use((req, res, next) => {
    res.locals.currentRoute = req.originalUrl; // This sets the current route globally
    next();
});


app.locals.isActiveRoute = isActiveRoute;

//basic route to test app

// app.get("", (req,res) => {
//     res.send("Hello World");
// })
app.use('/', require('./public/server/routes/main'));
app.use('/', require('./public/server/routes/admin'));

//tell all app to listen on this port no.

app.listen(PORT, () => {
    console.log(`Application is listening on PORT ${PORT}`);
})
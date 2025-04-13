const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate= require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users')

mongoose.connect('mongodb://localhost:27017/camp-together', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // // useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs',ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
    secret: 'changetoabettersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly: true,
        expires:Date.now() + 1000* 60 * 60 * 24 * 7,  //converting miliseconds to weeks
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); //ca sa nu fie nevoie sa dai login la fiecare request. !!!!!!!! Trebuie dupa "app.use(session(sessionConfig))"
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async(req,res)=>{
    const user = new User({email:'remus@gmail.com',username:'remus'})
    const newUser = await User.register(user,'remuus');
    res.send(newUser);
})

app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);


app.get('/', (req, res) => {
    res.render("home")
});

app.all('*',(req,res,next) => {
    next(new ExpressError('Page Not Found',404))
});


app.use((err,req,res,next) => {
    const {statusCode=500, message='Something is very wrong!!!!!'} = err;
    if(!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error.ejs', { err });
});

app.listen(3000, () => {
    console.log('Serving on port 3000!');
});
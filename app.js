require('dotenv').config();

const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');

const authRoutes = require('./routes/authRoutes');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');

    next();
});

app.use(authRoutes);


authRoutes.initializeSystem().then(() => {
    app.listen(
        process.env.PORT,
        () => console.log('Servidor rodando')
    );
});

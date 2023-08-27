const express = require('express')

const path = require('path')
const bodyParser = require('body-parser');
const app = express();
// added at 08/14/23
const flash = require('connect-flash');
const session = require('express-session');

app.use(bodyParser.urlencoded({ extended:false }))
app.use(bodyParser.json())

const appRoutes = require("./routes/approutes")

// handlebars configuration
const handlebars = require("express-handlebars")
const handlebars_mod = require("handlebars")

const { allowInsecurePrototypeAccess } = require ("@handlebars/allow-prototype-access")

app.engine('handlebars', handlebars.engine({ 
	defaultLayout: false,
	handlebars: allowInsecurePrototypeAccess(handlebars_mod)
}));


// flash data settings
app.use(session({
	secret: "a_any_key_for_this_project",
	resave: false,
	saveUninitialized: false
}))
app.use(flash())

// view settings
app.set('views', path.join("./views"))
app.set('view engine','handlebars')
// middlewere to treat flash messages
app.use((req,res,next) => {
	res.locals.success_msg = req.flash("success_msg")
	res.locals.error_msg = req.flash('error_msg')
	res.locals.errors = req.session.errors
	next()
})

app.use('/users', (req, res, next) => {
	console.log('will run before users route');
	next();
});

app.use(appRoutes)

app.listen(3000, () => {
	console.log('app is running');
});

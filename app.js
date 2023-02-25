var createError = require("http-errors");
var express = require("express");
require("./models/connection"); // BDD
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var articlesRouter = require("./routes/articles");

var app = express();
const stripe = require("stripe")(
	"sk_test_51LvlTKGYA9pH077iKWsk8cTpoWRJZ8ireROEJfHF63mQpnyKAtinTyrTPKUU3AFiIgshKYzvOnQjBJDNjv9AEOl800XKoiR7cF"
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.post("/create-payment-intent", async (req, res, next) => {
	const items = req.body.items;

	const calculateOrderAmount = (cart) => {
		var orderAmount = 0;
		for (var i = 0; i < cart.length; i++) {
			orderAmount += (cart[i].price * 100);
			console.log("amount?", orderAmount);
		}
		return orderAmount;
	};
	
	if (calculateOrderAmount(items) > 0) {
	// Create a PaymentIntent with the order amount and currency
	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: calculateOrderAmount(items),
			currency: "cad",
			automatic_payment_methods: {
				enabled: true,
			},
		});
	
		res.send({
			clientSecret: paymentIntent.client_secret,
			amount: paymentIntent.amount,
		});
	} catch (error) {
		console.log('it fucked up', error)
	}
	
} else {
	res.send({ error: 'Le Panier est vide'})
}
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/articles", articlesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;

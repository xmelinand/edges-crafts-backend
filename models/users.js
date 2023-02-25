var mongoose = require("mongoose");

var addressSchema = mongoose.Schema({
	number: String,
	street: String,
    info: String,
	zipcode: String,
    region: String,
	country: String,
});

var userSchema = mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
    password: String,
	token : String,
	phone: String,
	address: addressSchema,
	admin: Boolean,
	basket:[{ type: mongoose.Schema.Types.ObjectId, ref: "articles" }],
});

var UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;

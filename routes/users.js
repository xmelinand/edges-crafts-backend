var express = require("express");
const UserModel = require("../models/users");
var router = express.Router();
var bcrypt = require("bcrypt");
var uid2 = require("uid2");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});

//SIGN-UP
router.post("/create-user", async function (req, res, next) {
	var userFind = await UserModel.findOne({ email: req.body.email });
	if (!userFind) {
		try {
			const cost = 10;
			const hash = bcrypt.hashSync(req.body?.password, cost);

			var newUser = new UserModel({
				firstName: req.body?.firstName,
				lastName: req.body?.lastName,
				email: req.body?.email,
				password: hash,
				token: uid2(32),
				phone: req.body?.phone,
				address: {
					number: req.body?.nb,
					street: req.body?.street,
					info: req.body?.info,
					zipcode: req.body?.zipcode,
					region: req.body?.region,
					country: req.body?.country,
				},
				admin: false,
			});
			const newUserSaved = await newUser.save();
			console.log(newUserSaved);
			var success = true;
			res.status(200).json({
				success,
				newUser: newUserSaved,
				userToken: newUserSaved.token,
			});
		} catch (error) {
			console.log("fuck you", error);
		}
	}
	if (userFind) {
		var message = "e-mail déjà utilisé.";
		var success = false;
    console.log('util trouvé', message)
		res.status(200).json({ success, error: message });
	}
});

// SIGN-IN
router.post("/sign-in", async function (req, res, next) {
  var error;
  var passOk = false;
  var logged = false;
  var errPwd = "Le mot de passe est invalide.";
  var errMail = "L'email est invalide.";
  var password = req.body?.password;

	console.log("checking request", req.body.email);
	var userFound = await UserModel.findOne({ email: req.body.email });
	if(userFound){
  console.log("found user! name =>", userFound.firstName);
  if (bcrypt.compareSync(password, userFound.password)) {
		passOk = true;
    console.log("pass ok")
	}
  }

  if (!userFound) {
		error = errMail;
	} else if (userFound && !passOk) {
		error = errPwd;
	} else if (userFound && passOk) {
		logged = true;
	}

  if(logged){
	// RES.JSON
	res.json({ userFound, logged, userToken: userFound.token });
  } else {
    console.log("err", error)
    res.json({error:error})
  }
});

module.exports = router;

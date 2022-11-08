var express = require('express');
const UserModel = require('../models/users');
var router = express.Router();
var bcrypt = require('bcrypt');
var uid2 = require('uid2');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/create-user', async function(req, res, next) {
  try {
    const cost = 10;
    const hash = bcrypt.hashSync(req.body?.password, cost);


		var newUser = new UserModel({
      
        firstName: req.body?.firstName,
        lastName: req.body?.lastName,
        email: req.body?.email,
        password: hash,
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
		res.status(200).json({ success, newUser: newUserSaved });
	} catch (error) {
		console.log(error);
	}
})

module.exports = router;


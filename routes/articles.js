var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const { find } = require("../models/articles");
var ArticleModel = require("../models/articles");

router.post("/add-item", async (req, res, next) => {
	try {
		var newItem = new ArticleModel({
			name: req.body?.name,
			description: req.body?.description,
			category: req.body?.category,
			pic: req.body?.pic,
			price: req.body?.price,
			sold: false,
		});
		const newItemSaved = await newItem.save();
		console.log(newItemSaved);
		var success = true;
		res.json({ success, addedArticle: newItemSaved });
	} catch (error) {
		console.log(error);
	}
});

router.get("/load-articles", async (req, res, next) => {
	try {
		let articles = await ArticleModel.find();
		var success = true;
		res.json({ success, articles });
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;

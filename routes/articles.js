var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const { find } = require("../models/articles");
var ArticleModel = require("../models/articles");
var cloudinary = require("cloudinary").v2;
var fs = require("fs");
var uniqid = require("uniqid");
const { CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

cloudinary.config({
	cloud_name: CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
});

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
		// console.log(newItemSaved);
		var success = true;
		res.status(200).json({ success, addedArticle: newItemSaved, message:`${newItem.name} à été ajouté avec succès!` });
	} catch (error) {
		res.status(500).json(error);
	}
});
router.delete("/delete-item", async (req, res, next) => {
	var success = false;
	try {
		var itemFound = await ArticleModel.findById(req.body.itemId);
		await ArticleModel.deleteOne( { _id: itemFound._id } );
		success = true;
		res.status(200).json({ success, message: ` L'objet "${itemFound.name}" a été supprimé avec succès!` });
	} catch (error) {
		res.status(500).json(error);
	}
});

router.get("/load-articles", async (req, res, next) => {
	try {
		let articles = await ArticleModel.find();
		var success = true;
		res.status(200).json({ success, articles });
	} catch (error) {
		res.status(500).json(error);
	}
});
router.post("/filter-articles", async (req, res, next) => {
	try {
		// loads all articles from database
		let articles = await ArticleModel.find();
		var filters = req.body?.filters;

		// filters articles from database and send selected ones
		if (filters.length > 0) {
			var filteredArticles = [];
			articles.forEach(function (item) {
				for (var cat of item.category) {
					if (filters.includes(cat)) {
						filteredArticles.push(item);
					}
				}
			});
			var success = true;
			res.status(200).json({ success, articles: filteredArticles });
		} else {
			// if no filters, send all articles
			res.status(200).json({ success, articles });
		}
	} catch (error) {
		res.status(500).json(error);
	}
});

router.post("/upload-image", async function (req, res, next) {

		var imagePath = "./tmp/" + uniqid() + ".jpg";
		console.log('dick', req.body);
		// var resultCopy = await req.files.file.File.mv(imagePath);

		// if (!resultCopy || resultDetection.result) {
		// 	var resultCloudinary = await cloudinary.uploader.upload(imagePath);
		// 	fs.unlinkSync(imagePath);s
		// }
		res.json({
			// url:resultCloudinary,
			result:req.body.file
		});
});

module.exports = router;

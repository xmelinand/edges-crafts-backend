var mongoose = require("mongoose");

var articleSchema = mongoose.Schema({
    name: String,
    category: Array,
    description: String,
    price: Number,
    pic: String,
    sold: Boolean,
});

var ArticleModel = mongoose.model("articles", articleSchema);

module.exports = ArticleModel;
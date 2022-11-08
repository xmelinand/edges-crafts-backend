var mongoose = require("mongoose");

var categorySchema = mongoose.Schema({
    name: String    
});

var CategoryModel = mongoose.model("categories", categorySchema);

module.exports = CategoryModel;
var mongoose = require("mongoose");

var orderSchema = mongoose.Schema({
    user: String,
    articles : [{ type: mongoose.Schema.Types.ObjectId, ref: "articles" }],
    amount: Number,
    deliveryAddress: {},
    shipped: Boolean,
    delivered: Boolean,
    orderDate: Date,
});

var OrderModel = mongoose.model("orders", orderSchema);

module.exports = OrderModel;
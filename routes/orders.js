var express = require("express");
const OrderModel = require("../models/orders");
const ArticleModel = require("../models/articles");
const { find } = require("../models/users");
const UserModel = require("../models/users");
var router = express.Router();

function dateFormat(date){
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
  }

/* GET users listing. */
router.get("/check", function (req, res, next) {
	res.send("fuck you");
});

router.get('/load-orders', async function (req, res , next){
    
    try {
        const orders = await OrderModel.find();
        if(orders){
        const success = true;
        res.status(200).json({success, orders:orders})
        } else {
            res.status(200).json({message: "Aucune commande passée."})
        }
    } catch (error) {
        console.log(error);
    }

})

router.post("/add-order", async function (req, res, next) {
    const user = await UserModel.findOne({ _id: req.body.user._id })
    // .populate({ path:'users', select: 'firstName lastName' });
    const articles = [];
    for (var i=0; i<req.body.cart.length; i++){
        let article = await ArticleModel.findOne({ _id: req.body.cart[i]._id });
        articles.push(article);
    }
    console.log('cartArtciles',  articles);
    const orderDate = new Date(Date.now());
    console.log('date', orderDate);


    var newOrder = new OrderModel({
        user: `${user.firstName} ${user.lastName}`,
        articles : articles,
        amount: req.body?.amount,
        deliveryAddress: req.body?.address,
        shipped: false,
        delivered: false,
        orderDate: orderDate,
    });
    const newOrderSaved = await newOrder.save();
    console.log('order', newOrderSaved)

    const updatedUser = await UserModel.findOneAndUpdate(
        { _id: req.body.user._id },
        { $push: { orders:  newOrderSaved._id  } }
     )
	res.json({ message: 'Fuck you it worked',
     savedOrder:newOrderSaved, 
    //  updatedUser
    });
});



module.exports = router;

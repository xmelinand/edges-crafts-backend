var express = require('express');
var router = express.Router();


router.get('/check', function(req, res, next){
  var check = 'suce bite';
  res.json({ check :check})
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json("index");
});



module.exports = router;

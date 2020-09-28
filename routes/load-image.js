var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('load-image', { title: 'Load Image',  });
// res.end('Hi there!')
});

module.exports = router;

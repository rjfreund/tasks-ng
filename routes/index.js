var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/landing-page/landing-page.html'));
});

router.get('*', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/layout/layout.html'));
});

module.exports = router;
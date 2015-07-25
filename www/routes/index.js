/// <reference path="../typings/moment/moment.d.ts""/>
/// <reference path="../typings/mongoose/mongoose.d.ts" />

var express = require('express');
var router = express.Router();
var modelpost = require('../models/Post');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  var page = 1;//current page
  var skip = (page -1) * 5;
  modelpost
    .find({publish: true}, {_id: 1, titulo: 1, introduccion: 1, fecha: 1})
    .sort({fecha: 'desc'})
    .limit(5)
    .skip(skip)
    .find(function (err, doc) {
      if(err) next(err);
      
      console.log(doc.length);
      
      res.render('index', {count: doc.length, pager: {pre: page, current: page, next: page + 1}, post: doc, moment : function (fecha) {
        return moment(fecha).format('LL');
      } });
    });
  
});

router.get('/page/:page', function (req, res, next) {
  var page = parseInt(req.params.page);
  var skip = (page -1) * 5;
  modelpost
    .find({publish: true}, {_id: 1, titulo: 1, introduccion: 1, fecha: 1})
    .sort({fecha: 'desc'})
    .limit(5)
    .skip(skip)
    .find(function (err, doc) {
      if(err) next(err);
      
      res.render('index', { count: doc.length, pager: {pre: page -1, current: page, next: page +1}, post: doc, moment : function (fecha) {
        return moment(fecha).format('LL');
      } });
    });
  
});

/*GEt post*/
router.get('/post/:id', function (req, res, next) {
  modelpost.findOne({_id : req.params.id}, function (err, obj) {
    
   if(err) next(err);
   console.log(obj);
   res.render('post', {post: obj, moment: function (fecha) {
     return moment(fecha).format('LL');
   }});
  });
});

module.exports = router;

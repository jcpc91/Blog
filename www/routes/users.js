/// <reference path="../typings/moment/moment.d.ts""/>
/// <reference path="../typings/mongoose/mongoose.d.ts" />

var express = require('express');
var mongoose = require('mongoose');
var modelpost = require('../models/Post');
var moment = require('moment');

var router = express.Router();

router.use(function(req, res, next){
    
    if(!req.isAuthenticated())
            res.redirect('/login');
    
   next();
});

/* GET posts. private/ */
router.get('/', function(req, res, next) {
    console.log(req.user);
    modelpost
    .find()
    .limit(5)
    .sort({fecha : -1})
    .find(function(err, obj){
        
        res.render('user', {
            posts: obj, 
            moment: moment,
            lang: req.headers['accept-language']});
    });
});

//nuevo post private/post
router.get('/post', function(req, res, next){
    res.render('postForm', {
        cmd: 'new', 
        post: {}, 
        lang: req.headers['accept-language']});
});

//crear o modificar o eliminar un post
router.post('/post', function(req, res, next){
    console.log(req.body);
    var fecha = moment(req.body.fecha, 'DD/MM/YYYY').utc().toDate();
    var tags = req.body.tags instanceof Array? req.body.tags : [req.body.tags];
    var status = req.body.status == "true"? true : false;//indica si el post es publico 
    var post = {
                titulo : req.body.titulo,
                introduccion : req.body.introduccion,
                html : req.body.html,
                fecha: fecha,
                tags : tags,
                publish:  status
            };
    if(req.body.cmd == 'new'){
        
        modelpost.create(post, function(err, obj){
            if(err){
                console.log(err);
                return next(err);
            }
            //obj.fecha = moment(obj.fecha
            
            res.render('postForm', {cmd: 'update', post: obj });
        });
    }else if(req.body.cmd == 'update'){
        post._id = req.body.id;
        modelpost.update({_id: post._id}, post, function(err, obj){
            if(err){
                console.log(err);
                next(err);
            }
            
            res.render('postForm', {cmd: 'update', post: post });
        });
    }else if(req.body.cmd == 'delete'){
        modelpost.remove({_id: req.body.id}, function(err){
            if(err) next(err);
            
            res.redirect('/private');
        });
    }else if(req.body.cmd == 'publish'){
        post._id = req.body.id;
        modelpost.update({_id: req.body.id}, {publish: req.body.publish}, function (err, rows, obj) {
           if(err) next(err);
           console.log(req.body);
           
           var publish = parseInt(req.body.publish) == 1? true : false;//convertir a entero porque jade no reconoce
           post.publish =  publish;
           res.render('postForm', {cmd: 'update', post: post});
           
        });
    }
    
    
});
//getidpost
router.get('/post/:id', function(req, res, next){
    
    modelpost.findById(req.params.id, function(err, obj){
        console.log(obj);
        if(err) return next(err);
        
        console.log(obj);
        res.render('postForm', {cmd: 'update', post: obj, moment: moment});
    });
});

router.get('/posts', function(req, res, next){
    var page = 1;//current page
    var skip = (page -1) * 10;
    modelpost
        .find({}, {_id: 1, titulo: 1, fecha: 1, publish: 1})
        .limit(10)
        .skip(skip)
        .find(function (err, doc) {
            
            if(err) next(err);
            
            res.render('posts', {
                    count: doc.length,
                    pager: {pre: page, current: page, next: page + 1}, 
                    posts: doc, moment: function (fecha) {
                        return moment(fecha).format('L');
                }
            });    
        });
    
    
});

router.get('/posts/page/:page', function (req, res, next) {
   var page = parseInt(req.params.page);
   var skip = (page -1) * 10;
   
   modelpost
        .find({}, {_id: 1, titulo: 1, fecha: 1, publish: 1})
        .limit(10)
        .skip(skip)
        .find(function (err, doc) {
            
            if(err) next(err);
            
            res.render('posts', {
                count: doc.length,
                pager: {pre: page - 1, current: page, next: page + 1}, 
                posts: doc, moment: function (fecha) {
                    return moment(fecha).format('L');
                }
            });    
        });
});


router.get('/logout', function(req, res, next){
    console.log('logout');
    req.logout();
    console.log(req.user);
    res.redirect('/private/login');
});

module.exports = router;

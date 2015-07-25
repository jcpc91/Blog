var express = require('express');
var aws = require('aws-sdk');
var mongoose = require('mongoose');
var modelimg = require('../models/Imagen');

aws.config.loadFromPath('./AWS.config');

var router = express.Router();
var s3 = new aws.S3();

router.use(function(req, res, next){
	
	modelimg.find({}, {_Id:1, Key: 1, nombreOriginal: 1, link: 1}, 
		function(err, data){
			if(err) next(err);
		
			req.imagenes = data;
			next();
		});
	
});

router.get('/', function(req, res, next){
	
	res.render('imagenes', {img: req.imagenes });
		
});

router.post('/', function (req, res, next) {
	var cmd = req.body.cmd;
	
	switch(cmd){
		case "upload":
		{
			var file = req.files.imagen;
	
			if(file.buffer.length <= 2048000){
		      s3.putObject({
		          Key: file.name,
		          Bucket: 'blog-001',
		          ContentType: file.mimetype,
		          Body: file.buffer
		        },function(err, data){
		          if(err){
		            console.error(err);
					next(err);
		          }
				  
				  var img = {
					  Key: file.name,
					  nombreOriginal: file.originalname,
					  mimetype: file.mimetype,
					  link: 'http://s3-us-west-1.amazonaws.com/blog-001/' + file.name,
					  extension: file.extension,
					  bucket: 'blog-001',
					  etag: data.ETag,
					  fecha: Date.now()
				  };
				  modelimg.create(img, function(err, obj){
					 if(err){
						 console.error(err);
						 next(err);
					 } 
					 
					 req.imagenes.push(img);
					 res.render('imagenes', {img: req.imagenes});
				  });
				  
		        });
				
				
		    }else{
				res.status(500);
				res.render('error', {
					message: 'Arvhivo muy grande < 2mb',
					error: {}
				});
			}
		}break;
		case "delete":
		{
			console.log('delete');
			var imagenes = req.body.imagen;
			
			modelimg.find(
				{_id: {$in : imagenes}}, 
				{Key: 1, _id: -1},
				function(err, data){
					if(err) next(err);
					
					console.log(data);
					
					var objs = [];
					for(var i = 0; i < data.length; i++){
						
						objs.push({Key : data[i].Key});
					}
					console.log(objs);
					
					s3.deleteObjects({
						Bucket: 'blog-001',
						Delete: {
							Objects: objs,
						},
					}, function(err, data){
						if(err) next(err);
						console.log(data);
						modelimg.remove({_id: {$in : imagenes}}, 
						function(err, data){
							if(err) next(err);
							
							console.log(data);
							res.render('imagenes', {img: req.imagenes});
						});
						
						
					});
					
					
				});
			
			
		}break;
			
	}
	
	
});
module.exports = router;
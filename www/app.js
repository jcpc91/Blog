/// <reference path="typings/node/node.d.ts"/>
/// <reference path="typings/mongoose/mongoose.d.ts/>

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');
var session = require('express-session');
var passport = require('passport');
var twitterStrategy = require('passport-twitter').Strategy;
var Usuario = require('./models/User');

var routes = require('./routes/index');
var users = require('./routes/users');
var img = require('./routes/imagenes');




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('e6b348c5'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use(multer({ limits: {files: 1}, inMemory: true }));
app.use(session({ 
    secret: 'e6b348c5', 
    resave: false, 
    saveUninitialized: false, 
    unset: 'destroy'}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use(['/private', '/user'], users);
app.use('/private/imagenes', img);

passport.use(new twitterStrategy({
    consumerKey: 'hcuWkDLfy5QGyhHYFWu4kaqHp',
    consumerSecret: 'MuBZMXB6XIX95usnOCXdZ8v5GI7A9vWUT85EnXw8Jqt6i83Xve',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
}, function(token, tokensecret, profile, done){
    
    
    
    var user = new Usuario().validar(profile);
    
    
    user.find(function (err, data) {
      
      if(err)  return done(err);
      
      if(data != undefined && data.length > 0){
        var u = data[0];
        
        if(!u.access) 
          return done(null, false, {message: 'No tiene permiros para acceder'});
        
        return done(null, u);
        
      } else{
        return done(null, false, {message: 'Nombre de usuario no registrado'});
      }
        
     
    });
    
    
}));

passport.serializeUser(function(user, done) {
    
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    
    done(null, user);
});


app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
        passport.authenticate('twitter', 
          	{successRedirect: '/private', failureRedirect: '/login'}));

app.get('/login', function(req, res, next){
  console.log(req.path);
  res.render('login');
});

mongoose.connect('mongodb://localhost/blog', function(err){
    if(err)
        console.error('Conection error: ', err);
    else
        console.log('Connection success ');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

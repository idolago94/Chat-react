var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var redis = require('redis');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Create Client
var client = redis.createClient();
var sub = redis.createClient();

var server = require('http').createServer(app);

var io = require('socket.io')(server);
io.on('connection', function (socket) {  
  console.log('socket connect!!');
  socket.on('openChat', (chat) => {
    sub.subscribe(chat.channelToOpen);

    socket.on('sendMsg', function(newMsg) {
      client.publish(chat.channelToOpen, JSON.stringify(newMsg));
    });
    
    sub.on('message', (pattern, key) => {
      socket.emit('receiveMsg', { channel: pattern, message: JSON.parse(key) });
    });
  
    socket.on('closeChannel', (user) => {
      sub.unsubscribe(user);
    });

    
  });
  socket.on('userConnect', () => {
      io.emit('loadUsers');
  });
  socket.on('userLogout', () => {
    io.emit('loadUsers');
  });
});

server.listen(8888);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;

const express = require('express');
const bodyParser = require('body-parser');　//　解析到来的请求
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
const passport = require('passport');
mongoose.Promise = global.Promise;

const router = require('./router');
const config = require('./config/db');

const db_url = `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/${config.db}`;
// DB
// 加上 { useMongoClient: true } 避免mongoose警告提示
mongoose.connect(db_url, { useMongoClient: true }, function (ignore, connection) {
    connection.onOpen()
  }).then(() => {
    console.log('mongodb connected');
  })
  .catch(console.error)
/* mongoose.connect(db_url, (err) => {
    if (err) {
        console.log('could not connect to database: ', err);
    } else {
        console.log('Connected to database: ', config.db);
    }
}); */


//　中间件
app.use(morgan('dev')); // 日志 还有 combined
app.use(bodyParser.urlencoded({
    extended: false
  }));
  
// parse application/json
app.use(bodyParser.json())

// initialize passport for use
app.use(passport.initialize());


router(app);

// server setup
const port = process.env.PORT || 3090;

app.listen(port, function() {
    console.log('server is ok')
}) 
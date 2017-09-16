const express = require('express');
const bodyParser = require('body-parser');　//　解析到来的请求
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
mongoose.Promise = global.Promise;

const router = require('./router');
const config = require('./config/db');

const db_url = `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/${config.db}`;
// DB
mongoose.connect(db_url, (err) => {
    if (err) {
        console.log('could not connect to database: ', err);
    } else {
        // console.log(config.secret);
        console.log('Connected to database: ', config.db);
    }
});

// app.get('*', (err, res) => {
//     res.write()
// })

//　中间件
app.use(morgan('combined')); // 日志
app.use(bodyParser.json({type: '*/*'}));
router(app);

// server setup
const port = process.env.PORT || 3090;

app.listen(port, function() {
    console.log('server is ok')
}) 
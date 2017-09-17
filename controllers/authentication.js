/**
 * status: 0表示失败， 1表示成功
 * msg 表示附加的信息
 */
const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config/secret');

const secret = config.secret; // jwt中使用的secret

// 对用户进行编码
function tokenForUser(user) {
    const timestamp = new Date().getTime();
    /**
     * 下面是jwt payload中的一些属性 
     * sub: 表示 subject，包含用户的技术标识符
     * iat: issueAtTime 表示创建jwt的时间
     * iss: issue 表示发证实体，即验证服务器信息
     * exp: token过期时间戳
     */
    return jwt.encode({
        sub: user.id,
        iat: timestamp
    }, secret);
}

/**
 * 注册
 */
exports.signup = function (req, res, next) {
    const {email, password} = req.body;
    console.log('email', email)

    // 如果没有填写email或者password
    if (!email || !password) {
        return res.status(422).send({
            status: 0,
            msg: 'email和password是必填的'
        })
    }

    User.findOne({
        email
    }, (err, existingUser) => {
        if (err) {
            return next(err);
        }

        // 如果该email已经存在
        if (existingUser) {
            // 422 表示
            return res.status(422).send({
                status: 0,
                msg: 'Email已经存在'
            });
        }

        // email未被注册
        const user = new User({
            email,
            password
        });

        // 保存到数据库
        user.save((err) => {
            if (err) {
                return next(err);
            }

            console.log(tokenForUser(user))
            res.json({
                token: tokenForUser(user)
            });
        })
    })
}

/**
 * 登录
 */

exports.signin = function(req, res, next) {
    // User has already had their email and password auth'd
    // We just need to give them a token
    res.send({ token: tokenForUser(req.user) });
  }
// exports.signin = function(req, res, next) {
//     // 用户已经认证通过
//     // 返回token给用户
//     // console.log(req)
//     res.send({
//         token: tokenForUser(req.body)
//     })
// }
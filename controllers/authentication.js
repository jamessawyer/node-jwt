/**
 * status: 0表示失败， 1表示成功
 * msg 表示附加的信息
 */
const User = require('../models/user');

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

            res.json({
                status: 1,
                msg: '注册成功'
            });
        })
    })
}
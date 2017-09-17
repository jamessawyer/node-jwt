/**
 * password-jwt: https://github.com/themikenicholson/passport-jwt
 */
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const config = require('../config/secret');
const User = require('../models/user');

/**
 * #3 用password 使用 jwt strategy
 */
module.exports = function(passport) {

    // local strategy
    const localOptions = {
        usernameField: 'email'
    };

    const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
        User.findOne({email}, (err, user) => {
            if (err) {
                return done(false);
            }

            if (!user) {
                return done(null, false);
            }

            // 比较密码
            user.comparePwd(password, (err, isMatch) => {
                if (err) {
                    return done(err);
                }

                if (!isMatch) {
                    return done(null, false);
                }

                return done(null, user);
            })
        })
    })

    /**
     * #1 jwt strategy 配置信息
     */
    // 
    const jwtOptions = {
        // jwtFromRequest: ExtractJwt.fromAuthHeader(),
        jwtFromRequest: ExtractJwt.fromHeader('authorization'),
        secretOrKey: config.secret
    };

    /**
     * #2 创建 jwt strategy
     * 回调函数参数
     * payload: 表示jwt中的payload (jwt = header + payload + signature)
     * done: 函数，对策略进行处理
     */

    const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
        User.findById({id: payload.sub}, (err, user) => {
            if (err) {
                done(err, false);
            }

            if (user) { // 如果找到该用户
                done(null, user);
            } else { // 没找到
                done(null, false);
            }
        })
    })
    passport.use(jwtLogin);
    passport.use(localLogin);
}

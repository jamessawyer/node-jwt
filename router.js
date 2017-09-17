const Authentication = require('./controllers/authentication');
const passport = require('passport');
const passportService = require('./services/passport');

passportService(passport);

// 对请求进行验证的中间件
const requestAuth = passport.authenticate('jwt', { session: false });
const requestSignin = passport.authenticate('local', { session: false });


module.exports = function(app) {

    app.get('/', requestAuth, (req, res) => {
        return res.send({
            status: 1,
            msg: '验证成功'
        })
    })

    app.post('/signin', requestSignin, Authentication.signin);
    // app.post('/signin', Authentication.signin);

    app.post('/signup', Authentication.signup);
}
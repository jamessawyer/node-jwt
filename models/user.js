const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs'); // 加密
const Schema = mongoose.Schema; // Schema可以理解为对数据的描述
mongoose.Promise = global.Promise;


// 1.定义model
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
});

// mongodb 'save' Hook 
// 保存用户前， 对密码进行加密
userSchema.pre('save', function(next) {
    // 将this赋值给user 使我们能够使用user model
    // user是user model的实例 这样我们就可以访问 this.email this.password等属性
    const user = this;

    if (this.isModified('password') || this.isNew) {
        // 产生salt
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(err);
            }
    
            // 使用salt对password进行hash（即加密）
            bcrypt.hash(user.password, salt, null, (err, hash) => {
                if (err) { return next(err); }
    
                // 将hash赋给密码 从而达到加密的目的
                user.password = hash;
                next();
            })
        })
    }
})

// 比较密码
userSchema.methods.comparePwd = (candidatePwd, callback) => {
    bcrypt.compare(candidatePwd, this.password, (err, isMatch) => {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
        console.log('验证密码');
    })
}

// 2.创建model class
const ModelClass = mongoose.model('User', userSchema);

// 3.export model
module.exports = ModelClass;

// 或者写为
// module.exports = mongoose.model('User', userSchema)
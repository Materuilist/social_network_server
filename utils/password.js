const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = {
    async encrypt(rawPassword){
        return await bcrypt.hash(rawPassword, 12);
    },
    async passwordsMatch(rawPassword, userLogin){
        const encPassword = (await User.findOne({login:userLogin})).password;
        return await bcrypt.compare(rawPassword, encPassword);
    }
}
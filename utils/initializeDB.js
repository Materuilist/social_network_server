const User = require('../models/user');

module.exports = async function(){
    await User.deleteMany();

    await User.create({
        login:'materuilist',
        password:'borow123'
    })
} 
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    userName: {type: String},
    userPassword: {type: String}
});   
    
module.exports = mongoose.model('User', userSchema);

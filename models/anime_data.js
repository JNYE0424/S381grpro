var mongoose = require('mongoose');

var animeSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    animeName: {type: String},
    originalRun: {type: String},
    director: {type: String},
    language:{type: String},
    studio:{type: String},
    episodes:{type: Number},
    genre:{type: String},
    cartoonist:{type: String}
});
    
    
    
    
module.exports = mongoose.model('Anime', animeSchema);

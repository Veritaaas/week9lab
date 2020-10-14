let mongoose = require('mongoose');
let actorSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required:true
    },
    bYear:{
        validate:{
            validator:function(newYear){
                if (Number.isInteger(newYear))
                    return true;
                else return false
            },
            message:'Birth year should be integer'
        },
        type:Number,
        required:true
    },
    movies:[{
        type:mongoose.Schema.ObjectId,
        ref:'Movie'
    }]
});
module.exports = mongoose.model('Actor',actorSchema);
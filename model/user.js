const mongoose = require("mongoose")


var userSchema = mongoose.Schema({
    username: {
        type:String, 
        required: true,
        minlength:3,
        trim : true,
        unique: true
    },
    password:{
        type:String,
        required: true,
        minlength:4
    },
    description:{
        type:String
        
    },
    post:{
        post: [{type: mongoose.Schema.ObjectId, ref: 'Post'}]
    }
})

var User = mongoose.model("user", userSchema )

module.exports = {
    User
}
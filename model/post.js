const mongoose = require("mongoose")


var postSchema = mongoose.Schema({
    title: {
        type:String, 
        required: true,
        minlength:3,
        trim : true
    },
    description:{
        type:String,
        required: true,
        minlength:5
    },
    photo:{
        data: Buffer,
        contentType:String
    },
    username:{
        users: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
    },
    status:{
        type: String,
        required: true
    },
    sharedto:{
        type: String,
        minlength: 3
    },
    tags:{
        tag: [{type: mongoose.Schema.ObjectId, ref:'Post'}]
    }
})

var Post = mongoose.model("post", postSchema )

module.exports = {
    Post
}
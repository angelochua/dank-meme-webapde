const mongoose = require("mongoose")

var tagSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    username:{
        type: Array,
        limit: 1,
        items: userSchema
    },
    post:{
        type: Array,
        items: postSchema
    }
})

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
    Udescription:{
        type:String
        
    },
    post:{
        type: Array,
        items: postSchema
    }
})

var postSchema = mongoose.Schema({
    title: {
        type:String, 
        required: true,
    },
    description:{
        type:String,
        required: true,
        minlength:5
    },
    
    filename: String,
    
    originalfilename: String,
    
    username:{
        type: Array,
        items: userSchema
    },
    
    status:{
        type: String
    },
    
    sharedto:{
        type: String
    },
    
    tags:{
        type: Array,
        items: tagSchema
    }
    
}, 
{
    timestamps: true
})

var Post = mongoose.model("post", postSchema )

module.exports = {
    Post
}
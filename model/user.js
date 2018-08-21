const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

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
        users: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
    },
    
    status:{
        type: String
    },
    
    sharedto:{
        type: String,
        minlength: 3
    },
    
    tags:{
        tag: [{type: mongoose.Schema.ObjectId, ref:'Post'}]
    }
    
}, 
{
    timestamps: true
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
        post: {type: Array,
              items: postSchema}
    }
})



var User = mongoose.model("user", userSchema )

module.exports = {
    User
}
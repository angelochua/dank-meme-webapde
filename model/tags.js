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
    Udescription:{
        type:String
        
    },
    post:{
        post: {type: Array,
              items: postSchema}
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
        type: String,
        required: true
    },
    
    status:{
        type: String
    },
    
    sharedto:{
        type: String,
        minlength: 3
    },
    
    tags:{
        type: Array,
        items: String
    }
    
}, 
{
    timestamps: true
})

var tagSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    post:{
        type: Array,
        items: postSchema
    }
})

var Tags = mongoose.model("tags", tagSchema)

module.exports = {
    Tags
}

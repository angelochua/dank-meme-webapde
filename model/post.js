const mongoose = require("mongoose");

var postSchema = mongoose.Schema({
    title:{
        type: String, 
        required: true
    },
    filename : String,
    originalname: String,
    privacy: String,
    author  : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    authorname: String,
    tags:{
        type: Array, 
        items: String
    },
    shareto:{
        type: Array, 
        items: String
    }
})

var Post = mongoose.model("post", postSchema)

exports.getAll = function(){
    
  return new Promise(function(resolve, reject){
      
    Post.find().then((posts)=>{
      resolve(posts)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.getByTag = function(tag){
    
  return new Promise(function(resolve, reject){
   var matchedPosts = [];
      
    Post.find().then((posts)=>{
      var allPosts = posts
        
      for (i = 0; i < allPosts.length; i++) { 
         var tags = allPosts[i].tags
          
         if (matchedPosts != undefined && tags.includes(tag))
             matchedPosts.push(allPosts[i])  
      } 
        
      resolve(matchedPosts)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.get = function(id){
  return new Promise(function(resolve, reject){
      
    Post.findOne({_id:id}).then((post)=>{
      resolve(post)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.create = function(post){
  return new Promise(function(resolve, reject){
    var p = new Post(post)

    p.save().then((newPost)=>{
      resolve(newPost)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.edit = function(id, update){
  return new Promise(function(resolve, reject){
      
    Post.findOneAndUpdate({
      _id : id
    }, update, {
      new : true
    }).then((newPost)=>{
      resolve(newPost)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.delete = function(id){
  return new Promise(function(resolve, reject){
    Post.remove({
      _id : id
    }).then((result)=>{
      resolve(result)
    }, (err)=>{
      reject(err)
    })
  })
}
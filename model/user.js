const mongoose = require("mongoose")
const crypto = require("crypto")

var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    description: String
})

userSchema.pre("save", function(next){
  this.password = crypto.createHash("md5").update(this.password).digest("hex")
  next()
})

var User = mongoose.model("user", userSchema)

exports.create = function(user){
  return new Promise(function(resolve, reject){
    var u = new User(user)
    
    u.save().then((newUser)=>{
      resolve(newUser)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.getOtherUsers = function(user){
  return new Promise(function(resolve, reject){
   var otherUsers = [];
    
    User.find().then((users)=>{
      var allUsers = users
        
      for (i = 0; i < allUsers.length; i++) { 
         if (allUsers[i].username != user.username)
             otherUsers.push(allUsers[i])  
      } 
      resolve(otherUsers)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.authenticate = function(user){
  return new Promise(function(resolve, reject){
      
    User.findOne({
      username : user.username,
      password : crypto.createHash("md5").update(user.password).digest("hex")
    }).then((user)=>{
      resolve(user)
    },(err)=>{
      reject(err)
    })
  })
}

exports.get = function(id){
  return new Promise(function(resolve, reject){
      
    User.findOne({_id:id}).then((user)=>{
      resolve(user)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.getAll = function(){
  return new Promise(function(resolve, reject){
      
    User.find().then((users)=>{
      resolve(users)
    }, (err)=>{
      reject(err)
    })
  })
}
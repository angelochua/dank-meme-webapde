const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const User = require("../model/user")
const Post = require("../model/post")
const app = express()

const urlencoder = bodyparser.urlencoded({
  extended : true
})
router.use(urlencoder)
var currentLoggedIn
//////////////////////////////////////////////////////////////// START OF ROUTES

router.post("/login", (req,res)=>{
    res.render("login.hbs")
})

router.post("/signup", (req,res)=>{
    res.render("signup.hbs")
})


router.post("/register", (req, res)=>{
  console.log("[POST] /user/register")
    
  

  var user = {
    username : req.body.username,
    password : req.body.password,
    description : req.body.description
  }

  User.create(user).then((user)=>{
     console.log("User Registration Successful")
     console.log(user)
      
     req.session.username = user.username
     currentLoggedIn = user
       Post.getAll().then((posts)=>{
         res.render("home-user.hbs", {
             posts
         })
      })
  }, (error)=>{
        console.log("ERROR")
        res.render("index.hbs", {  
            error: "User Registration Failed"
        })
  })
})

router.post("/signin", (req, res)=>{
  console.log("[POST] /user/login")
    
  var username = req.body.username
  var password = req.body.password
    
  var remember = req.body.remember
  if (remember == "on"){
        var username = req.body.username
        var password = req.body.password
        res.cookie("remember", remember, {         
            maxAge : 21*24*60*60*1000          
        })  
        res.cookie("username", username, {         
            maxAge : 21*24*60*60*1000          
        }) 
        res.cookie("password", password, {         
            maxAge : 21*24*60*60*1000          
        }) 
  }
    
  let user = {
    username : username,
    password : password
  }
   
  User.authenticate(user).then((newUser)=>{
    console.log("User Found")
    console.log(newUser)
      
    if(newUser){
       req.session.username = user.username
       currentLoggedIn = newUser

       Post.getAll().then((posts)=>{
         res.render("home-user.hbs", {
             posts
         })
      })
    }
  }, (error)=>{
        console.log("ERROR")
        res.render("index.hbs", {  
            error: "Wrong credentials. Try again."
        })
  })
})

module.exports = router

//////////////////////////////////////////////////////////////// CURRENT USER (WORKS LIKE A GETTER)
var exports = module.exports
exports.getCurrentUser = function() {
    return currentLoggedIn
}
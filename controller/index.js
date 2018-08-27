const express = require("express")
const router = express.Router()
const app = express()
const Post = require("../model/post")
const User = require("../model/user")

const cookieparser = require("cookie-parser")
const bodyparser = require("body-parser")
var urlencoder = bodyparser.urlencoded({
    extended: false 
})

router.use("/post", require("./post"))
router.use("/user", require("./user"))

var publicDir = require('path').join(__dirname,'/public')
router.use(express.static(publicDir))

//////////////////////////////////////////////////////////////// START OF ROUTES
router.use("/", urlencoder, (req, res, next) => {
    res.locals.remember = "off"
    
    if(req.cookies.remember)           
        res.locals.remember=req.cookies.remember   
    if(req.cookies.username)           
        res.locals.username=req.cookies.username   
    if(req.cookies.password)           
        res.locals.password=req.cookies.password   

    next()
})

router.get("/", function(req, res){
  console.log("[GET] Lead to home page")
  Post.getAll().then((posts)=>{
    res.render("index.hbs", {
      posts
    })
  })  
})
router.get("/home", function(req, res){
  console.log("[GET] Lead to home page")
  Post.getAll().then((posts)=>{
    res.render("index.hbs", {
      posts
    })
  })  
})
router.get("/home-user", function(req, res){
  console.log("[GET] Lead to user homepage")
  var username = req.session.username    
    
  Post.getAll().then((posts)=>{
    if (req.session.username) {   
        console.log(posts)
        res.render("home-user.hbs", {
          posts
        })
    }
  })
    
})
router.post("/profile", (req, res)=>{
  console.log("[POST] /user/profile")
  var controllerUser = require("./user")
  var currentLoggedIN = controllerUser.getCurrentUser() 
  
  var user = currentLoggedIN
  var description1 = controllerUser.getDescription
  
  console.log(description1)
  
  if (currentLoggedIN != undefined || currentLoggedIN!= null){
    Post.getAll().then((posts)=>{
       User.getOtherUsers(user).then((users)=>{
          res.render("profile.hbs", {
              user, posts, users
          })
       })
    })  
  }
})
router.get("/logout", function(req, res){
  console.log("[GET] Lead to home")
  console.log(req.session.username + 's session succesfully destroyed')
    
  req.session.destroy((err) => {      
      if (err) {
          console.log(err)
      } 
  })
    
  Post.getAll().then((posts)=>{
    res.render("index.hbs", {
      posts
    })
  })  
})

router.post("/login" , function(req,res){
    console.log("/OPEN LOGIN.HBS")
    res.render("login.hbs")
})

router.post("/signup" , function(req,res){
    console.log("/OPEN signup.HBS")
    res.render("signup.hbs")
})

router.post("/upload" , function(req,res){
    console.log("/OPEN upload.HBS")
    User.getAll().then((users)=>{
        console.log("PASOK " + users)
       res.render("upload.hbs", {
         users
      })
    }) 
})

module.exports = router
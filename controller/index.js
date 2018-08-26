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


router.get("/login", function(req, res){
  console.log("go to login page")
  res.render("login.hbs") 
})

router.get("/signup", function(req, res){
  console.log("go to login page")
  res.render("signup.hbs") 
})

router.get("/userhome", function(req, res){
  console.log("go to signup page")
  var username = req.session.username    
    
  Post.getAll().then((posts)=>{
    if (req.session.username) {       
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

module.exports = router
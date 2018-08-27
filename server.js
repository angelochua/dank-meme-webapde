const path = require("path")
const express = require("express")
const mongoose = require("mongoose")
const hbs  = require("hbs")
const session = require("express-session")
const cookieparser = require("cookie-parser")

const bodyparser = require("body-parser")
var urlencoder = bodyparser.urlencoded({
    extended: false 
})

const app = express()
app.set("view-engine", "hbs");
app.use(cookieparser())

app.use(express.static(require('path').join(__dirname,'/public')))
app.use(express.static(require('path').join(__dirname,'/controller')))
var currentUserLoggedIn

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/DANK",{
    useNewUrlParser: true
})

app.use(session({
  secret : "secret",
  name : "secretname",
  resave: true,
  saveUninitialized :true,
    
  cookie: {
    maxAge: 21*24*60*60*1000 //3 weeks
  }
}))

app.use(require("./controller/index"))
app.use(require("./controller/post"))
app.use(require("./controller/user"))

app.listen(process.env.PORT ||3000, () => {  
    console.log("[LISTEN] Running in port 3000")
})
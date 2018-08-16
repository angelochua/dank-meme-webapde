/*
express
body-parser
hbs
mongoose
*/

/***** IMPORTS **********/
const express = require("express")
const mongoose = require("mongoose")
const hbs = require("hbs")
const bodyparse = require("body-parser")
const fs = require("file-system")
const multer = require("multer")
const path = require("path")


/***** SCHEMA *******/
const {Post} = require("./model/post.js")
const {User} = require("./model/user.js")
const {Tag} = require("./model/tags.js")

/******SETUP*******/
const app = express()
const urlencoder = bodyparse.urlencoded({
    extended: false
})
app.set("view-engine", "hbs")
//app.use(express.static(__dirname + "/css/"))
app.use(express.static(__dirname + "/public/"))
app.use(express.static(__dirname + "/views/"))
app.use(express.static(__dirname + "/css/"))
app.use(express.static(__dirname + "/memiges/"))



/*****MONGOOSE******/
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/meme",{
    useNewUrlParser: true
})



/*****ROUTES*********/
app.get("/", (req, res)=>{
    console.log("/home")
    
    //process -find all foods from mongoose
    Post.find().then((posts)=>{
        res.render("index.hbs",{
            posts
        })
    }, (err)=>{
        res.render("index.hbs",{
        error: "Somthing went wrong, try again"
    })
    })
    
})

app.post("/home", (req, res)=>{
    console.log("/home")
    
    //process -find all foods from mongoose
    Post.find().then((posts)=>{
        res.render("index.hbs",{
            posts
        })
    }, (err)=>{
        res.render("index.hbs",{
        error: "Somthing went wrong, try again"
    })
    })
    
})

app.get("/viewpost", urlencoder, (req,res)=>{
    console.log("GET/ viewpost " + req.query.id)
    
    Post.findOne({
        _id: req.query.id
    }).then((post)=>{
        res.render("edit.hbs", {
            post
        })
    })
    
})



app.get("/delete", urlencoder, (req,res)=>{
    console.log("Post /delete" + req.query.id)
    
    Post.remove({
        _id :req.query.id
    }).then(()=>{
        res.render("profile.hbs")
    })
})

app.post("/add", urlencoder, (req, res)=>{
    console.log("post/ add")
    
    // input -- get name , cuisine, price
    var title = req.body.title
    var description = req.body.description
    var photo = req.body.photo
    var status = req.body.status
    
    //process -- add to db
    //new Food({name, cuisine, price}).save()
    var p = new Post({
        title, description, photo, status
    })
    
    p.save().then((newPost)=>{
      //things went right  
        res.render("upload.hbs",{
            message: "SUCCESSFULLY ADDED " + newPost.title
        })
    }, (err)=>{
      //things went wrong   
        res.render("upload.hbs",{
            error : "Something went wrong" + err
        })
    })
    //output -- success / fail
})

app.post("/login", urlencoder, (req, res)=>{
    
    console.log("post/ login")
    res.render("login.hbs")
   
})



app.post("/signup", urlencoder, (req, res)=>{
    console.log("post/ signup")
    
    res.render("signup.hbs")
    
})


app.post("/signin", urlencoder, (req, res)=>{
    console.log("post/ signin")
    
    //check login here
    
    var username = req.body.username
    
    Post.find().then((posts)=>{
        res.render("home-user.hbs",{
            posts, username
        })
    }, (err)=>{
        res.render("home-user.hbs",{
        error: "Somthing went wrong, try again"
    })
    })
   
})

app.post("/search", urlencoder, (req, res)=>{
    
    
    var tag = req.body.tags
    
    console.log("post/ search " + tag)
    
    Post.find().then((posts)=>{
        res.render("search.hbs",{
            posts, tag
        })
    }, (err)=>{
        res.render("search.hbs",{
        error: "Somthing went wrong, try again"
    })
    })
   
})

app.post("/search-user", urlencoder, (req, res)=>{
    
    
    var tag = req.body.tags
    
    console.log("post/ search-user " + tag)
    
    Post.find().then((posts)=>{
        res.render("search-user.hbs",{
            posts, tag
        })
    }, (err)=>{
        res.render("search-user.hbs",{
        error: "Somthing went wrong, try again"
    })
    })
   
})

app.get("/meme2.html", (req,res)=>{
    
    res.sendFile(path.join(__dirname, "meme2.html"))
    
    
})

app.get("/dom-user.html", (req,res)=>{
    
    res.sendFile(path.join(__dirname, "dom-user.html"))
    
    
})

app.get("/dom2.html", (req,res)=>{
    
    res.sendFile(path.join(__dirname, "dom2.html"))
    
    
})



app.get("/meme2-user.html", (req,res)=>{
    
    res.sendFile(path.join(__dirname, "meme2-user.html"))
    
    
})

app.post("/profile", urlencoder, (req, res)=>{
    console.log("post/ profile")
    
    Post.find().then((posts)=>{
        res.render("profile.hbs",{
            posts
        })
    }, (err)=>{
        res.render("profile.hbs",{
        error: "Somthing went wrong, try again"
    })
    })
   
})

app.post("/upload", urlencoder, (req, res)=>{
    console.log("post/ upload")
    
    res.render("upload.hbs")
   
})

app.post("/register", urlencoder, (req, res)=>{
    console.log("post/ register")
   
    var username = req.body.username
    var password = req.body.password
    var description = req.body.description
    
    console.log(username + "  " + password + " " + description)
    
    var n = new User({
        username, password, description
    })
    
    n.save().then((newUser)=>{
        res.render("login.hbs",{
            message: "successfully registered  " + newUser.username
        })
    }, (err)=>{
        res.render("signup.hbs",{
            error: "username/password invalid  " + err       
            })
    })
   
})

app.post("/edit", urlencoder, (req,res)=>{
    console.log("post/edit" + req.body.id)
    
    let newPost = {
        title: req.body.title,
        description : req.body.description,
        photo: req.body.photo
    }
    
    Post.findOneAndUpdate({
        _id: req.body.id
    },newPost).then((post)=>{
        res.render("home-user.hbs",{
            post
        })
    })
})

app.post("/home-user", urlencoder, (req, res)=>{
    console.log("post/ home-user")
    
    //process -find all foods from mongoose
    Post.find().then((posts)=>{
        res.render("home-user.hbs",{
            posts
        })
    }, (err)=>{
        res.render("home-user.hbs",{
        error: "Somthing went wrong, try again"
    })
    })
   
})





app.post("/logout", (req, res)=>{
    console.log("post/ logout")
    
    res.redirect("/")
   
})




/*****LISTEN********/
app.listen(3000)
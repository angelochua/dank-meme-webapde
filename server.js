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
app.use(express.static(require('path').join(__dirname,'/controllers')))
var currentUserLoggedIn

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/10GAG",{
    useNewUrlParser: true
})

app.use(session({
  secret : "secret",
  name : "secretname",
  resave: true,
<<<<<<< HEAD
  saveUninitialized :true,
=======
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));
*/

var currentUserLoggedIn

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


/*
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
*/

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
    
    var uname = req.body.username
    var pword = req.body.password
    
    
    Post.find().then((posts)=>{
            console.log(posts)
    }, (err)=>{
        console.log(err)
    })

    
    User.findOne({
        username: uname,
        password: pword
    }).then((u)=>{
        res.render("home-user.hbs",{
            username: uname
        })
    }, () => {
        res.render("login.hbs", {
            error: "user/pass incorrect"
        })
    })
    
    currentUserLoggedIn = uname
    console.log(currentUserLoggedIn)
    
    
    
    /*
    Post.find().then((posts)=>{
        res.render("home-user.hbs",{
            posts, username
        })
    }, (err)=>{
        res.render("home-user.hbs",{
        error: "Somthing went wrong, try again"
    })
    })
   */
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
>>>>>>> 1e3c6b5b3b22a72239366883306e7c0a2f50ba04
    
  cookie: {
    maxAge: 21*24*60*60*1000 //3 weeks
  }
<<<<<<< HEAD
}))
=======
})
*/    
    

    var username = req.body.username
    var password = req.body.password
    var description = req.body.description
    
    var hashedpassword = crypto.createHash("md5").update(password).digest("hex")
    console.log(hashedpassword)
    
    console.log(username + "  " + password + " " + description)
    
    password = hashedpassword
    
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
    
    currentUserLoggedIn = username

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

// this should be in controller post
// we use the multer middleware where
// "img" must match the name attribute of the <input type="file">
// we can access what multer saved through the req.file object
// req.file.filename = name that multer assigned to the saved image
// req.file.originalname = original name of the file from user's computer
app.post("/add", urlencoder ,upload.single("photo"),(req, res)=>{
  console.log(req.body.title)
  console.log(req.body.description)
  console.log(req.file.filename)
  console.log(req.file.originalfilename)
    
    var title = req.body.title
    var description = req.body.description
    var status = req.body.status
    var username = currentUserLoggedIn
    var tags = req.body.tags.split('#')
    tags.splice()
    
console.log(title + " " + username + " " + tags + " " + status)    

  // multer saves the actual image, and we save the filepath into our DB
  var p = new Post({
      title: req.body.title,
      filename : req.file.filename,
      originalfilename : req.file.originalname,
      description,
      username, 
      tags
    })

  p.save().then((doc)=>{
      res.render("upload.hbs", {
        title : doc.title,
        id : doc._id
      })
      console.log(p)
    })
})
/*
  User.findOneAndUpdate({
      username: currentUserLoggedIn
  }//,{
    //  console.log(p)
      //$push: {post : {p}}
  //}
  ).then((user)=>{
      res.render("upload.hbs")
  }, ()=>{
      console.log("error")
      res.render("upload.hbs")
  })
*/

// this should be in controller post
app.get("/photo/:id", (req, res)=>{
  console.log(req.params.id)
  Post.findOne({_id: req.params.id}).then((doc)=>{
    fs.createReadStream(path.resolve(UPLOAD_PATH, doc.filename)).pipe(res)
  }, (err)=>{
    console.log(err)
    res.sendStatus(404)
  })
})





app.post("/logout", (req, res)=>{
    console.log("post/ logout")
    
    res.redirect("/")
   
})


>>>>>>> 1e3c6b5b3b22a72239366883306e7c0a2f50ba04

app.use(require("./controller/index"))
app.use(require("./controller/post"))
app.use(require("./controller/user"))

app.listen(3000, () => {  
    console.log("[LISTEN] Running in port 3000")
})
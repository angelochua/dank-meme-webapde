const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const hbs = require("hbs")
const path = require("path")
const multer = require("multer")
const fs = require("fs")
const User = require("../model/user")
const Post = require("../model/post")
var controllerUser = require("./user")

const app = express()
const urlencoder = bodyparser.urlencoded({
  extended : true
})
router.use(urlencoder)

const UPLOAD_PATH = path.join(__dirname, '../uploads')
const upload = multer({
  dest: UPLOAD_PATH,
  limits: {
    fileSize : 10000000,
    files : 2
  }
})

/************ START OF ROUTES ***************/
router.post("/", urlencoder, (req, res)=>{  
  console.log(" go to /post/")
    
  Post.create(post).then((post)=>{
    Post.getAll().then((posts)=>{
      res.render("index.hbs", {
         posts
      })
    })
  },(error)=>{
    res.render("index.hbs")
  })
})

router.post("/search", (req, res)=>{
    console.log(" go to /post/search")
    tag = req.body.tags
    console.log(tag)
    
    Post.getByTag(tag).then((posts)=>{
      res.render("search.hbs", {
         posts, tag
      })
    })  
})

router.post("/search-user", (req, res)=>{
    console.log("go to /post/search-user")
    tag = req.body.tags
     console.log(tag)
    Post.getByTag(tag).then((posts)=>{
      res.render("search-user.hbs", {
         posts, tag
      })
    })  
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

router.post("/add", upload.single("filename"),(req, res)=>{
  console.log(" go to /post/add")
    
    var controllerUser = require("./user")
    var currentLoggedIN = controllerUser.getCurrentUser() 
    var currentuserID = currentLoggedIN._id
    var currentusername = currentLoggedIN.username
    var check = req.body.filename
    
    
    
    var tags = req.body.tags
    parsedTags = tags.split(" ")
    if (parsedTags.includes("")){
        var notNeeded = parsedTags.indexOf("")
        parsedTags.splice(notNeeded)
    }
    
    var newpost = {
        title : req.body.title,
        filename : req.file.filename,
        originalname : req.file.originalname,
        privacy : req.body.privacy, 
        description: req.body.description,
        author: currentuserID,
        authorname: currentusername,
        tags: parsedTags,
        shareto: req.body.shareto
    }
    console.log(newpost + "=====>CREATED")
    
    Post.create(newpost).then((post)=>{
       Post.getAll().then((posts)=>{
            res.render("home-user.hbs", {
               posts, 
               id : post._id
            })
        })
     },(error)=>{
       alert("Oops! There was an error in uploading!")
       res.render("profile.hbs") 
     }) 
})

router.get("/photo/:id", (req, res)=>{
  console.log("[GET] /photo/:id")
    
  Post.get(req.params.id).then((doc)=>{
    fs.createReadStream(path.resolve(UPLOAD_PATH, doc.filename)).pipe(res)
  }, (err)=>{
    console.log(err)
    res.sendStatus(404)
  })
})

router.get("/delete", urlencoder, (req, res) => {
	console.log("go to /deletepost " + req.query.id)
	
	Post.delete(req.query.id).then((result) => {
		res.redirect("/home-user")
	})
})

router.get("/viewpost", urlencoder, (req, res) => {
	console.log(" go to /viewpost" + req.query.id)
	
	Post.get(req.query.id).then((post) => {
		User.getAll().then((users)=>{
        res.render("edit.hbs", {
			post,users
		}) 
      })
        
	})
})

router.get("/viewmemes", urlencoder, (req, res) => {
	console.log(" go to /viewmemes " + req.query.id)
	
	Post.get(req.query.id).then((post)=>{
        res.render("meme.hbs",{
            post
        })
    })
})


router.post("/edit", urlencoder, (req, res) => {
	console.log("go to /edit" + req.body.id)
	
    var controllerUser = require("./user")
    var currentLoggedIN = controllerUser.getCurrentUser() 

    var user = currentLoggedIN
    
    var tags = req.body.tags
    parsedTags = tags.split(" ")
    if (parsedTags.includes("")){
        var notNeeded = parsedTags.indexOf("")
        parsedTags.splice(notNeeded)
    }

	let newPost = {
		title: req.body.title,
		tags: parsedTags,
		privacy: req.body.privacy,
        description: req.body.description,
        shareto: req.body.shareto
	}
    
    Post.edit(req.body.id, newPost).then(() => {
        Post.getAll().then((posts)=>{
            User.getOtherUsers(user).then((users)=>{
                res.render("profile.hbs", {
                   user, posts, users
                })
            })
        }) 
    })
})

module.exports = router

/************ HBS FUNCTIONS ***************/
/************ THIS IS FOR SORTING OUT  ***************/
/************ PRIVATE OR PUBLIC ***************/
/************ POSTS ***************/
hbs.registerHelper('checkprivacy', function(p1, p2, options) { /******** THIS IS TO DISPLAY IF THE POST IS PUBLIC IN INDEX.HBS***************/
    if(p1 == p2) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
})

hbs.registerHelper('checkprivacyforuserhome', function(p1, p2, shareto, authorname, options) { /******** THIS IS TO DISPLAY IF THE POST IS PUBLIC IN HOME-USER.HBS PLUS CHECK IF THE POST IS SHARED TO YOU ***************/
    console.log(shareto)
    
    var controllerUser = require("./user")
    var currentLoggedIN = controllerUser.getCurrentUser() 
    var currentusername = currentLoggedIN.username
    
    if(p1 != p2 && shareto.includes(currentusername) || p1 == p2 || authorname == currentusername) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
})


hbs.registerHelper('sort', function(authorid, options) {  /******** THIS IS TO DISPLAY ALL YOUR POST IN PROFILE.HBS***************/
      
    var controllerUser = require("./user")
    var currentLoggedIN = controllerUser.getCurrentUser() 
    var currentuserID = currentLoggedIN._id 
    
    if (currentLoggedIN != undefined || currentLoggedIN!= null){
        if(authorid.toString() == currentuserID.toString()) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }

    }
})
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

//////////////////////////////////////////////////////////////// START OF ROUTES
router.post("/", urlencoder, (req, res)=>{  
  console.log("[POST] /post/")
    
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
    console.log("[POST] /post/search")
    tag = req.body.tags
    console.log(tag)
    
    Post.getByTag(tag).then((posts)=>{
      res.render("search.hbs", {
         posts, tag
      })
    })  
})

router.post("/search-user", (req, res)=>{
    console.log("[POST] /post/search-user")
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
  console.log("[POST] /post/upload")
    
    var controllerUser = require("./user")
    var currentLoggedIN = controllerUser.getCurrentUser() 
    var currentuserID = currentLoggedIN._id
    var currentusername = currentLoggedIN.username
    
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
	console.log("[POST] /deletepost " + req.body.id)
	
	Post.delete(req.body.id).then((result) => {
		res.send(result)
	})
})

router.get("/viewpost", urlencoder, (req, res) => {
	console.log("[GET] /viewpost" + req.query.id)
	
    
    
    
	Post.get(req.query.id).then((post) => {
		User.getAll().then((users)=>{
        res.render("edit.hbs", {
			post,users
		}) 
      })
        
	})
})

router.post("/edit", urlencoder, (req, res) => {
	console.log("[POST] /edit" + req.body.id)
	
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
		privacy: req.body.privacy
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

//////////////////////////////////////////////////////////////// HBS FUNCTIONS
hbs.registerHelper('checkprivacy', function(p1, p2, options) { //this hbs function filters the posts by privacy (in home and user view)
    if(p1 == p2) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
})

hbs.registerHelper('checkprivacyforuserhome', function(p1, p2, shareto, authorname, options) { //this hbs function filters the posts by privacy (in home and user view)
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

hbs.registerHelper('checkifyousharedit', function(authorname, options) { //this hbs function filters the posts by privacy (in home and user view)
    var controllerUser = require("./user")
    var currentLoggedIN = controllerUser.getCurrentUser() 
    var currentusername = currentLoggedIN.username
    
    if(currentusername == authorname) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
})

hbs.registerHelper('filter', function(authorid, options) {  //this hbs function filters the posts by author (in profile view)
      
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
const mongoose = require("mongoose")

var TagSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    posts: {
        type: Array
    }
})

var Tag = mongoose.model("tags", TagSchema)


exports.create = function (tag) {
    return new Promise(function (resolve, reject) {
        console.log(tag)
        var u = new Tag(tag)

        u.save().then((newTag) => {
            console.log(newTag)
            resolve(newTag)
        }, (err) => {
            reject(err)
        })
    })
}

exports.getAll = function () {
    return new Promise(function (resolve, reject) {
        Tag.find().then((posts) => {
            resolve(posts)
        }, (err) => {
            reject(err)
        })
    })
}

exports.pushPost = function (tag, post) {
    return new Promise(function (resolve, reject) {
        Tag.findOneAndUpdate({
            name: tag
        }, {
            $push: {
                posts: post
            }
        }).then((updated) => {
            resolve(updated)
        }, (err) => {
            reject(err)
        })
    })

}

exports.findTag = function (name) {
    return new Promise(function (resolve, reject) {
        Tag.findOne({
            name: name,
        }).then((tag) => {
            resolve(tag)
        }, (err) => {
            reject(err)
        })
    })
}
const mongoose = require("mongoose")

var tagSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    post:{
        post: [{type: mongoose.Schema.ObjectId, ref: 'Post'}]
    }
})

var Tags = mongoose.model("tags", tagSchema)

module.exports = {
    Tags
}

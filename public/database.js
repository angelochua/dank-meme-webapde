if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://angelochua:angelochua123@ds133252.mlab.com:33252/dankmeme'}
}else{
    module.exports = {mongoURI: "mongodb://localhost:27017/dankmeme"}
}
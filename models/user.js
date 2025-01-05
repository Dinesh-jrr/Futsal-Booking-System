const mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test');

 mongoose.Schema({
    username:String,
    name:String,
    name:String,
    age:Number,
    email:String,
    password:String
})
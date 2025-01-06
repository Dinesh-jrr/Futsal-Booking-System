const express=require('express');
const app=express();
const userModel=require('./models/user');
const bookingsModel=require('./models/bookings')
const cookieParser = require('cookie-parser');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get('/login',isLoggedIn,(req,res)=>{
    res.send("Hello and Hi")
})

app.post('/login',(async(req,res)=>{
    let {email,password}=req.body;
    let user= await userModel.findOne({email});
    if(!user) return res.status(500).send('Something went wrong');

    bcrypt.compare(password,user.password,(err,result)=>{
        if(result) res.status(200).send('You can login')
    });
}))

app.get('/logout',(req,res)=>{
    res.cookie("token","");
})

app.post('/register',async(req,res)=>{
    let {email,password,username}=req.body;
    let user= await userModel.findOne({email});
    if(!user) return res.status(500).send("User already registered");

    bcrypt.genSalt(10,(err,salt)=>{
        console.log(salt);
        bcrypt.hash(password,salt,async (err,hash)=>{
            console.log(hash);
           let user = await userModel.create({
                username,
                email,
                password:hash
            })
            let token = jwt.sign({email:email,userid:user._id},'ney');
            res.cookie('token',token);
            res.send("Registered");
        })
    })
})

function isLoggedIn(req,res,next){
    console.log(req.cookies);
    if(req.cookies.token === "")res.send("You must be logged in");
    else{
        let data = jwt.verify(req.cookies.token,'ney');
    }

}

app.listen(3000,()=>{
    console.log("Server running at 3000")
})

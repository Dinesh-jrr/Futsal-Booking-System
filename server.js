const express =require('express');
const app =express()
app.use(express.json())
const bcrypt=require('bcrypt')
const users=[{name :'Name'}]
app.get('/users',(req,res)=>{
    res.json(users)
})

app.post('/users',async(req,res)=>{
    try{
        const hashedPassword=await bcrypt.hash(req.bosy.password,10)
        console.log(hashedPassword)
        const user={name:req.body.name,password:hashedPassword}
        users.push(user)
        res.status(201).send("User created");
    }catch{
        res.status(500).send()
    }
})

app.post('/users/login',async(req,res)=>{
   const user=users.find(user=>user.name=req.body.name)
   if(user==null){
    return res.status(400).send("Cannot find user")
   }
   try{
    if(await bcrypt.compare(req.body.password=user.hashedPassword)){
        res.send("success")
    }else{
        res.send("Not Found")
    }
   }catch{
        res.status(500).send()
   }
})
app.listen(3000)
const express=require('express')
const mongoose=require('mongoose');
app=express();
app.use(express.json());
const bodyparser=require('body-parser')
app.use(bodyparser.urlencoded({extended:false}))

mongoose.connect('mongodb://localhost:27017/students')
const collection1=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        require:true
    },
    semister:{
        type:Number,
        require:true
    },
    college:{
        type:String,
        require:true
    },
    branch:{
        type:String,
        require:true
    },
    address:{
       type:String,
       require:true 
    }
})

const model=mongoose.model('karthik',collection1,'karthik')

app.post('/add',async(req,res)=>{
    const a=req.body;
    const n=req.body.email;
    console.log(a);
    const f=model.findOne({email:n},(err,data)=>{
        if(data==null){
            const p=model.insertMany(a)
            res.send(`student with Email ${n} added successfuly`)
        }
        else{
            res.send(`student with Email ${n} is already present`)
        }
    })
});

app.get('/students',async(req,res)=>{
    const s=await model.find({});
    console.log(s);
    res.send(s)
});

app.delete('/delete/:name',async(req,res)=>{
    const n=req.params.name;
    const b=await model.findOneAndRemove({'name':n})
    res.send(`${n} deleted successfuly`)
});

app.get('/update',(req,res)=>{
    res.sendFile(__dirname+"/update.html")
});

//app.update('/update')
app.post('/karthik',async (req,res)=>{
    const pname=req.body.fname;
    const pmail=req.body.upmail;
    model.findOneAndUpdate({email:pmail},{$set:{semister:req.body.semister,phone:req.body.phone,branch:req.body.branch,address:req.body.address}},{new:true},(err,data)=>{
        if(data==null){
            res.send("user email not found in database")
        }
        else{
            res.send(data)
        }
    })
})

app.listen(3000)
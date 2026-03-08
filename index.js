const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const port = 3000;

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://amrit-123:amrit-123@cluster0.hgh6hxe.mongodb.net/test')
.then(() => console.log('connected to MongoDB'))
.catch((err) => console.log('Could not connected to MongoDB'));

app.get('/',(req,res) => {
    res.send('Hello there!');
})

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required : true,
        minlength : [2,"Name must have atleast 2 characters"]
    },
    email:{
        type:String,
        required: [true,"Email must be there"],
        lowercase : true,
        unique : true
    },
    password:{
        type:String,
        required:[true,"password must be there"],
        minlength:[6,"password must have atleast 6 character"]
    },
    role:{
        type:String,
        enum:["Student","Mentor","Admin"],
        default:"Mentor"
    }
})

const User = mongoose.model("User",userSchema)


app.post("/add-user",async(req,res) => {
    const {name,email,password,role} = req.body;

    if(!name){
        return res.status(404).send("Name is Required")
    }
    if(!email){
        return res.status(404).send("email is Required")
    }
    if(!password){
        return res.status(404).send("Password is Required")
    }
    if(!role){
        return res.status(404).send("Role is Required")
    }

    try{
        const user = new User(req.body);
        const savedUser = await user.save();
        res.json(savedUser);
    }catch(error){
        res.json({error:error.message})
    }
});


app.post("/addmultipleusers",async(req,res) => {
    try{
        const users = await User.insertMany(req.body);
        res.json(users)
    }catch(err){
        res.status(400).send(err)
    }
})

app.get('/get-users',async (req,res) => {
    try{
        const users = await User.find();
        res.status(200).send(users);
    }catch(err){
        res.status(500).send(err);
    }
})


app.get("/users/:id",async(req,res) => {
    try{
        const user = await User.findById(req.params.id);
        if(user){
            return res.status(201).send("your information is already preasent in the dataBase")
        }
        if(!user){
            return res.status(201).send("your information not present in our dataBase")
        }
        res.json(user)
    } catch(err){
        res.status(500).send(err)
    }
})


app.put("/userupdate/:id",async(req,res) => {
    const userId = req.params.id;
    try{
        const Updateuser = await User.findByIdAndUpdate(userId,req.body,{new:true})
        res.json(Updateuser)
    }catch(error){
        res.status(500).send(err)
    }
})

app.delete("/userdelete/:id" ,async(req,res) => {
    try{
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        res.json(deleteUser);
    } catch(error){
        res.status(500).send(error);
    }
})

app.listen(port , () => {
    console.log(`server is running on port ${port}`)
})
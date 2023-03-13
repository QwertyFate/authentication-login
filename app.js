//jshint esversion:6
require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
const mongoose = require("mongoose");
const encrypt = ("mongoose-encryption");

//mongoose setup (database)
const mongoosefieldencryption = require("mongoose-field-encryption").fieldEncryption;


mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userschema = new mongoose.Schema({
    email: String,
    password: String
});



userschema.plugin(mongoosefieldencryption, {
    fields: ["password"],
    secret: process.env.SECRET

});



const newuser = mongoose.model("user", userschema);



//mongoose functions

async function registeruser(newemail,newpassword){
    const Newuser = new newuser({
        email: newemail,
        password: newpassword
    });
    Newuser.save();
};




//function express
app.get("/", function(req,res){
    res.render("home");
});


app.get("/login", function(req,res){
    res.render("login");
});

app.post("/login", async function(req,res){
    let username = req.body.username;
    let password = req.body.password;
    let finduser = await newuser.findOne({email:username});
    if(finduser){
        if(finduser.password === password){
            res.render("secrets");
        }else{
            res.send("Wrong password");
        }

    }else{
       res.send("please register");
    }
    
});




app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", async function(req,res){
    let newemail = req.body.username;
    let newpassword = req.body.password;
    await registeruser(newemail,newpassword);
    res.render("secrets");
    console.log("successfully added");

});









































//end function dont put anything here
app.listen(process.env.PORT || 3000 , function(){
    console.log("server up");
});
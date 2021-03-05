//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome everyone to my journal! My blogs will be displayed here. To write something click on compose. Only partial display of posts are allowed here. To read a complete post click on Read more option if available.";
const aboutContent = "This site is created by Nayan Gupta for personal blogging and daily journal";
const contactContent = "You can email me at: nayangupta424@gmail.com";
mongoose.connect("mongodb+srv://Nayan424:nayan101@xmeme.u2zcj.mongodb.net/blogDB",{useNewUrlParser : true, useUnifiedTopology: true });

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const blogSchema=new mongoose.Schema({
  title: String,
  content: String
});

const blog=mongoose.model("blog",blogSchema);

app.get("/",function(req,res){
  blog.find(function(err,li){
    if(err){
      console.log(err);
    } else {
      res.render("home",{content:homeStartingContent, arr: li});
    }    
  });
  
});

app.get("/about",function(req,res){
  res.render("about",{content:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{content:contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose",{});
});

app.get("/posts/:topic",function(req,res){
  blog.find(function(err,li){
    if(err){
      console.log(err);
    } else {
      li.forEach(function(i){
        if(_.lowerCase(i.title)===_.lowerCase(req.params.topic)){
          res.render("post",{blog:i});
        }    
      });
    }
  });
});

app.post("/compose",function(req,res){
  const post=new blog({
    title: req.body.title,
    content: req.body.body
  });
  post.save();
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
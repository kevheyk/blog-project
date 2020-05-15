const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ =require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
// Set Environment
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

//Connect to DB

mongoose.connect("mongodb://localhost:27017/blogsDB",{
   useNewUrlParser: true,
   useUnifiedTopology: true,}, (err)=>{
  if (err) {
    console.log("Error connecting DB: "+err);
  } else{
    console.log("DB Connected.")
  }
})

//Creat collections

const blogSchema = new mongoose.Schema({
  postTitle:{
    type:String,
    required:true
  },
  postBody:{
    type: String,
    required :true
  }
})

const Blog = mongoose.model("Blog", blogSchema);

// Global Var

const posts = [];
console.log(posts);
// GET Home Route
app.get("/", function(req, res){

  
    Blog.find({},(err, docs)=>{
      if (err){
        console.log("Error Finding: " + err)
      } else {
        res.render("home",{
          homeStartingContent: homeStartingContent,
          posts: docs
        });
      }
    })
});


// GET About Route
app.get("/about", function(req, res){
  res.render("about",{
    aboutContent: aboutContent
  });
  
});

// GET Contact Route
app.get("/contact", function(req, res){
  res.render("contact",{
    contactContent: contactContent
  });

});

// GET Compose Route
app.get("/compose", function(req, res){
  res.render("compose")
  
});

app.post("/compose", function(req, res){
  
  const newPost = new Blog({
    postTitle: req.body.postTitle,
    postBody: req.body.postBody
  });
  // posts.push(post)
  newPost.save({validateBeforeSave:true}, (err)=>{
    if (err){
      console.log("Erro saving new post: "+ err)
    } else{
      Blog.find({}, (err,docs)=>{
        if(err){
          console.log(err);
        } else {
          console.log(docs);
          res.redirect("/")
        }
      });
      
    }
  })
});


// GET PostID
app.get("/posts/:postID", function(req, res){
  console.log(req.params.postID);
  // if(posts.filter(post => _.lowerCase(post.postTitle) === _.lowerCase(req.params.postID)).length>0){
  //   console.log("Match Found")
  //   res.render("post",{
  //     post: posts.filter(post => _.lowerCase(post.postTitle) === _.lowerCase(req.params.postID))[0]
  //   });
  // } else{
  //   console.log("Post Not Found")
  //   res.redirect("/");
  // }
  
  // Find post object from DB using post title
  const postTitle = req.params.postID;
  Blog.findOne({postTitle:postTitle},(err,doc)=>{
    if(err){
      console.log("Error directing to post: " + err)
    } else{
      res.render("post", {post:doc})
    }
  })

})

// Delete All
app.get("/delete-all",(req, res)=>{
  Blog.deleteMany({},(err)=>{
    if (err){
      console.log("Error Deleting: " +err)
    } else {
      res.redirect("/")
    }
  })

})




const express = require('express');
const postRoutes = express.Router();

// set up rate limiter: maximum of five requests per minute
var RateLimit = require('express-rate-limit');
var limiter = new RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 5
});

// apply rate limiter to all requests
postRoutes.use(limiter);

// Require Post model in our routes module
let Post = require('./post.model');

// On success the post variable contains the response body.
postRoutes.route('/add').post(function (req, res) {
  let post = new Post(req.body);
  post.save()
  .then(() => {
  // returns the response body object and the status code.
    res.status(200).send(post);
  })
  .catch(() => {
    res.status(400).send("unable to save to database");
  });  
});

// If find() is not passed a query it would return every single post in the posts collection.
postRoutes.route('/').get(function (req, res) {
  const posts = new Post();
  // If query IS passed into .find(), it filters by the query parameters
  Post.find(req.query, (err, posts) =>{
    if (err) return res.status(500).send("No Results")
    return res.status(200).send(posts);
    // we've added a limit to how many posts it returns here.
  }).limit(5);
});

//  Define the post update route
postRoutes.route('/update').post(function (req, res) {
  var doc = Post.findById( req.body.id, function(err, post) {
    if (!post)
      res.status(404).send("data is not found");
    else {
      post.title = req.body.title;
      post.body = req.body.body;
      post.save().then(() => {
        res.status(200).send(post);
    })
    .catch(() => {
      res.status(400).send("unable to update the database");
    });
  };
});
});

// Remove a post from the database.
postRoutes.route('/delete').get(function (req, res) {
  // console.log(req);
  var id = req.query.id;
  var doc = Post.findByIdAndDelete( id, function(err, doc){
    if (!doc) { 
      res.status(404).send("data is not found");
    } else if(doc) {
      res.status(200).send(doc);
    } else {
      res.status(400).send("unable to delete from the database");
    };
  });
});

module.exports = postRoutes;
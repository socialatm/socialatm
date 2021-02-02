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

// Defined get data(index or listing) route
postRoutes.route('/').get(function (req, res) {
    Post.find(function(err, posts){
    if(err){
      res.json(err);
    }
    else {
      res.json(posts);
    }
  });
});

// Defined edit route
postRoutes.route('/edit/:id').get(function (req, res) {
  let id = req.params.id;
  Post.findById(id, function (err, post){
      if(err) {
        res.json(err);
      }
      res.json(post);
  });
});

//  Defined update route
postRoutes.route('/update/:id').post(function (req, res) {
    Post.findById(req.params.id, function(err, post) {
    if (!post)
      res.status(404).send("data is not found");
    else {
        post.title = req.body.title;
        post.body = req.body.body;
        post.save().then(() => {
          res.json('Update complete');
      })
      .catch(() => {
            res.status(400).send("unable to update the database");
      });
    }
  });
});

// Defined delete | remove | destroy route
postRoutes.route('/delete/:id').delete(function (req, res) {
    Post.findByIdAndRemove({_id: req.params.id}, function(err){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

module.exports = postRoutes;
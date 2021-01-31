const mongoose = require('mongoose');
// ES6 Promises
mongoose.Promise = global.Promise;

// Connect to the db before tests run (mongoose hook)
before((done) => {
    mongoose.connect('mongodb://localhost:27017/atm-test', { useNewUrlParser: true,  useUnifiedTopology: true});

    mongoose.connection.once('open', () => {
        console.log('Connected to the atm-test database...');
        done();
    }).on('error', (err) =>
        console.log('Connection error: ' + err));    
})

// Drop the characters collection before each test
beforeEach((done) => {
 //   mongoose.connection.collections.articles.drop();
    done();
})

const assert = require("assert");
const Post = require("../post.model");

// describve tests
describe("Saving records", () => {
// create tests

  it("Save a record to the database", (done) => {
    let post = new Post({
      title: "miaou",
      body: "ok man",
    });

      post.save().then(() => {
      assert(post.isNew === false);
      done(); // inform mocha test is done
    });
  });
});



// demos below
// var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe('Array', function() {
  describe('#indexOf()', function() {
    // pending test below
    it('should return -1 when the value is not present');
  });
});
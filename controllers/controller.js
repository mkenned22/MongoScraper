// controller.js defines all of the routes for the application

// require express, and the two models "soladmin" and "database"
var express = require("express");
var mongoose = require("mongoose");

//var orm = require("../config/orm.js");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  // `title` must be of type String
  title: String,
  // `body` must be of type String
  desc: String
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Note model
//module.exports = Article;

// define the router
var router = express.Router();

// GET Requests
router.get("/", function (req, res) {



    res.render("index");
});

// POST Requests
// POST for the Configure Section
router.post("/", function (req, res) {

    orm.log("Request to configure message router has been received.")

    // initializing variables from the request "req" object
    var api = req.body.api;
    var vpn = req.body.msgVpn;
    var user = req.body.username;
    var pass = req.body.password;
    var app = req.body.app;

    // call the soladmin model to configure the message VPN
    soladmin.configureMessageVpn(user, pass, vpn, app, api, function (result) {
        if (result.body.meta.responseCode === 200) {

            // definiing success json object only after 200 response
            var successObject = {
                data: {
                    "subscriber": app + "_sub_cu",
                    "subPassword": "sub_password",
                    "publisher": app + "_pub_cu",
                    "pubPassword": "pub_password",
                    "vpn":vpn
                }
            }
            // after successful post request render the index page with successObject
            res.render("index", successObject);
            
            // log the request in the database
            database.insertOne(vpn, app, function (result) {
                orm.log(result)
            });
        }
        else {
            // if receiving any other status code besides 200 return the failure page
            orm.log(result);
            res.render("failure");
        }
    });

});

// POST for the Publish Section 
router.post("/test", function (req, res) {

    // initializing variables from the request "req" object
    var api = req.body.api
    var vpn = req.body.msgVpn;
    var user = req.body.username;
    var pass = req.body.password;
    var topic = req.body.topic;
    var msg = req.body.message;

    // call the soladmin model to publish a message
    soladmin.publishMessage(api,vpn,user,pass,topic,msg,function(result){

    })
});

router.get("/scrape", function (req, res){
    var cheerio = require("cheerio");
    var request = require("request");

    // First, tell the console what server.js is doing
    console.log("\n***********************************\n" +
                "Grabbing new articles\n" +
                "***********************************\n");

    // Making a request for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
    request("http://www.foxnews.com/us.html", function(error, response, html) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(html);

        // With cheerio, find each p-tag with the "title" class
        // (i: iterator. element: the current element)
        var promises = [];
        var array = [];
        $("article.article").each(function(i, element) {
            var title = $(element).find('div > header > h2').text().trim()
            if(title !== ""){
                var desc = $(element).find('div > div > p').text().trim()
                // console.log(title)
                // console.log(desc)
                var promise = array.push({
                    "title": title,
                    "desc": desc
                });
                // var article = new Article({
                //     "title": title,
                //     "desc": desc
                // });
                //var promise = article.save();
                promises.push(promise)
            }
        });
        Promise.all(promises)
            .then(function(){
                console.log(promises);
                //Article.find({}, function(err, articles) {
                    var successObject = {
                        "articles": array
                    };
                    //console.log(successObject);
                    res.render("index",successObject)
                //});
                
            })
            .catch(function(err){
                console.log(err);
            })
            
    }); // end request
    //res.render("index",successObject)
});

module.exports = router;
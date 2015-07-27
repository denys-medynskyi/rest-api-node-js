// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/rest-api")

var Item     = require('./app/models/item');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// use morgan to log requests to the console
app.use(morgan('dev'));

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/items')

    // create a bear (accessed at POST http://localhost:8080/api/items)
    .post(function(req, res) {
        
        var item = new Item();      // create a new instance of the Item model
        item.name = req.body.name;  // set the items name (comes from the request)

        // save the bear and check for errors
        item.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Item created!' });
        });
        
    })

    .get(function(req, res) {
      Item.find(function(err, items){
        if(err)
          res.send(err)
        res.json(items);
      })
    });

router.route('/items/:id')
  
  .get( function(req, res) {
    Item.findById( req.params.id, function(err, item) {
      if (err)
        res.send(err);
      res.json(item);
    });
  })

  .put(function(req, res) {
    Item.findById(req.params.id, function(err, item){
      if(err)
        res.send(err);
      item.name = req.body.name;

      item.save(function(err){
        if(err)
          res.send(err);

        res.json({ message: "Item is updated!" });        
      });
    });
  })

  .delete(function(req, res) {
    Item.remove({
      _id: req.body.id
    }, function(err, bear){
      if(err)
        res.send(err);

      res.json({ message: "Successfuly deleted" })
    })
  })

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

var util = require("util");
var config = require("../config");
var mongodb = require("mongodb");

var index = exports.index = function index(req, res) {
  res.send('Hello World');
};

var example = exports.example = function example(req, res) {
  res.json({
    city: req.params.city,
    date: new Date()
  });
};

exports.serviceList = function serviceList(req, res) {
  var endpointId = req.params.city;

  mongodb.Db.connect(config.mongoUrl, function(error, db) {
    if (error) throw error;

    db.collection('endpoints', function(error, coll) {
      if (error) {
        res.send("UHOH no collection!");

        db.close();
        return;
      }

      console.log(endpointId);
      coll.findOne({
        // _id: mongodb.ObjectID(endpointId)
        shortcut: "dc"
      }, function(error, doc) {
        if (error) {
          res.send("UHOH NO RECORD! " + error);

          db.close();
          return;
        }

        console.log("DOC: " + util.inspect(doc));
        var shortcut = doc.shortcut;
        var open311 = new Open311(shortcut);
        
        open311.serviceList(function(error, serviceList) {
          if(req.params.format === 'xml') {
            res.set({ 'Content-Type': 'text/xml'});
          }
          else {
            res.set({ 'Content-Type': 'text/json'});
          }
          res.send(serviceList);

          db.close();
        });

      });
    });
  });
};

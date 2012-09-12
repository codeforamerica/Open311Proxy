var util = require("util");
var config = require("../config");
var mongodb = require("mongodb");
var Open311 = require("open311");

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

      coll.findOne({
        _id: endpointId
      }, function(error, endpoint) {
        if (error || !endpoint) {
          res.send("UHOH NO RECORD! " + error);
          db.close();
          return;
        }

        var options = endpoint.shortcut || {
          endpoint: endpoint.endpoint,
          jurisdiction: endpoint.jurisdiction,
          format: endpoint.format
        };

        var open311 = new Open311(options);
        open311.serviceList(function(error, serviceList) {
          if(req.params.format === 'xml') {
            res.set({ 'Content-Type': 'text/xml'});
            // FIXME: we're not actually sending XML right now
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

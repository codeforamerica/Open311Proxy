var util = require("util");
var db = require("../util/db");
var config = require("../config");
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

  db.getEndpointInfo(endpointId, function(error, endpoint) {
    if (error || !endpoint) {
      res.send("UHOH NO RECORD! " + error);
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
    });
  });
};

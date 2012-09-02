var Open311 = require('../lib/open311.js');

var serviceList = exports.serviceList = function index(req, res) {
  var open311 = new Open311({ 
    format: req.params.format
  });
  
  open311.serviceList(function(serviceList) {
    if(req.params.format === 'xml') {
      res.set({ 'Content-Type': 'text/xml'});
    }
    else {
      res.set({ 'Content-Type': 'text/json'});
    }
    res.send(serviceList);
  });
}
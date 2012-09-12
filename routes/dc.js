var Open311 = require('open311');

var serviceList = exports.serviceList = function index(req, res) {
  var open311 = new Open311({
    endpoint: "http://app.311.dc.gov/cwi/Open311/v2/",
    jurisdiction: "dc.gov",
    format: "xml"
  });
  
  open311.serviceList(function(error, serviceList) {
    if(req.params.format === 'xml') {
      res.set({ 'Content-Type': 'text/xml'});
    }
    else {
      res.set({ 'Content-Type': 'text/json'});
    }
    res.send(serviceList);
  });
}

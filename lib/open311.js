var request = require('request'),
    parser  = require('xml2json');


var Open311 = module.exports = function(options) {
  options = options || {};
  
  this.options = {};
  this.options.jurisdiction = 'dc.gov';
  this.options.discovery = options.discovery || 'http://app.311.dc.gov/cwi/Open311';
  this.options.services = options.services || 'http://app.311.dc.gov/cwi/Open311/v2';
  this.options.format = options.format || 'xml'; 

}

Open311.prototype.serviceDiscovery = function serviceDiscovery(callback) {
  var discovery, self;
  self = this;
  
  request(self.options.discovery + '/discovery.' + self.options.format, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      
      if (self.options.format === 'xml') {
        discovery = parser.toJson(body, {object: true}).discovery;
      }
      else {
        discovery = body;
      }
      
      callback(discovery);
    }
  });
};

Open311.prototype.serviceList = function serviceList(callback) {
  var serviceList = [], self;
  self = this;
  
  request(self.options.services + '/services.xml?jurisdiction_id=' + self.options.jurisdiction, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      if (self.options.format === 'json') {
        serviceList = parser.toJson(body, {object: true}).services.service;
      }
      else {
        serviceList = body;
      }
    }
    
    callback(serviceList);
  });
  
  
};
var util = require("util");
var parseUrl = require("connect").utils.parseUrl;
var Open311 = require("open311");
var db = require("../util/db");

// Middleware to make sure we have a content-type set 
// (so that bodyParser() does the right thing)
exports.ensureUrlEncoding = function (options) {
  var matchesPath;
  if (options && options.path) {
    matchesPath = function(req) {
      var url = parseUrl(req);
      return options.path.test(url.pathname);
    };
  }
  else {
    matchesPath = function() { return true; };
  }

  return function (req, res, next) {
    if (matchesPath(req) && !('content-type' in req.headers)) {
      req.headers['content-type'] = 'application/x-www-form-urlencoded';
    }
    return next();
  };
};

exports.submitRequest = function (request, response) {
  var endpointId = request.params.city;

  db.getEndpointInfo(endpointId, function(error, endpoint) {
    if (error || !endpoint) {
      res.send("UHOH NO RECORD! " + error);
      return;
    }

    // bodyParser will put attribute[code] arguments into an object called "attribute"
    // but Open311 takes an object called "attributes"
    request.body.attributes = request.body.attribute;
    delete request.body.attribute;

    var options = endpoint.shortcut || {
      endpoint: endpoint.endpoint,
      jurisdiction: endpoint.jurisdiction,
      format: endpoint.format
    };

    var open311 = new Open311(options);
    open311.apiKey = request.body.api_key;

    open311.submitRequest(request.body, function(error, responseInfo) {
      if (error) {
        response.status(400);
      }
      else {
        response.status(201);
      }

      response.set({ 'Content-Type': 'text/json'});
      response.send(responseInfo);
    });
  });
};
var config = require("../config");
var mongodb = require("mongodb");

exports.getEndpointInfo = function(endpointId, callback) {
  mongodb.Db.connect(config.mongoUrl, function(error, db) {
    // FIXME: this should not throw
    if (error) {
      callback("Unable to connect to database " + config.mongoUrl);
    }

    db.collection('endpoints', function(error, coll) {
      if (error) {
        db.close();
        callback("Unable to get endpoint collection");
      }

      coll.findOne({
        _id: endpointId
      }, function(error, endpoint) {
        if (error || !endpoint) {
          db.close();
          callback(error || "No Record");
        }
        else {
          db.close();
          callback(null, endpoint);
        }
      });
    });
  });
};
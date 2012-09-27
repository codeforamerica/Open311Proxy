var config = require("./config");
var Open311 = require("open311");
var mongodb = require("mongodb");

var BACKOFF_RATE = 0.75;
var GROWTH_RATE = 1.0; // seems like no growth is generally better...
var GROWTH_CAP = 900;

var HOUR = 1000 * 60 * 60,
    DAY = HOUR * 24,
    MAX_DATE_RANGE = DAY * 90;

var getCollection = function(collectionName, callback) {
  mongodb.Db.connect(config.mongoUrl, function(error, db) {
    // FIXME: this should not throw
    if (error) {
      callback("Unable to connect to database " + config.mongoUrl);
    }

    db.collection(collectionName, function(error, collection) {
      if (error) {
        db.close();
        callback("Unable to get requests collection");
      }
      
      callback(null, collection, db);
    });
  });
};

var getRequests = function(collection, db) {
  console.log("Vacuuming " + city);

  var start = new Date(1996, 0, 1);
  // var start = new Date(2010, 0, 19);
  var range = MAX_DATE_RANGE;
  // var range = 77937000;

  var end = new Date(start.getTime() + range);

  var params = {
    start_date: start.toISOString(),
    end_date: end.toISOString()
  };

  var startTime = new Date();
  var requestCount = 0;
  // this provides simple handing for endpoints without paging
  // paged endpoints could be handled more simply (no need for backing off)
  var basicCallback = function(error, data) {
    requestCount++;
    console.log("Got " + params.start_date + " to " + params.end_date);
  
    if (error) {
      console.log("ERROR: ", error);
      return;
    }
    data = data || [];
    console.log("Got " + data.length);
  
    if (data.length >= 1000) {
      // maybe need to reduce the range
      // to the nearest second
      if (range > 1000) {
        range = Math.ceil(range * BACKOFF_RATE / 1000) * 1000;
        end = new Date(start.getTime() + range);
      }
      else {
        console.log("More than 1000 requests/s! This is crazytown.");
        start = end;
        end = new Date(start.getTime() + range);
      }
    }
    else {
      if (data.length) {
        for (var i = data.length - 1; i > -1; i--) {
          var srid = data[i].service_request_id || data[i].token;
          if (srid) {
            data[i]._id = srid;
          }
        }
        collection.insert(data, {safe: true, continueOnError: true}, function(error) {
          if (error) {
            console.log("Insertion failed :(\n" + error);
            if (~error.toString().indexOf("duplicate key error")) {
              console.log("Continuing anyway.");
            }
            else {
              throw error;
            }
          }
        });
      }
      
      // slowly grow back
      if (data.length < GROWTH_CAP) {
        range = Math.ceil(range * GROWTH_RATE / 1000) * 1000;
      }
      
      start = end;
      end = new Date(start.getTime() + range);
    }
  
    // make the next request
    if (start > new Date()) {
      // we can't get requests from the future
      console.log(requestCount + " requests; took: " + ((new Date() - startTime) / 1000) + "s");
      db && db.close();
      return;
    }
  
    params = {
      start_date: start.toISOString(),
      end_date: end.toISOString()
    };
    cityApi.serviceRequests(params, basicCallback);
  };

  cityApi.serviceRequests(params, basicCallback);
};



// RUN!
var args = require("optimist")
	.usage("Usage: $0 CITY [-j jurisdiction]")
	.options("j", {alias: "jurisdiction", describe: "The jurisdiction ID to use."})
  .options("c", {alias: "collection", describe: "The DB collection to save SRs in."})
	.check(function(args) { if (!args._[0]) { throw "You must provide an endpoint URL to vacuum up!"; } })
	.argv;

var city = args._[0];

var cityApi;
try {
  cityApi = new Open311(city);
}
catch(ex) {
  console.log("Couldn't use city as city, using as URL");
  if (city.slice(-1) != "/") {
    city += "/";
  }
  cityApi = new Open311({
    endpoint: city,
    jurisdiction: args.jurisdiction
  });
}

getCollection(args.collection || "requests", function(error, collection, db) {
  if (error) {
    throw error;
  }
  
  getRequests(collection, db);
});
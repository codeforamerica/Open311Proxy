var request = require("request"),
  xml2json = require("xml2json");
  
function getWashingtonInfo(callback) {
    request('http://app.311.dc.gov/cwi/Open311/v2/requests.xml?jurisdiction_id=dc.gov', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        callback(xml2json.toJson(body)); 
      }
    });
}

exports.getWashingtonInfo = getWashingtonInfo;
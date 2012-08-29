var Open311 = require('../../lib/open311.js');


//describe("Open311", function() {
//  
//  it("should route GET service discovery", function(done) {
//    var open311xml = new Open311({format: 'xml'});
//    var open311json = new Open311({format: 'json'});
//    open311xml.serviceDiscovery(function(discoveryFromXml) {
//      open311json.serviceDiscovery(function(discoveryFromJson) {
//        console.log("XML: ");
//        console.log(discoveryFromXml);
//        console.log("JSON: ");
//        console.log(discoveryFromJson);      
//        
//        //expect(JSON.stringify(discoveryFromXml)).toEqual(JSON.stringify(discoveryFromJson));
//        done();
//      }); 
//    }); 
//  });
//  
//});

describe("Service List", function() {
  
  it("should get list of services", function(done) {
    var open311 = new Open311();

    open311.serviceList(function(serviceList) {
//      console.log(serviceList);
      for (var i = 0; i < serviceList.services.service.length; i++) {
          console.log(serviceList.services.service[i].service_code);
      }
      done();
    }); 
  });
  
});
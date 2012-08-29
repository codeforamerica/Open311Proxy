var app = require("../src/app").app;
var request = require("request");

var host = 'http://' + process.env.IP + ":" + process.env.PORT;

function url(path) {
    return host + path;
}

describe("start", function() {
    it("makes a request to Washington", function(done) {
        var wasCalled = false;
        var myRequestLib = {getWashingtonInfo: function(callback) {  wasCalled = true; callback("test"); }};
        
        app.start(myRequestLib);
        
        request.get(url("/washington"), function(error, req, body) {            
            wasCalled.should.be.true;
            done();
        });        
    }); 
});
var server = require('../server');
var routesInfo = require('../routes/info');

describe("Server", function() {

  it("should route GET '/' to info.index", function(done) {
    expect(server.routes.get[0].path).toEqual('/');
    expect(server.routes.get[0].callbacks).toEqual([routesInfo.index]);
    done();
  });

  it("should route GET '/api/:city' to info.example", function(done) {
    expect(server.routes.get[1].path).toEqual('/api/:city');
    expect(server.routes.get[1].callbacks).toEqual([routesInfo.example]);
    done();
  });

});
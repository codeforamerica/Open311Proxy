var //jasmine = require('jasmine-node'),
    info    = require('../../routes/info');

describe("Routes/Info", function() {
  var index, example, request, response;

  describe("index()", function() {

    beforeEach(function(done) {
      response = {
        send: jasmine.createSpy()
      }
      info.index({}, response);
      done();
    });

    it("should use res.send()", function(done) {
      expect(response.send.wasCalled).toBeTruthy();
      done();
    });

    it("should display 'Hello World'", function(done) {
      expect(response.send.argsForCall[0]).toEqual(['Hello World']);
      done();
    });
  });

  describe("example()", function() {

    beforeEach(function(done) {
      example = info.example;
      request = {
        params: {}
      };
      response = {
        json: jasmine.createSpy()
      }
      done();
    });

    it("should use res.json()", function(done) {
      example(request, response);
      expect(response.json.wasCalled).toBeTruthy();
      done();
    });

    it("should return JSON with a date", function(done) {
      example(request, response);
      expect(response.json.argsForCall[0][0].date).toBeDefined();
      done();
    });

    it("should return the :city in the JSON", function(done) {
      request.params.city = "boston";
      example(request, response);
      expect(response.json.argsForCall[0][0].city).toEqual('boston');
      done();
    });
  });

});
var express = require("express");
var app = express();

app.start = function(requestLib) {
    app.get('/washington', function(req, resp) {
        requestLib.getWashingtonInfo(function(str) {
            resp.send(str);
        });
    });
    
    app.listen(process.env.PORT);
}

exports.app = app;

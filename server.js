var express  = require('express'),
    app      = module.exports = express(),
    PORT     = process.env.PORT || 5000;

var serviceRequests = require(__dirname + '/routes/serviceRequests');

/** Express Configuration **/
app.configure(function(){
  //app.set('views', __dirname + '/views');
  //app.set('view engine', 'ejs');
  app.use(serviceRequests.ensureUrlEncoding({path: /requests\.\w+$/}));
  app.use(express.bodyParser({type: 'urlencoded'}));
  app.use(express.methodOverride());
  //app.use(express.compress());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


/** Routing/Controllers **/
var serviceMetadata = require(__dirname + '/routes/serviceMetadata');
// var serviceRequests = require(__dirname + '/routes/serviceRequests');
app.get('/', serviceMetadata.index);
app.get('/api/:city/services.:format', serviceMetadata.serviceList);
app.post('/api/:city/requests.:format', serviceRequests.submitRequest);


app.listen(PORT);
console.log("Express server listening on port %d in %s mode", PORT, app.settings.env);

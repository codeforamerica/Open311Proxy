var express  = require('express'),
    app      = module.exports = express(),
    PORT     = process.env.PORT || 5000;

/** Express Configuration **/
app.configure(function(){
  //app.set('views', __dirname + '/views');
  //app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  //app.use(express.compress());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


/** Routing/Controllers **/
var info = require(__dirname + '/routes/info');
app.get('/', info.index);
app.get('/api/:city/services.:format', info.serviceList);


app.listen(PORT);
console.log("Express server listening on port %d in %s mode", PORT, app.settings.env);

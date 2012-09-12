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
var dc = require(__dirname + '/routes/dc');
app.get('/', info.index);
app.get('/api/dc', dc.serviceList);
app.get('/api/:city', info.example);


app.listen(PORT);
console.log("Express server listening on port %d in %s mode", PORT, app.settings.env);

var index = exports.index = function index(req, res) {
  res.send('Hello World');
}

var example = exports.example = function example(req, res) {
  res.json({
    city: req.params.city,
    date: new Date()
  })
}
//  Hapi is a class
var Hapi = require('hapi');

//  Instantiate
var server = new Hapi.Server();

//  Configure server connection / host
server.connection({
  host: '0.0.0.0',
  port: 3000,
  routes: {
    cors: {
      headers: ["Access-Control-Allow-Credentials"],
      credentials: true
    }
  }
});

//  Require MongoDB
var plugins = [
  // Require MongoDB
  {
    register:require('hapi-mongodb'),
    options: {
      url: 'mongodb://localhost:27017/hapi-twitter',
      settings: {
        db: {
          native_parser: false
        }
      }
    }
  }
];


//  Start server
server.register(plugins, function(err){
  //  check error
  if (err) {
    throw err;
  }

  //  start server
  server.start(function(){
    console.log('info', 'server running at: ' + server.info.uri);
  });
});

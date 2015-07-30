var Bcrypt = require('bcrypt');
var Auth = require('./auth');

exports.register = function(server, options, next){
server.route([
  {
    method:'POST',
    path: '/sessions',
    handler: function(request, reply){
      var db = request.server.plugins['hapi-mongodb'].db;

      var user = request.payload.user;

      db.collection('users').findOne({username: user.username}, function(err, userMongo){
        if (err) { return reply('Internal MongoDB error');}
        if (userMongo === null) {
          return reply({ userExists: false });
        }
        Bcrypt.compare(user.password, userMongo.password, function(err, same){
          if (!same) {
            return reply({ authorized: false});
          }

          var randomKeyGenerator = function() {
              return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
          };
          var session = {
            user_id: userMongo._id,
            session_id: randomKeyGenerator()
          };
          db.collection('sessions').insert(session, function(err, writeResult){
            if (err) { return reply('Internal MongoDB error');}
            request.session.set('hapi_twitter_session', session);
            reply({ authorized: true});
          });
        });
      });
    }
  },

  {
    method: 'DELETE',
    path: '/sessions',
    handler: function(request, reply) {
      var session = request.session.get('hapi_twitter_session');
      var db = request.server.plugins['hapi-mongodb'].db;

      if (!session) {
        return reply({ "message": "Already logged out" });
      }

      db.collection('sessions').remove({ "session_id": session.session_id }, function(err, writeResult) {
        if (err) { return reply('Internal MongoDB error', err); }

        reply(writeResult);
      });
    }
  },
  {
    method: 'GET',
    path: '/authenticated',
    handler: function(request, reply){
      var callbackFunction = function(result){
        reply(result);
      };
      Auth.authenticated(request, callbackFunction);
    }
  }

]);


next();
};

exports.register.attributes = {
name: 'sessions-route',
version: '0.0.1'
};

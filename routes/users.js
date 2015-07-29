var Bcrypt = require('bcrypt');
var Joi = require('joi');


// Defining the plugin
exports.register = function(server, options, next) {

  server.route([
    {
      method: 'GET',
      path: '/temp',
      handler: function(request, reply){
        reply('Hello World!');
      }
    },
    {
      method: 'GET',
      path: '/users',
      handler: function(request, reply){
        var db = request.server.plugins['hapi-mongodb'].db;
        db.collection('users').find().toArray(function(err, users){
          if (err) { return reply('Internal MongoDB errer', err);}
          reply(users);
        });
      }
    },
    {
      method: 'POST',
      path: '/users',
      config: {
        handler: function(request, reply) {
          var db = request.server.plugins['hapi-mongodb'].db;
          var user = request.payload.user;
          var uniqueUserQuery = {
            $or: [
              {username: user.username},
              {email: user.email}
            ]
          };
          db.collection('users').count(uniqueUserQuery, function(err, userExist){
            if (userExist) {
            return reply("Error: Username already exists", err).code(200);
            }
            //Encrypt my password
            Bcrypt.genSalt(10, function(err, salt){
              Bcrypt.hash(user.password, salt, function(err, encrypted){
                user.password = encrypted;
                db.collection('users').insert(user, function(err, writeResult){
                  if (err) {
                    return reply ("Internal MongoDB error", err);
                  }
                  reply(writeResult);
                });
              });
            });
          });
        },
        validate: {
          payload: {
            user: {
              email: Joi.string().email().max(50).required(),
              password: Joi.string().min(5).max(20).required(),
              username: Joi.string().min(3).max(20).required(),
              name: Joi.string().min(3).max(20)
            }
          }
        }
      }
    }
  ]);
  next(); //important
};

//Defining the description of the plugin
exports.register.attributes = {
  name: 'users-routes',
  version: '0.0.1'
};

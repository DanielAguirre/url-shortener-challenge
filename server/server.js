'use strict';

require('dotenv').config();

const mongoose = require('mongoose');
const { Mongo } = require('../environment');

//Set upt Mongodb connection
const uri = `mongodb://${Mongo.HOST}:${Mongo.PORT}/${Mongo.NAME}`;

/**
 , {
  auth: { authSource: Mongo.AUTH },
  user: Mongo.USER,
  pass: Mongo.PASS
}
 */

if(process.env.NODE_ENV !== 'test'){
  mongoose.connect(uri);
  mongoose.Promise = global.Promise; // Use JavaScript promises

  mongoose.connection.on('error',(err)=> console.log('fails database', err.message));
}

require('../models/Urls');

const app = require('../app');
const server = require('http').Server(app);
/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
}

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      throw new Error(bind + ' requires elevated privileges');
    case 'EADDRINUSE':
      throw new Error(bind + ' is already in use');
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}


/**
 * Listen on provided port, on all network interfaces.
 */
if(!module.parent){
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
} else { module.exports = server }

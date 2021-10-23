var data_packet = new Array(1000).fill(0);





/*
const cluster = require("cluster");
const http = require("http");
const {
    Server
} = require("socket.io");
const numCPUs = require("os").cpus().length;
const {
    setupMaster,
    setupWorker
} = require("@socket.io/sticky");
const {
    createAdapter,
    setupPrimary
} = require("@socket.io/cluster-adapter");
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    const httpServer = http.createServer();
    // setup sticky sessions  setupMaster(httpServer, {    loadBalancingMethod: "least-connection",  });
    // setup connections between the workers  setupPrimary();
    // needed for packets containing buffers (you can ignore it if you only send plaintext objects)  // Node.js < 16.0.0  cluster.setupMaster({    serialization: "advanced",  });  // Node.js > 16.0.0  // cluster.setupPrimary({  //   serialization: "advanced",  // });
    httpServer.listen(3000);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    console.log(`Worker ${process.pid} started`);
    const httpServer = http.createServer();
    const io = new Server(httpServer,{ "transports": ["websocket"]});
    // use the cluster adapter  io.adapter(createAdapter());
    // setup connection with the primary process  setupWorker(io);
    io.on("connection", (socket) => {

    
        socket.on('hello', (data) => {
            // we tell the client to execute 'new message'
            console.log("hello msg")
            socket.broadcast.emit('new message', {
              username:data_packet,
              message: data
            });
          })
    
    });
}
*/





/*

// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing


// Chatroom

let numUsers = 0;

io.on('connection', (socket) => {

    console.log("connectd")

  // when the client emits 'new message', this listens and executes
  socket.on('hello', (data) => {
    // we tell the client to execute 'new message'
    console.log("hello msg")
    socket.broadcast.emit('new message', {
      username:data_packet,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {


    // we store the username in the socket session for this client
 
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {



      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
      });
    
  });
});

*/


const cluster = require("cluster");
const http = require("http");
const { Server } = require("socket.io");
const numCPUs = require("os").cpus().length;
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  const httpServer = http.createServer();

  // setup sticky sessions
  setupMaster(httpServer, {
    loadBalancingMethod: "least-connection",
  });

  // setup connections between the workers
  setupPrimary();

  // needed for packets containing buffers (you can ignore it if you only send plaintext objects)
  // Node.js < 16.0.0
  cluster.setupMaster({
    serialization: "advanced",
  });
  // Node.js > 16.0.0
  // cluster.setupPrimary({
  //   serialization: "advanced",
  // });

  httpServer.listen(3000);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started`);

  const httpServer = http.createServer();
  const io = new Server(httpServer,{upgrade: false, "transports": ["websocket"]});

  // use the cluster adapter
  io.adapter(createAdapter());

  // setup connection with the primary process
  setupWorker(io);

  io.on("connection", (socket) => {
    socket.on('hello', (data) => {
        // we tell the client to execute 'new message'
        //console.log("hello msg")
        socket.broadcast.emit('hello', {
          username:data_packet,
        });
    });
  });
}

const express = require('express');

const {logger} = require("./middleware/middleware");

const userRouter= require("./users/users-router")



const server = express();

// ekspres'in varsayılan olarak istek gövdelerinde JSON'u ayrıştıramayacağını unutmayın

server.use(express.json());

// global ara yazılımlar ve kullanıcı routelarının buraya bağlanması gerekir
server.use("/api/users",userRouter);
server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Biraz ara yazılım yazalım!</h2>`);
});

module.exports = server;

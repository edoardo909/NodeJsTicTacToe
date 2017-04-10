const path = require('path');
const express = require('express');
const server = express();


server.use(express.static('./web-content'));

server.get('/', function(request, response){
	response.sendFile(path.join(__dirname, 'web-content/views/', 'index.html'))
});

server.get('/play', function(request, response){
	response.sendFile(path.join(__dirname, 'web-content/views/', 'game.html'))
});


server.listen(3000, function() {
  console.log('Server started on http://localhost:3000');
});
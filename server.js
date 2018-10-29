
const express = require('express'); //make express available
const app = express(); //invoke express
const server = require('http').Server( app ) // start the express server instance
const io = require('socket.io')(server) // use socket.io for real time connections aka. wesockets
// const fileUpload = require('express-fileupload');
const multer  = require('multer') //use multer to upload blob data
const upload = multer(); // set multer to be the upload variable (just like express, see above ( include it, then use it/set it up))
const fs = require('fs'); //use the file system so we can save files



app.post('/upload', upload.single('soundBlob'), function (req, res, next) {
  // console.log(req.file); // see what got uploaded

  fs.writeFileSync(__dirname + '/public/uploads/' + req.file.originalname + '.wav', Buffer.from(new Uint8Array(req.file.buffer))); // write the blob to the server as a file
  res.sendStatus(200); //send back that everything went ok

  io.emit('updateRecordingOnClient', req.file.originalname) // send out the successful upload to all clinets and include the name so we can easily cross refrence later and play this uploaded sound file.

})


//serve out any static files in our public HTML folder
app.use(express.static('public'))

//see if we got clinet socket connections
io.on('connection', function(socket){
  console.log(socket.id); // log out the unique ID of each person who connects

})

//makes the app listen for requests on port 3000
server.listen(3000, function(){
  console.log("app listening on port 3000!")
})

// let recordButton1;
// let recordButton2;

const socket = io();

let buttons = []
let mic;
let gridSize = 200
let rate;

function setup() {
  mic = new p5.AudioIn();
  mic.start();
  // put setup code here
  createCanvas(windowWidth,windowHeight)
   // recordButton1 = new recorder(mic,100,100,50);
   // recordButton2 = new recorder(mic,200,100,50);
   //generate the buttons
   for(var x = 0; x <= width; x += gridSize){
     for(var y = 0; y <= height; y += gridSize){
       r = new recorder(mic,x,y,gridSize);
       buttons.push(r); //push them into an array for later reference
     }
   }

   //A big thing missing here is an initialization where you would check the status of the files and set up the objects with the appropriate previously-recorded audio files and set them to red and clicked.
   //you should have a go at this based on whats happening on the socket connection below, but you'll have to extrapolate the files from the server, you can likely use httpGet to check if each file is even there and then act accordingly.

}

function draw() {
  // put drawing code here
  rate = map(mouseX, 0,width,-0.2,1)
}

//wait for a socket call from the server so we can reset all connected clients(including ourself!)
socket.on('updateRecordingOnClient', (filename)=>{
  console.log('hello? ' + filename );
  // console.log(buttons);
for (var i = 0; i < buttons.length; i++) { //loop through all of the buttons
  // console.log(buttons[i]);
  if(buttons[i].name  === filename){ // see if the button that just got recorded is here, if it is, replace the sound.
    console.log('replace me');
    buttons[i].soundFile =  loadSound('uploads/'+ filename + '.wav', //replace the sound file
                              (success)=>{ //wait for a successful file load
                                console.log('file loaded from server...');
                                buttons[i].soundFile.loop(); // start looping the file
                                buttons[i].button.style('background-color', 'red'); // set the bkg of this spefific button to red
                                buttons[i].clicked = true; // turn it to clicked true so no other client can click it!

                                buttons[i].soundFile.rate(rate); // start looping the file

                              }, (error)=>{console.error(error)}
                            )
    break; //exit the loop.
  }
  console.log('button not found :(');
}


})


class recorder{

  constructor(mic,x,y,w){
    this.x = x
    this.y = y
    this.w = w
    this.clicked = false;
    this.mic = mic
    this.name = "box-" + x + '-' + y // this object is unique name based on its location for file storage and recall.
    this.soundRec = new p5.SoundRecorder();
    this.soundRec.setInput(this.mic)

    this.soundFile = new p5.SoundFile();

    this.button = createDiv("");
    this.button.position(this.x,this.y);
    this.button.size(this.w,this.w);
    this.button.style('background-color', 'white');


    this.button.mouseClicked((e)=>{
      if (this.clicked == false){ //set up a gate so this object can only be clicked once
        console.log("recording....");
        this.button.style('background-color', 'red'); //change the color

        // console.log("manipulating audio...");
        // console.log(mouseX);
        // let rate = map(mouseX,0,width,-.2,1)
        // console.log(rate);
        // this.soundFile.rate(rate)// distort the sound using time, based on map
        // console.log("DONE manipulating audio...");

        this.soundRec.record(this.soundFile); // set up the soundfile to record and start recording




        let recordingTimer = setTimeout(()=>{ // setup a timer for the recording, after the time below do the tings inside the {}

          this.soundRec.stop(); // stop recording
          // console.log(this.soundFile);
          this.soundBlob = this.soundFile.getBlob(); //get the recorded soundFile's blob
          // console.log(this.soundFile)
          // console.log(this.soundBlob);

          let formdata = new FormData() ; //create a from to of data to upload to the server
          formdata.append('soundBlob', this.soundBlob,  this.name) ; // append the sound blob and the name of this object
          // console.log(formdata);

              // Now we can send the blob to a server...
          var serverUrl = '/upload'; //we've made a POST endpoint on the server at /upload
          //build a HTTP POST request
          var httpRequestOptions = {
            method: 'POST',
            body: formdata , // with our form data packaged above
            headers: new Headers({
              'enctype': 'multipart/form-data' // the enctype is important to work with multer on the server
            })
          };
          // console.log(httpRequestOptions);
          // use p5 to make the POST request at our URL and with our options
          httpDo(
            serverUrl,
            httpRequestOptions,
            (success)=>{ //if we were successful...
              console.log("recording successful: " + success)
              //if we successfully loaded, replace the soundfile with the uploaded version. leaving this here for reference, but this was moved into the socket section above so it will move across all clients.
              // this.soundFile = loadSound('uploads/'+ this.name + '.wav',
              //   (cb)=>{
              //     console.log('file loaded from server...');
              //     this.soundFile.loop();
              //   }, (error)=>{console.error(error)}
              // )

            },
            (error)=>{console.error(error);}
          )
          this.clicked = true //toggle the gate closed
          console.log('recording stopped');

        },3000) //3 seconds.
      } else{
        console.log('already recorded this one...')
      }

      let refreshTimer = setTimeout(()=>{
        this.clicked = false;
        this.button.mouseClicked;
        this.button.style('background-color', 'white');
        console.log('refreshed');
      },20000)

    })

  }


}

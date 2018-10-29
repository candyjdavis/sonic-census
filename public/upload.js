//
// let mic, soundFile, soundRec;
//
//
//
// function setup() {
//   mic = new p5.AudioIn();
//   mic.start();
//   soundFile = new p5.SoundFile();
//   soundRec = new p5.SoundRecorder();
//   soundRec.setInput(mic)
//
//   soundRec.record(soundFile)
//
//
//   let recordingTimer = setTimeout(()=>{
//     soundRec.stop();
//     console.log(soundFile)
//     console.log('recording stopped');
//   },1000) //1 second.
//
//    noCanvas();
//    var soundBlob = soundFile.getBlob();
//    // Now we can send the blob to a server...
//    var serverUrl = 'https://jsonplaceholder.typicode.com/posts';
//    var httpRequestOptions = {
//      method: 'POST',
//      body: new FormData().append('soundBlob', soundBlob),
//      headers: new Headers({
//        'Content-Type': 'multipart/form-data'
//      })
//    };
//    httpDo(serverUrl, httpRequestOptions);
//    // We can also create an `ObjectURL` pointing to the Blob
//    var blobUrl = URL.createObjectURL(soundBlob);
//    // The `<Audio>` Element accepts Object URL's
//    var htmlAudioElt = createAudio(blobUrl).showControls();
//    createDiv();
//    // The ObjectURL exists as long as this tab is open
//    var input = createInput(blobUrl);
//    input.attribute('readonly', true);
//    input.mouseClicked(function() { input.elt.select() });
// }



 function preload() {
     mySound = loadSound('assets/drum.mp3');
   }

   function setup() {
     noCanvas();
     var soundBlob = mySound.getBlob();

     // Now we can send the blob to a server...
     var serverUrl = 'https://jsonplaceholder.typicode.com/posts';
     var httpRequestOptions = {
       method: 'POST',
       body: new FormData().append('soundBlob', soundBlob),
       headers: new Headers({
         'Content-Type': 'multipart/form-data'
       })
     };
     httpDo(serverUrl, httpRequestOptions);

     // We can also create an `ObjectURL` pointing to the Blob
     var blobUrl = URL.createObjectURL(soundBlob);

     // The `<Audio>` Element accepts Object URL's
     var htmlAudioElt = createAudio(blobUrl).showControls();

     createDiv();

     // The ObjectURL exists as long as this tab is open
     var input = createInput(blobUrl);
     input.attribute('readonly', true);
     input.mouseClicked(function() { input.elt.select() });
   }

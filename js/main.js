console.log("Audio_art");

// define audio context
// create sound source
const audioCtx = new(window.AudioContext || window.wekitAudioContext)();


//Activate Mic with user permission
window.onload = function () {
  // add constraints object
  const constraints = { audio: true };
  // call getUserMedia
  navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream) {
    const audio = document.querySelector('audio');
    audio.srcObject = mediaStream;
    //audio.play();
  }).catch(function(err){
    console.log("Web Audio API not support");
  })
}

// Detect Mic audio
// extract data from audio source, and node connected to your audio source at same point between your source and destination
const analyser = audioCtx.createAnalyser();
source = audioCtx.createMediaStreamSource(Stream); // connect source to destination.
source.connect(analyser);
analyser.connect(distortion);
distortion.connect(audioCtx.destination);

//Collecting data from the audio source
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount; // frequency data for 32-bit floating point numbers.
const dataArray = new Unit8Array(bufferLength); // Unit8Array for TimeDomainData array

// detect BMP from audio


// clear canvas
canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

function draw () {
  const drawVisual = requestAnimationFrame(draw); // loop drawing function once started.
  //Retreive data and copy into array
  analyser.getByteTimeDomainData(dataArray);
  canvasCtx.fillStyle = 'rgb(200, 200, 200)'; // fill canvas
  canvasCtx.fillRect(0, 0, WIDTH, HEIGH);

  // Set a line width and stroke colour for the wave we will draw, then begin drawing a path
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = 'rbg(0,0,0)';
  canvasCtx.beginPath(); // begin drawing path

  //determin width of each segment of the line to be draw
  const sliceWidth = WIDTH * 1.0 / bufferLength;
  const x = 0;

  //run through loop
  for (var i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = v * HEIGHT / 2;

    if( i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
    x += slideWidth;
  }
  canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();
};

draw();

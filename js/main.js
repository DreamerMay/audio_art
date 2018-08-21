console.log("Audio_art");

// define audio context
// create sound source
const audioCtx = new(window.AudioContext || window.wekitAudioContext)();
const analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;

//Activate Mic with user permission
window.onload = function () {
  // add constraints object
  const constraints = { audio: true };
  // call getUserMedia
  navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream) {
    const audio = document.querySelector('audio');
    audio.srcObject = mediaStream;
    // audio.play();
    source.connect(analyser);
    analyser.connect(distortion);
    distortion.connect(audioCtx.destination);
    draw ()
  }).catch(function(err) {
    console.log("Web Audio API not support");
  })
  function analyserAudio(stream) {
    source = audioCtx.createMediaStreamSource(stream); // connect source to destination.
  }
}


analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount; // frequency data for 32-bit floating point numbers.
console.log(bufferLength);
const dataArray = new Uint8Array(bufferLength); // Unit8Array for TimeDomainData array
console.log(dataArray);

// TODO detect BMP from audio

const canvas = document.getElementById('canvas');
const canvasCtx = canvas.getContext('2d');

WIDTH = canvas.width;
HEIGHT = canvas.height;
canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

function draw () {
  const drawVisual = requestAnimationFrame(draw); // loop drawing function once started.
  //Retreive data and copy into array
  analyser.getByteTimeDomainData(dataArray);
  console.log(dataArray);
  canvasCtx.fillStyle = 'rgb(200, 200, 200)'; // fill canvas
  canvasCtx.fillRect(0, 0, WIDTH, HEIGH);

  // Set a line width and stroke colour for the wave we will draw, then begin drawing a path
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = 'rbg(0,0,0)';

  canvasCtx.beginPath(); // begin drawing path

  //determin width of each segment of the line to be draw
  const sliceWidth = WIDTH * 1.0 / bufferLength;
  const x = 0;

  for (var i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = v * HEIGHT / 2;

    if( i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
    x += sliceWidth;
  }
  canvasCtx.lineTo(canvas.width, canvas.height/2);
  canvasCtx.stroke();
};

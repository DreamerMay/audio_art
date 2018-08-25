console.log("Audio_art");
// TODO: get BMP http://joesul.li/van/beat-detection-using-web-audio/


const canvas = document.getElementById('canvas');
const canvasCtx = canvas.getContext('2d');
const audioCtx = new(window.AudioContext || window.wekitAudioContext)();
const analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;


var distortion = audioCtx.createWaveShaper();
var gainNode = audioCtx.createGain();
var biquadFilter = audioCtx.createBiquadFilter();
// need to add to remove echo or direct source to correct audio path
// source = audioCtx.createMediaStreamSource(stream);
// source.connect(analyser);
// analyser.connect(distortion);
// distortion.connect(audioCtx.destination);

let source;
//================
// USER CONTROL
//================


$("#microphone").on('click', function () {
  // add constraints object
  const constraints = { audio: true };

  // call getUserMedia
  navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream) {
    const audio = document.querySelector('audio');
    source = audioCtx.createMediaStreamSource(mediaStream); // connect source to destination.

    audio.srcObject = mediaStream;
    // Detect Mic audio

    source.connect(analyser);
    analyser.connect(distortion);
    distortion.connect(biquadFilter);
    biquadFilter.connect(gainNode);
    gainNode.connect(audioCtx.destination);


    draw();

    //TODO come back with mute Function
    const mute = document.querySelector('.mute');
    // source.connect(gainNode);
    // gainNode.connect(audioCtx.destination);
    mute.onclick = micMute;

    function micMute() {
      if (mute.id == "") {
        console.log(audioCtx.currentTime);
        gainNode.gain.setValueAtTime(Number.MIN_VALUE, audioCtx.currentTime);

        mute.id = "activated";
        mute.innerHTML = "Unmute";
      } else {
        console.log(audioCtx.currentTime);
        gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        mute.id = "";
        mute.innerHTML = "Mute";
      }
    };

  }).catch(function(err){
    console.log("Web Audio API not support", err);
  })
});



//Import Audio ////////////////////////////
//Creating an audio object
const audioSrc = new Audio();
// audioSrc.src = 'https://github.com/DreamerMay/audio_art/blob/master/assets/Love.mp3';
audioSrc.src = 'assets/Intro.mp3';
audioSrc.controls = true;
audioSrc.autoplay = false;
audioSrc.loop = true;

const sourceNode = audioCtx.createMediaElementSource(audioSrc);
analyser.smoothingTimeConstant = 0.0;
sampleSize = 1024;
const scriptNode = audioCtx.createScriptProcessor(sampleSize, 1, 1);

//Connecting nodes
sourceNode.connect(analyser);
analyser.connect(scriptNode);
//remove this to have only gain go through destination.
// analyser.connect(audioCtx.destination);
// scriptNode.connect(audioCtx.destination);

analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount; // frequency data for 32-bit floating point numbers.
const dataArray = new Uint8Array(bufferLength); // Unit8Array for TimeDomainData array

// Play sound & Visualise
$("#start").on('click', function() {
  audioSrc.play();
  audioCtx.resume().then(() => {

    console.log("Playback resumed successfully");
  });
  scriptNode.onaudioprocess = function () {
    analyser.getByteTimeDomainData(dataArray);
    getPeakAtThreshold(dataArray, threshold);
    draw();
  }
});

$("#stop").on('click', function() {
  audioSrc.pause();
  audioSrc.currentTime = 0;
});


function draw () {

  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;

  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  const drawVisual = requestAnimationFrame(draw); // loop drawing function once started.
  //Retreive data and copy into array
  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.fillStyle = 'rgb(0, 0, 0)'; // fill canvas
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  // Set a line width and stroke colour for the wave we will draw, then begin drawing a path
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = 'rgb(255,0,127)';

  canvasCtx.beginPath(); // begin drawing path

  //determin width of each segment of the line to be draw
  var sliceWidth = WIDTH * 1.0 / bufferLength;
  var x = 0;

  //run through loop
  for (var i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = v * HEIGHT/2;

    if( i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
    x += sliceWidth;

  }
  canvasCtx.lineTo(window.width, window.height/2);
    canvasCtx.stroke();
};

// Function to identify peaks
function getPeakAtThreshold(data, threshold) {
  const peaksArray = [];
  const length = data.length;
  for (var i = 0; i < length; ) {
    if (data[i] > thereshold) {
      peaksArray.push(i);
      // Skip forward ~ 1/4s to get past this peak.
      i += 10000;
    }
    i++;
  }
  return peaksArray
}

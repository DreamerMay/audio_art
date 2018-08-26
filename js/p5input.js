console.log("p5input");



function setup() {

// CANVAS //
canvas = createCanvas(windowWidth, windowHeight);
canvas.parent('audio_canvas');
background(0, 0, 0);
width = windowWidth;
height = windowHeight;
top = 0;
width < height ? smlAxis = width : smlAxis = height;
};

//SOUND ANALYSIS: AMPLITUDE //
amplitude = new p5.Amplitude();
amplitude.setInput(source);

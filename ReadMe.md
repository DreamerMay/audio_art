##Detect BMP

The code consists of preparation code written for the answer:

reading a local file over the FileReader API
decoding the file as audio data using the AudioContext API
and then, as described in the article:

filtering the audio, in this example with a low-pass filter
calculating peaks using a threshold
grouping interval counts and then tempo counts
For the threshold I used an arbitrary value of .98 of the range between maximum and minimum values; when grouping I added some additional checks and arbitrary rounding to avoid possible infinite loops and make it an easy-to-debug sample.

Note that commenting is scarce to keep the sample implementation brief because:

the logic behind processing is explained in the referenced article
the syntax can be referenced in the API docs of the related methods


## Adding soundcloud :
https://codepen.io/DonKarlssonSan/post/fun-with-web-audio-api

# run local drive to test avoice music error use in terminal
 python -m SimpleHTTPServer

 P5.js example:
 https://p5js.org/examples/input-storing-input.html

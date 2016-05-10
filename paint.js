var synaptic = require('synaptic'); // this line is not needed in the browser
var fs = require('fs');
var Canvas = require('canvas')
  , canvas = new Canvas(125, 125)
  , context = canvas.getContext('2d');
var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;
//var imagedata = fs.readFileSync('twitter.png');
var image = new Canvas.Image();
image.src = "twitter.png";
var perceptron = null;
var worker = null;
var index = 0;
var size = 125 * 125;
var iteration = 0;
var to = null;
var px = null;
var twitter_data = null;

var getData = function(imageObj){
  context.drawImage(imageObj, 0, 0);
  var imageData = context.getImageData(0, 0, 125, 125);
  return imageData.data;
}

var train = function(){
		iteration = 0;
		to && clearTimeout(to);
		perceptron = new Architect.Perceptron(2,15,3);
    twitter_data = getData(image);
    preview();
}

var iterate = function(){
	for (var x = 0; x < 125; x+=1)
	{
		for(var y = 0; y < 125; y+=1)
		{
			var dynamicRate =  .01/(1+.0005*iteration);
			perceptron.activate([x/125,y/125]);
			perceptron.propagate(dynamicRate, pixel(twitter_data,x,y));
		}
	}
  preview();
}

var pixel = function(data,x,y){
  var red = data[((125 * y) + x) * 4];
  var green = data[((125 * y) + x) * 4 + 1];
  var blue = data[((125 * y) + x) * 4 + 2];
  return [red / 255, green / 255, blue / 255];
}

var preview = function(){
  console.log(++iteration);
  var imageData = context.getImageData(0, 0, 125, 125);
  for (var x = 0; x < 125; x++)
  {
    for(var y = 0; y < 125; y++)
    {
      var rgb = perceptron.activate([x/125,y/125]);
      imageData.data[((125 * y) + x) * 4] = (rgb[0] )* 255;
      imageData.data[((125 * y) + x) * 4 + 1] = (rgb[1] ) * 255;
      imageData.data[((125 * y) + x) * 4 + 2] = (rgb[2] ) * 255;
    }
  }
  context.putImageData(imageData,0,0);
  if (iteration <20000){
    if( iteration % 100 == 0 ) {
      var img = canvas.toDataURL();
      var data = img.replace(/^data:image\/\w+;base64,/, "");
      var buf = new Buffer(data, 'base64');
      fs.writeFile('images/image'+index+'.png', buf);
      index++;
    }
    iterate();
  } else {
    var img = canvas.toDataURL();
    var data = img.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    fs.writeFile('images/image'+index+'.png', buf);
  }
}

train();

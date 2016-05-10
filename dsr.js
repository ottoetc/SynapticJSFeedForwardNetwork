var synaptic = require('synaptic'); // this line is not needed in the browser
var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

var LSTM = null;

var targets = [2,4];
var distractors = [3,5];
var prompts = [0, 1];
var length = 10;

var sequence = null;
var sequenceLength = 0;
var targetsCorrect = 0;
var distractorsCorrect = 0;
var indexes = [];
var positions = [];
var symbol = 0;
var symbols = targets.length + distractors.length + prompts.length;
var json = null;
var sequence = [];

var train = function(){

		var inputs = 6;
		var outputs = 2;
		var hidden = 7;

		// create long short term memory network
		LSTM = new Architect.LSTM(inputs,hidden,outputs);

		setTimeout(function(){

				var results = LSTM.trainer.DSR({
					targets: targets,
					distractors: distractors,
					prompts: prompts,
					length: length,
					iterations: 250000,
					rate: .17
				});

				if (results.iterations < 250000)
				{
					results = results;
					validate();
          console.log(results);
          console.log(symbols);
				} else{
					train();
				}
			}, 32);
	}

	var validate = function(){

		sequence = [], sequenceLength = length - prompts.length;
		for (i  = 0; i < sequenceLength; i ++)
		{
			var any = Math.random() * distractors.length | 0;
			sequence.push(distractors[any]);
		}
		indexes = [], positions = [];
		for (i = 0; i < prompts.length; i ++)
		{
			indexes.push(Math.random() * targets.length | 0);
			positions.push(noRepeat(sequenceLength, positions));
		}
		positions = positions.sort();
		for (i = 0; i < prompts.length; i ++)
		{
			sequence[positions[i]] = targets[indexes[i]];
			sequence.push(prompts[i]);
		}
		targetsCorrect = distractorsCorrect = symbol = 0;
    console.log(sequence);
    console.log(positions);
		sequence = [];

		next();

	}

	var next = function(){
		// generate input from sequence
		var input = [];
		for (var j = 0; j < symbols; j++)
			input[j] = 0;
		input[sequence[symbol]] = 1;

		// generate target output
		var output = [];
		for (j = 0; j < targets.length; j++)
			output[j] = 0;

		if (symbol >= sequenceLength)
		{
			var index = symbol - sequenceLength;
			output[indexes[index]] = 1;
		}

		// check result
		var prediction = LSTM.activate(input);
		var ok = equal(prediction, output);
		if (ok)
			if (i < sequenceLength)
				distractorsCorrect++;
			else
				targetsCorrect++;
		var val = value(prediction);

		sequence.push({
			input: sequence[symbol],
			output: targets[val],
			ok: ok
		});

  }

	var noRepeat = function(range, avoid)
	{
		var number = Math.random() * range | 0;
		var used = false;
		for (var i in avoid)
			if (number == avoid[i])
				used = true;
		return used ? noRepeat(range, avoid) : number;
	}
	var equal = function(prediction, output){
		for (var i in prediction)
			if (Math.round(prediction[i]) != output[i])
				return false;
		return true;
	}

	var value = function(array){
		var max = .5;
		var res = -1;
		for (var i in array)
			if (array[i] > max)
			{
				max = array[i];
				res = i;
			}
		return res == -1 ? 'none' : res;
	}

  train();

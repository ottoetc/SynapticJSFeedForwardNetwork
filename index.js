var synaptic = require('synaptic'); // this line is not needed in the browser
var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

var perceptron = null;

outputs = [];

var train = function(){
		perceptron = new Architect.Perceptron(2,3,1);
		results = perceptron.trainer.XOR({
			iterations: 100000,
			error: .0001,
			rate: 1
		});
		validate();
	}

	var validate = function(){
		outputs = [];
		outputs.push({
			input: '0 0',
			output: perceptron.activate([0,0])[0].toFixed(3),
			target: 0
		});
		outputs.push({
			input: '0 1',
			output: perceptron.activate([0,1])[0].toFixed(3),
			target: 1
		});
		outputs.push({
			input: '1 0',
			output: perceptron.activate([1,0])[0].toFixed(3),
			target: 1
		});
		outputs.push({
			input: '1 1',
			output: perceptron.activate([1,1])[0].toFixed(3),
			target: 1
		});
	}

train();
console.log(outputs);
// var A = new Neuron();
// var B = new Neuron();
// A.project(B);
//
// var learningRate = .3;
//
// for(var i = 0; i < 200000; i++)
// {
//     // when A activates 1
//     A.activate(1);
//
//     // train B to activate 0
//     B.activate();
//     B.propagate(learningRate, 0);
// }
//
// // test it
// A.activate(1);
// console.log(B.activate()); // 0.006540565760853365

var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// thanks http://stackoverflow.com/questions/1583123/circular-buffer-in-javascript !!

// Circular buffer storage. Externally-apparent 'length' increases indefinitely
// while any items with indexes below length-n will be forgotten (undefined
// will be returned if you try to get them, trying to set is an exception).
// n represents the initial length of the array, not a maximum

function CircularBuffer(n) {
    this._array= new Array(n);
    this.length= 0;
}
CircularBuffer.prototype.toString= function() {
    return '[object CircularBuffer('+this._array.length+') length '+this.length+']';
};
CircularBuffer.prototype.get= function(i) {
    if (i<0 || i<this.length-this._array.length)
        return undefined;
    return this._array[i%this._array.length];
};
CircularBuffer.prototype.set= function(i, v) {
    if (i<0 || i<this.length-this._array.length)
        throw CircularBuffer.IndexError;
    while (i>this.length) {
        this._array[this.length%this._array.length]= undefined;
        this.length++;
    }
    this._array[i%this._array.length]= v;
    if (i==this.length)
        this.length++;
};
CircularBuffer.IndexError= {};

var buffers = new Array();
var index = 0;

function average(buffer, index) {
  var result = 0.0;

  for (var i=0; i<buffer._array.length; i++) {
    result += parseFloat(buffer.get(index-i));
  }
  result /= buffer._array.length;

  return result.toFixed(3);
}

rl.on('line', function(line) {
  var in_data = line.split("	");
  var out_data = "";

  for (var i=0; i<in_data.length; i++) {

    // if this line represents more sensors than we currently have ring buffers for, just start a new one
    if ((buffers.length-1) < i) {
      buffers.push(new CircularBuffer(30));
    }

    buffers[i].set(index, in_data[i]);
    out_data += average(buffers[i], index) + "\t";
  }

  if (out_data.indexOf("NaN") == -1) {
    // don't output until we have filled our buffers
    console.log(out_data);
  }

  index++;
})

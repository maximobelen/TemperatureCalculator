var model = require('spooky-model');

var Lx = 10;
var Ly = 2;
var Lz = 5;

var tf = 0.4;
var h = 0.5;
var ht = 0.01;

var Nt = tf/ht,
Nx = Lx/h,
Ny = Ly/h,
Nz = Lz/h;

var ambientTemperature = 25;
var temps = model.getContent('bar').temperatures;

function CalculateTemperature(x, y, z, t) {

    if( (x >= -5 && x <= 5) && (y >= -2.5 && y <= 2.5)  && (z >= -1  && z <= 1)){
      var i = returnIndex(x, y, z, t);
      return temps[i];

    }else{

      return ambientTemperature;
    }
}

function returnIndex(x, y, z, t) {
    var index = z + (Nz + 1) * y + ((Ny + 1) * (Nz + 1)) * x + ((Nz + 1) * (Ny + 1) * (Nx + 1)) * t;
    return index;
}

module.exports = CalculateTemperature;

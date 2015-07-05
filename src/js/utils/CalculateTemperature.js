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


var CalculateTemperature = {

  calculateTemperature: function (x, y, z, t) {

    if( (x >= 0 && x <= 10) && (y >= 0 && y <= 2)  && (z >= 0  && z <= 5)){
      var i = this.returnIndex(x, y, z, t);
      return temps[i];

    }else{

      return ambientTemperature;
    }
  },

  returnIndex: function (x, y, z, t) {
      var index = z + (Nz + 1) * y + ((Ny + 1) * (Nz + 1)) * x + ((Nz + 1) * (Ny + 1) * (Nx + 1)) * t;
      return index;
  },

  getTempsForPoint:function (x, y, z) {
      
      var temperatures = [];
      
      for(var i = 0; i < Nt; i++){
        var index = this.returnIndex(x, y, z, i);
        temperatures.push(temps[index]);
      }
      return temperatures;
  },

  getLabelsForTemps:function () {
      
      var labels = [];
      
      for(var i = 0; i < Nt; i++){
        labels.push(i);
      }
      return labels;
  }

};

module.exports = CalculateTemperature;


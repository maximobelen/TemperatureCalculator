var ambientTemperature = 25;
function CalculateTemperature(x, y, z, t) {
    
    if( (x > -100 && x < 100) && (y > -50 && y < 50)  && (z > -20  && z < 20)){
      return 100;
    }

    return ambientTemperature;
}

module.exports = CalculateTemperature;

var SpookyEl = require('spooky-element');

class Thermometer extends SpookyEl {

    constructor(data){


        this.template = require('../templates/ui/Thermometer.hbs');

        super(data);

        this.degrees = 0;
        this.mercury = new SpookyEl('.mercury', this);
        this.mercury.top = 388;

    }

    animateIn(){

        TweenMax.fromTo(this, 1.5, {
            y: 1000,
            autoAlpha:0
        }, {
            y: 0,
            autoAlpha:1,
            ease: Expo.easeOut
        });
      
    }



}

module.exports = Thermometer;
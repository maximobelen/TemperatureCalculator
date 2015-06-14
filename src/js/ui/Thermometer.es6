var SpookyEl = require('spooky-element');
var domSelect = require('dom-select');
var TweenMax = require('gsap');


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
            ease: Expo.easeIn
        });
      
    }

    animateOut(){

        TweenMax.fromTo(this, 1.5, {
            y: 0,
            autoAlpha:1
        }, {
            y: 1000,
            autoAlpha:0,
            ease: Expo.easeOut
        });
      
    }

    setTemperature(temperature){

        this.degrees = temperature;

        var hundredPercent= 342;

        var height = (hundredPercent * this.degrees) / 100
        TweenMax.to(this.mercury, 1.5, {
            height:height,
            ease: Linear.easeIn
            //top:this.mercury.top
        });
            
        domSelect('.degrees',this.view).innerHTML = this.degrees;
        
    }

    calculateTemperature(){

        if(!this.mercury.top <= 46){
            this.degrees = this.degrees + 1;
            this.mercury.top += -3;

            TweenMax.to(this.mercury, 0.5, {
                height:this.degrees * 3,
                top:this.mercury.top
            });
                
            domSelect('.degrees',this.view).innerHTML = this.degrees;
        }
    }



}

module.exports = Thermometer;
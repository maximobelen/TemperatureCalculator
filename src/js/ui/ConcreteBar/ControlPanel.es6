var SpookyEl = require('spooky-element');
var Signal = require('signals');
var TweenMax = require('gsap');
var router = require('../../router-main');

class ControlPanel extends SpookyEl {

    constructor(data){


        this.template = require('../../templates/ui/ConcreteBar/ControlPanel.hbs');

        super(data);

        this.temperatureCalculate = new SpookyEl('.button-temperature', this);
        this.home = new SpookyEl('.home-button', this);
        this.pointForm = new SpookyEl('.point-form', this);
        this.isEmpty = true;

        this.onCalculateTemperature = new Signal();

        this.addListeners();



    }

    animateIn(){

      TweenMax.fromTo(this.pointForm, 1.5, {
            x: -200,
            autoAlpha: 1
        }, {
            x: 0,
            ease: Expo.easeIn
      });

      TweenMax.fromTo(this.home, 1.5, {
          autoAlpha:0
      }, {
          autoAlpha:0.8,
          ease: Expo.easeIn
      });

      
    }

    addListeners(){

      this.temperatureCalculate.on( 'click', (e) => {
        e.preventDefault();
        this.onCalculateTemperature.dispatch();
      });


      this.home.on( 'click', () =>{
            router.go('home');
            this.animateOut();
      } );

      this.temperatureCalculate.on( 'mouseenter', () => {
          TweenMax.to(this.temperatureCalculate, 0.5, {
            autoAlpha:1
          });
      });

      this.home.on( 'mouseenter', () => {
          TweenMax.to(this.home, 0.5, {
            autoAlpha:1
          });
      });

      this.home.on( 'mouseleave', () => {
          TweenMax.to(this.home, 0.5, {
            autoAlpha:0.8
          });
      });

      this.temperatureCalculate.on( 'mouseleave', () => {
          TweenMax.to(this.temperatureCalculate, 0.5, {
            autoAlpha:0.8
          });
      });


    }

}
module.exports = ControlPanel;
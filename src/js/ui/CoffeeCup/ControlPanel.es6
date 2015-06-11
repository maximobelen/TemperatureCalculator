var SpookyEl = require('spooky-element');
var Signal = require('signals');
var TweenMax = require('gsap');
var router = require('../../router-main');

class ControlPanel extends SpookyEl {

    constructor(data){


        this.template = require('../../templates/ui/CoffeeCup/ControlPanel.hbs');

        super(data);

        this.temperatureCalculate = new SpookyEl('.button-temperature', this);
        this.addCafe = new SpookyEl('.button-add-cafe', this);
        this.home = new SpookyEl('.home-button', this);
        this.isEmpty = true;

        this.onAddCafe = new Signal();
        this.onCalculateTemperature = new Signal();

        this.addListeners();



    }

    animateIn(){

      TweenMax.fromTo(this.temperatureCalculate, 1.5, {
            x: -100,
            autoAlpha:0
        }, {
            x: 0,
            delay:0.1,
            autoAlpha:0.8,
            ease: Expo.easeIn
      });

      TweenMax.fromTo(this.home, 1.5, {
          autoAlpha:0
      }, {
          autoAlpha:0.8,
          ease: Expo.easeIn
      });

      TweenMax.fromTo(this.addCafe, 1.5, {
          x: -100,
          autoAlpha:0
      }, {
          x: 0,
          delay:0.1,
          autoAlpha:0.8,
          ease: Expo.easeIn
      });
      
    }

    addListeners(){

      this.temperatureCalculate.on( 'click', () => {
        this.onCalculateTemperature.dispatch();
      });

      this.addCafe.on( 'click', () =>{
          if(this.isEmpty){
              this.onAddCafe.dispatch();
              this.isEmpty = false;
          }

      } );

      this.home.on( 'click', () =>{
            router.go('home');
            this.animateOut();
      } );

      this.temperatureCalculate.on( 'mouseenter', () => {
          TweenMax.to(this.temperatureCalculate, 0.5, {
            autoAlpha:1
          });
      });

      this.addCafe.on( 'mouseenter', () => {
          TweenMax.to(this.addCafe, 0.5, {
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

      this.addCafe.on( 'mouseleave', () => {
          TweenMax.to(this.addCafe, 0.5, {
            autoAlpha:0.8
          });
      });

    }

}
module.exports = ControlPanel;
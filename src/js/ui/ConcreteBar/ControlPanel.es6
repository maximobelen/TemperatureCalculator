var SpookyEl = require('spooky-element');
var Signal = require('signals');
var TweenMax = require('gsap');
var router = require('../../router-main');
var domSelect = require('dom-select');


class ControlPanel extends SpookyEl {

    constructor(data){


        this.template = require('../../templates/ui/ConcreteBar/ControlPanel.hbs');

        super(data);

        this.temperatureCalculate = new SpookyEl('.button-temperature', this);
        this.home = new SpookyEl('.home-button', this);
        this.pointForm = new SpookyEl('.point-form', this);
        this.isEmpty = true;

        this.onCalculateTemperature = new Signal();

        this.xInput =  new SpookyEl('.x-value', this);
        this.yInput =  new SpookyEl('.y-value', this);
        this.zInput =  new SpookyEl('.z-value', this);
        this.tInput =  new SpookyEl('.t-value', this);
        
        this.xValue = 0;
        this.yValue = 0;
        this.zValue = 0;
        this.tValue = 0;

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
      var _this = this;
      this.temperatureCalculate.on( 'click', (e) => {
        e.preventDefault();
        _this.onCalculateTemperature.dispatch();

        domSelect('.x-value',_this).innerHTML = "";
        domSelect('.y-value',_this).innerHTML = "";
        domSelect('.z-value',_this.view).innerHTML = "";
        domSelect('.t-value',_this.view).innerHTML = "";
      });

      this.xInput.on('input', (e) => {
        this.xValue = e.target.value;
      });
      this.yInput.on('input', (e) => {
        this.yValue = e.target.value;
      });
      this.zInput.on('input', (e) => {
        this.zValue =  e.target.value;
      });
      this.tInput.on('input', (e) => {
        this.tValue =  e.target.value;
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
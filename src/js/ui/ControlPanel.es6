var SpookyEl = require('spooky-element');
var Signal = require('signals');
var TweenMax = require('gsap');
var router = require('../router-main');
var domSelect = require('dom-select');


class ControlPanel extends SpookyEl {

    constructor(data){


        this.template = require('../templates/ui/ControlPanel.hbs');

        super(data);

        this.temperatureCalculate = new SpookyEl('.button-temperature', this);
        this.graph = new SpookyEl('.button-graphic', this);
        this.graphMaxTemp = new SpookyEl('.button-graphic-max-temp', this);

        this.home = new SpookyEl('.home-button', this);
        this.pointForm = new SpookyEl('.point-form', this);
        this.isEmpty = true;

        this.onCalculateTemperature = new Signal();
        this.onClickGraph = new Signal();
        this.onClickMaxTemp = new Signal();

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
            ease: Expo.easeOut
      });

      TweenMax.fromTo(this.home, 1.5, {
          autoAlpha:0
      }, {
          autoAlpha:1,
          ease: Expo.easeOut
      });

    }

    addGraphListeners(){

      TweenMax.to(this.graph, 0.2, {
        autoAlpha:1
      });

      this.graph.on( 'click', (e) => {
        e.preventDefault();
        this.onClickGraph.dispatch();
      });

      this.graph.on( 'mouseenter', () => {
          TweenMax.to(this.graph, 0.2, {
            autoAlpha:0.6
          });
      });

      this.graph.on( 'mouseleave', () => {
          TweenMax.to(this.graph, 0.2, {
            autoAlpha:1
          });
      });

      this.graph.removeClass('disable');

    }

    addListeners(){

      this.temperatureCalculate.on( 'click', (e) => {
        e.preventDefault();
        this.onCalculateTemperature.dispatch();

        domSelect('.x-value', this).innerHTML = 0;
        domSelect('.y-value', this).innerHTML = 0;
        domSelect('.z-value', this.view).innerHTML = 0;
        domSelect('.t-value', this.view).innerHTML = 0;
      });

      this.graphMaxTemp.on( 'click', (e) => {
        this.onClickMaxTemp.dispatch();
      });

      this.xInput.on('input', (e) => {
        this.xValue = e.target.valueAsNumber;
      });
      this.yInput.on('input', (e) => {
        this.yValue = e.target.valueAsNumber;
      });
      this.zInput.on('input', (e) => {
        this.zValue =  e.target.valueAsNumber;
      });
      this.tInput.on('input', (e) => {
        this.tValue =  e.target.valueAsNumber;
      });

      this.home.on( 'click', () =>{
            router.go('home');
            this.animateOut();
      });

      this.temperatureCalculate.on( 'mouseenter', () => {
          TweenMax.to(this.temperatureCalculate, 0.2, {
            autoAlpha:0.6
          });
      });

      this.temperatureCalculate.on( 'mouseleave', () => {
          TweenMax.to(this.temperatureCalculate, 0.2, {
            autoAlpha:1
          });
      });

      this.home.on( 'mouseenter', () => {
          TweenMax.to(this.home, 0.2, {
            autoAlpha:0.6
          });
      });

      this.home.on( 'mouseleave', () => {
          TweenMax.to(this.home, 0.2, {
            autoAlpha:1
          });
      });

      this.graphMaxTemp.on( 'mouseenter', () => {
          TweenMax.to(this.graphMaxTemp, 0.2, {
            autoAlpha:0.6
          });
      });

      this.graphMaxTemp.on( 'mouseleave', () => {
          TweenMax.to(this.graphMaxTemp, 0.2, {
            autoAlpha:1
          });
      });

    }

}
module.exports = ControlPanel;
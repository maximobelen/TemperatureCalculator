var SpookyEl = require('spooky-element');
var THREE = require('three');
var TweenMax = require('gsap');
var Signal = require('signals');
var Thermometer = require('../ui/Thermometer');
var ControlPanel = require('../ui/ConcreteBar/ControlPanel');
var Canvas = require('../ui/Canvas');
var router = require('../router-main');
var Chart = require('../libs/Chart');
var calculateTemperature = require('../utils/CalculateTemperature');

class ConcreteBar extends SpookyEl {

    constructor(data){


        this.template = require('../templates/sections/ConcreteBar.hbs');
         // renderer

        super(data);

        this.layerShown = false;

        this.title = new SpookyEl('.coffee-cup-title', this);

        this.thermometer = new Thermometer();
        this.thermometer.appendTo(this);

        this.controlPanel = new ControlPanel();
        this.controlPanel.appendTo(this);

        this.canvas = new Canvas({isConcreteBar:true});
        this.canvas.appendTo(this);

        this.chart = this.find('.temperatureChart');
        this.closeIcon = new SpookyEl('.close-icon', this);

        this.closeIcon.on( 'click', (e) => {
            this.hideGraph();
        });
        this.closeIcon.on( 'mouseenter', () => {
            if(this.layerShown){
              TweenMax.to(this.closeIcon, 0.2, {
                autoAlpha:0.6
              });
            }
        });

        this.closeIcon.on( 'mouseleave', () => {
            if(this.layerShown){
              TweenMax.to(this.closeIcon, 0.2, {
                autoAlpha:1
              });
            }
        });


        this.layer = this.find('.layer');

        this.controlPanel.onCalculateTemperature.add(this.calculatePointerTemperature.bind(this));
        this.controlPanel.onClickGraph.add(this.showGraph.bind(this));

        this.canvas.onCanvasReady.add(this.animate.bind(this));

        window.addEventListener( 'resize', this.resize.bind(this), false );

     }

     animateIn(){

        var _this = this;
        TweenMax.fromTo(this, 0.5, {
            autoAlpha:0
        }, {
            autoAlpha:1,
            ease: Expo.easeIn,
            onComplete: function(){
                _this.canvas.animate();
                _this.thermometer.animateIn();
                _this.controlPanel.animateIn();

                TweenMax.fromTo(_this.title, 0.6, {
                    autoAlpha:0
                }, {
                    autoAlpha:1,
                    ease: Expo.easeOut
                });
            }
        });
    }

    animateOut(){

        var _this = this;
        this.thermometer.animateOut();

        TweenMax.fromTo(this, 0.5, {
            autoAlpha:1
        }, {
            autoAlpha:0,
            ease: Expo.easeOut,
            onComplete:function(){
                _this.remove();
            }
        });

    }

    animate(){

    }

    calculatePointerTemperature(){
        var temperature = calculateTemperature(this.controlPanel.xValue,this.controlPanel.yValue,this.controlPanel.zValue, this.controlPanel.tValue);
        temperature = Math.round(temperature * 100) / 100;
        this.thermometer.setTemperature(temperature);
        this.canvas.addPoint(this.controlPanel.xValue,this.controlPanel.yValue,this.controlPanel.zValue, temperature);
        this.canvas.addParticles(this.controlPanel.xValue,this.controlPanel.yValue,this.controlPanel.zValue);
        this.addGraph();
        this.controlPanel.addGraphListeners();
    }

    addGraph(){
        var data = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
            ]
        };

        var myLineChart = new Chart(this.chart._view.getContext("2d")).Line(data, {});
    }

    showGraph(){

        TweenMax.to(this.layer, 0.5, {
            autoAlpha:0.8,
            zIndex: 20,
            ease: Expo.easeOut
        });

        TweenMax.to(this.chart, 0.5, {
            autoAlpha:1,
            delay:0.3
        });

        TweenMax.to(this.closeIcon, 0.5, {
            autoAlpha:1,
            delay:0.4,
            zIndex: 25,
            ease: Expo.easeOut
        });

        this.thermometer.animateOut();

        this.layerShown = true;
    }

    hideGraph(){

        TweenMax.to(this.layer, 0.5, {
            autoAlpha:0,
            delay:0.4,
            zIndex: 0,
            ease: Expo.easeOut
        });

        TweenMax.to(this.chart, 0.5, {
            autoAlpha:0
        });

        TweenMax.to(this.closeIcon, 0.5, {
            autoAlpha:0,
            zIndex: 0,
            ease: Expo.easeOut

        });
        
        this.thermometer.animateIn();

        this.layerShown = false;
    }

    resize(){

        this.canvas.camera.aspect = window.innerWidth / window.innerHeight;
        this.canvas.camera.updateProjectionMatrix();

        this.canvas.renderer.setSize( window.innerWidth, window.innerHeight );
        this.canvas.resize();

    }

    paramsChanged(params) {
        console.log('Navigating to --> '+router.currentRoute.name);
        if(router.currentRoute.name != 'concrete'){
            this.animateOut();
        }
    }


}

module.exports = ConcreteBar;
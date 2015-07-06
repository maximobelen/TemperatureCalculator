var SpookyEl = require('spooky-element');
var THREE = require('three');
var TweenMax = require('gsap');
var Signal = require('signals');
var Thermometer = require('../ui/Thermometer');
var ControlPanel = require('../ui/ControlPanel');
var Canvas = require('../ui/Canvas');
var router = require('../router-main');
var Chart = require('../libs/Chart');
var calculateTemperature = require('../utils/CalculateCilinderTemperature');
var domSelect = require('dom-select');

class CoffeeCup extends SpookyEl {

    constructor(data){


        this.template = require('../templates/sections/CoffeeCup.hbs');
         // renderer

        super(data);

        this.firstCalculation = true;

        this.layerShown = false;

        this.title= new SpookyEl('.coffee-cup-title', this);

        this.thermometer = new Thermometer();
        this.thermometer.appendTo(this);

        this.controlPanel = new ControlPanel();
        this.controlPanel.appendTo(this);

        this.canvas = new Canvas({isConcreteBar:false});
        this.canvas.appendTo(this);


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
        this.layer.title = this.layer.find('.title');

        this.controlPanel.onCalculateTemperature.add(this.calculatePointerTemperature.bind(this));
        this.controlPanel.onClickGraph.add(this.calculatePointGraph.bind(this));
        this.controlPanel.onClickMaxTemp.add(this.calculateMaxTempGraph.bind(this));
        this.controlPanel.onPlaneButtonClick.add(this.calculatePlaneTemp.bind(this));

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
        var temperature = calculateTemperature.calculateTemperature(this.controlPanel.xValue,this.controlPanel.yValue,this.controlPanel.zValue, this.controlPanel.tValue);
        temperature = Math.round(temperature * 100) / 100;
        this.thermometer.setTemperature(temperature);
        this.canvas.addPoint(this.controlPanel.xValue,this.controlPanel.yValue,this.controlPanel.zValue, temperature);

        if(this.firstCalculation){
            this.controlPanel.addGraphListeners();
            this.firstCalculation = false;
        }
    }

        addPointGraph(x, y, z){
        
        this.cleanGraph();

        var dataset = calculateTemperature.getTempsForPoint(x, y, z);
        var labels = calculateTemperature.getLabelsForTemps();

        var data = {
            labels: labels,
            datasets: [
            {
                label: "Temperaturas del punto ("+x+", "+y+", "+z+")",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: dataset
            }]
        };
        
        domSelect('.title',this.view).innerHTML = "Temperaturas del punto ("+x+", "+y+", "+z+")";

        this.chartManager.Line(data, {});

    }

    addMaxTempGraph(){
        
        this.cleanGraph();

        var dataset = calculateTemperature.getMaxTemps();
        var labels = calculateTemperature.getLabelsForTemps();

        var data = {
            labels: labels,
            datasets: [
            {
                label: "Evolución de la temperatura máxima",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: dataset
            }]
        };
        
        domSelect('.title',this.view).innerHTML = "Evolución de la temperatura máxima";

        this.chartManager.Line(data, {});

    }

    addPlaneTemp(plane, coordenate, time){
        
        this.cleanGraph();

        var object = calculateTemperature.getTempsForPlane(plane, coordenate, time);
        var dataset = object.temperatures;
        var labels = object.labels;

        console.log(dataset);

        var data = {
            labels: labels,
            datasets: [
            {
                label: "Evolución de la temperatura máxima",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: dataset
            }]
        };
        
        domSelect('.title',this.view).innerHTML = "Temperatura del plano '" + plane + " " + coordenate + "' en el tiempo " + time;

        this.chartManager.Line(data, {});

    }

    calculateMaxTempGraph(){
        this.addMaxTempGraph();
        this.showGraph();
    }
    
    calculatePointGraph(){
        this.addPointGraph(this.controlPanel.xValue,this.controlPanel.yValue,this.controlPanel.zValue);
        this.showGraph();
    }

    calculatePlaneTemp(){
        this.addPlaneTemp(this.controlPanel.plane, this.controlPanel.coordenate, this.controlPanel.time);
        this.showGraph();
    }

    cleanGraph(){
        
        if(this.find('.temperatureChart')!= null){
            this.find('.temperatureChart').remove(); 
        }
        
        this.append('<canvas class="temperatureChart"><canvas>');
        
        this.chart = this.find('.temperatureChart');
        this.chartManager = new Chart(this.chart._view.getContext("2d"));
    }

    showGraph(){

        TweenMax.to(this.title, 0.4, {
            autoAlpha:0,
            ease: Expo.easeOut
        });

        TweenMax.to(this.layer, 0.4, {
            autoAlpha:0.8,
            zIndex: 20,
            ease: Expo.easeOut,
            delay: 0.2
        });

        TweenMax.fromTo(this.layer.title, 0.4, {
            autoAlpha:0,
            y: -200
            },
            {
            y:0,
            delay: 0.5,
            autoAlpha:1,
            ease: Expo.easeOut
        });

        TweenMax.to(this.chart, 0.5, {
            autoAlpha:1,
            delay:0.5
        });

        TweenMax.to(this.closeIcon, 0.5, {
            autoAlpha:1,
            delay:0.5,
            zIndex: 25,
            ease: Expo.easeOut
        });

        this.thermometer.animateOut();

        this.layerShown = true;
    }

    hideGraph(){

        TweenMax.fromTo(this.layer.title, 0.5, {
            autoAlpha:1,
            y: 0
            },
            {
            y:-200,
            autoAlpha:0
        });

        TweenMax.to(this.chart, 0.5, {
            autoAlpha:0
        });

        TweenMax.to(this.closeIcon, 0.5, {
            autoAlpha:0,
            zIndex: 0,
            ease: Expo.easeOut

        });

        TweenMax.to(this.layer, 0.5, {
            autoAlpha:0,
            delay:0.4,
            zIndex: 0,
            onComplete: function(){
                TweenMax.to(this.title, 0.4, {
                    autoAlpha:1,
                    ease: Expo.easeOutç
                });
            }.bind(this)
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
        if(router.currentRoute.name != 'coffee'){
            this.animateOut();
        }
    }


}

module.exports = CoffeeCup;
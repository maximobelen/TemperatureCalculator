var SpookyEl = require('spooky-element');
var THREE = require('three');
var TweenMax = require('gsap');
var Signal = require('signals');
var Thermometer = require('../ui/Thermometer');
var ControlPanel = require('../ui/ConcreteBar/ControlPanel');
var Canvas = require('../ui/Canvas');
var router = require('../router-main');

class ConcreteBar extends SpookyEl {

    constructor(data){


        this.template = require('../templates/sections/ConcreteBar.hbs');
         // renderer

        super(data);

        this.title= new SpookyEl('.coffee-cup-title', this);
       
    
        this.thermometer = new Thermometer();
        this.thermometer.appendTo(this);

        this.controlPanel = new ControlPanel();
        this.controlPanel.appendTo(this);

        this.canvas = new Canvas({isConcreteBar:true});
        this.canvas.appendTo(this);


        this.controlPanel.onAddCafe.add(this.addCafe.bind(this));
        this.controlPanel.onCalculateTemperature.add(this.thermometer.calculateTemperature.bind(this.thermometer));
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

                TweenMax.fromTo(_this.title, 2, {
                    autoAlpha:0
                }, {
                    autoAlpha:1,
                    ease: Expo.easeIn
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

    addCafe(){

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
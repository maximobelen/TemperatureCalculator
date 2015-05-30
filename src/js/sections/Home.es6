var SpookyEl = require('spooky-element');
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var TweenMax = require('gsap');
var domSelect = require('dom-select');
var Signal = require('signals');
var Thermometer = require('../ui/Thermometer');
var ControlPanel = require('../ui/ControlPanel');
var Canvas = require('../ui/Canvas');

var controls;
var clock = new THREE.Clock();

class Home extends SpookyEl {

    constructor(data){


        this.template = require('../templates/sections/Home.hbs');
         // renderer

        super(data);

        this.title= new SpookyEl('.home-title', this);
       
    
        this.thermometer = new Thermometer();
        this.thermometer.appendTo(this);

        this.controlPanel = new ControlPanel();
        this.controlPanel.appendTo(this);

        this.canvas = new Canvas();
        this.canvas.appendTo(this);


        var geometry = new THREE.CylinderGeometry( 90, 90, 200, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0x382818} );
        this.cafe = new THREE.Mesh( geometry, material );

        this.cafe.position.z = 0;
        this.cafe.position.x = -68;
        this.cafe.position.y = 70;

        this.controlPanel.onAddCafe.add(this.addCafe.bind(this));
        this.controlPanel.onCalculateTemperature.add(this.thermometer.calculateTemperature.bind(this.thermometer));
        this.canvas.onCanvasReady.add(this.animate.bind(this));

        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );


    }
    animate(){
        this.canvas.animate();
        this.thermometer.animateIn();
        this.controlPanel.animateIn();

        TweenMax.fromTo(this.title, 2, {
            autoAlpha:0
        }, {
            autoAlpha:1,
            ease: Expo.easeOut
        });


    }

    addCafe(){
        this.canvas.addCafe( this.cafe );
        this.canvas.animate();
    }

    onWindowResize(){

            this.canvas.camera.aspect = window.innerWidth / window.innerHeight;
            this.canvas.camera.updateProjectionMatrix();

            this.canvas.renderer.setSize( window.innerWidth, window.innerHeight );

    }


}

module.exports = Home;
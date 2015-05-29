var SpookyEl = require('spooky-element');
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var TweenMax = require('gsap');


// revolutions per second
var angularSpeed = 0.2; 
var lastTime = 0;
var controls;
var clock = new THREE.Clock();




class Home extends SpookyEl {

    constructor(data){


        this.template = require('../templates/sections/Home.hbs');
         // renderer

        this.renderer = new THREE.WebGLRenderer();

        super(data);

        this.title= new SpookyEl('.home-title', this);
        this.controlPanel = new SpookyEl('.control-panel', this);
        this.controlPanel.temperatureCalculate = new SpookyEl('.button-temperature', this);
        this.controlPanel.addCafe= new SpookyEl('.button-add-cafe', this);
        this.canvas = new SpookyEl('.canvas-container', this);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        var _this=this;
        console.log(this.canvas.view.offsetWidth);
        console.log( this.canvas.view.offsetHeight);

        this.canvas.view.appendChild(this.renderer.domElement);

        // camera
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 8000);
        this.camera.position.z = 1000;
        this.camera.position.X = 0;
        this.camera.position.y = 0;


        // scene
        this.scene = new THREE.Scene();

        var loader = new THREE.ObjectLoader();


        loader.load( "js/models/cup.json", ( obj ) => {
            console.log(obj);
            this.scene.add(obj);
        } );

        var directionalLight_1 = new THREE.DirectionalLight( 0xffffff, 0.3 );
        directionalLight_1.position.set( 50, -100, 150 );
        this.scene.add( directionalLight_1 );

        var directionalLight_2 = new THREE.DirectionalLight( 0xffffff, 0.8 );
        directionalLight_2.position.set( -200, 200, -100 );
        this.scene.add( directionalLight_2 );

        var light = new THREE.AmbientLight( 0x2E2E2E ); // soft white light 
        this.scene.add( light );

        controls = new OrbitControls( this.camera );
        controls.addEventListener( 'change', this.animate );


        this.controlPanel.temperatureCalculate.on( 'click', function(){
            console.log('temperature');
        } );
        this.controlPanel.addCafe.on( 'click', function(){
            console.log('cafe');
        } );

        // start animation
        this.animate();

        TweenMax.fromTo(this.controlPanel.temperatureCalculate, 0.5, {
            x: -100,
            autoalpha:0
        }, {
            x: 0,
            delay:0.1,
            autoalpha:1,
            ease: Expo.easeOut
        });
        TweenMax.fromTo(this.controlPanel.addCafe, 0.5, {
            x: -100,
            autoalpha:0
        }, {
            x: 0,
            delay:0.1,
            autoalpha:1,
            ease: Expo.easeOut
        });

        TweenMax.fromTo(this.title, 1, {
            y: -100,
            autoalpha:0
        }, {
            y: 0,
            autoalpha:1,
            ease: Expo.easeOut
        });



    }


    animate(){
        var _this = this;
        _this.renderer.render(_this.scene, _this.camera);

        // request new frame
        requestAnimationFrame( ()=>{
            _this.animate();
        });
    }


}

module.exports = Home;
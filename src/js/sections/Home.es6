var SpookyEl = require('spooky-element');
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var TweenMax = require('gsap');
var domSelect = require('dom-select');


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
        this.thermometer = new SpookyEl('.thermometer', this);
        this.thermometer.degrees = 0;
        this.thermometer.mercury = new SpookyEl('.mercury', this);
        this.thermometer.mercury.top = 388;

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        var _this = this;
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
            this.executeTweens();
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

        var geometry = new THREE.CylinderGeometry( 90, 90, 200, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0x382818} );
        this.cafe = new THREE.Mesh( geometry, material );

        this.isEmpty = true;
        this.cafe.position.z = 0;
        this.cafe.position.x = -68;
        this.cafe.position.y = 70;

        this.controlPanel.temperatureCalculate.on( 'click', () => {
            if(!this.thermometer.mercury.top<=46){
                this.thermometer.degrees = this.thermometer.degrees+1;
                this.thermometer.mercury.top+=-3;

                TweenMax.to(this.thermometer.mercury, 0.5, {
                    height:this.thermometer.degrees*3,
                    top:this.thermometer.mercury.top
                });
                    
                domSelect('.degrees',this.view).innerHTML = this.thermometer.degrees;
            }


     
        } );
        this.controlPanel.addCafe.on( 'click', () =>{
            if(this.isEmpty){
                this.scene.add( this.cafe );
                this.isEmpty = false;
            }

        } );

        // start animation
        this.animate();


        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );


    }
    executeTweens(){

        TweenMax.fromTo(this.controlPanel.temperatureCalculate, 1.5, {
            x: -100,
            autoAlpha:0
        }, {
            x: 0,
            delay:0.1,
            autoAlpha:1,
            ease: Expo.easeOut
        });
        TweenMax.fromTo(this.controlPanel.addCafe, 1.5, {
            x: -100,
            autoAlpha:0
        }, {
            x: 0,
            delay:0.1,
            autoAlpha:1,
            ease: Expo.easeOut
        });

        TweenMax.fromTo(this.thermometer, 1.5, {
            y: 1000,
            autoAlpha:0
        }, {
            y: 0,
            autoAlpha:1,
            ease: Expo.easeOut
        });

        TweenMax.fromTo(this.title, 1.3, {
            autoAlpha:0
        }, {
            autoAlpha:1,
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

    onWindowResize(){

            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize( window.innerWidth, window.innerHeight );

    }


}

module.exports = Home;
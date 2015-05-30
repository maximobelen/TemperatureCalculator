var SpookyEl = require('spooky-element');
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var TweenMax = require('gsap');
var domSelect = require('dom-select');
var Thermometer = require('../ui/Thermometer');
var ControlPanel = require('../ui/ControlPanel');
var Signal = require('signals');

var controls;
var clock = new THREE.Clock();

class Home extends SpookyEl {

    constructor(data){


        this.template = require('../templates/sections/Home.hbs');
         // renderer

        this.renderer = new THREE.WebGLRenderer();

        super(data);

        this.title= new SpookyEl('.home-title', this);
       
        this.canvas = new SpookyEl('.canvas-container', this);
        this.thermometer = new Thermometer();
        this.thermometer.appendTo(this);

        this.controlPanel = new ControlPanel();
        this.controlPanel.appendTo(this);


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
            this.animateIn();
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

        this.cafe.position.z = 0;
        this.cafe.position.x = -68;
        this.cafe.position.y = 70;

        this.controlPanel.onAddCafe.add(this.addCafe.bind(this));

        // start animation
        this.animate();


        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );


    }
    animateIn(){

        this.thermometer.animateIn();
        this.controlPanel.animateIn();

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

    addCafe(){
        this.scene.add( this.cafe );
    }

    onWindowResize(){

            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize( window.innerWidth, window.innerHeight );

    }


}

module.exports = Home;
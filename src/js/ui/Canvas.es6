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

class Canvas extends SpookyEl {

    constructor(data){


        this.template = require('../templates/ui/Canvas.hbs');
         // renderer

        this.renderer = new THREE.WebGLRenderer();

        super(data);

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        var _this = this;

        this.view.appendChild(this.renderer.domElement);

        // camera
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 8000);
        this.camera.position.z = 1000;
        this.camera.position.X = 0;
        this.camera.position.y = 0;

        this.onCanvasReady = new Signal();
        // scene
        this.scene = new THREE.Scene();

        if(data.isConcreteBar){

            this.cube = new THREE.Mesh( new THREE.CubeGeometry( 400, 30, 30 ), new THREE.MeshPhongMaterial( {color: 0xB3B3B3} ) );
            this.cube.position.y = 150;
            this.scene.add( this.cube );

        }else{

            var loader = new THREE.ObjectLoader();


            loader.load( "js/models/cup.json", ( obj ) => {
                this.scene.add(obj);
                this.onCanvasReady.dispatch();
            } );
        }
        var directionalLight_1 = new THREE.DirectionalLight( 0xffffff, 0.3 );
        directionalLight_1.position.set( 50, -100, 150 );
        this.scene.add( directionalLight_1 );

        var directionalLight_2 = new THREE.DirectionalLight( 0xffffff, 0.8 );
        directionalLight_2.position.set( -200, 200, -100 );
        this.scene.add( directionalLight_2 );

        var light = new THREE.AmbientLight( 0x2E2E2E ); // soft white light 
        this.scene.add( light );

        controls = new OrbitControls( this.camera );
        controls.addEventListener( 'change', this.animate.bind(this) );


    }
    animateIn(){

    }

    animate(){

        this.renderer.render(this.scene, this.camera);

    }

    addCafe(cafe){
        this.scene.add(cafe);
    }

    resize(){
            this.animate();
    }
}

module.exports = Canvas;
var SpookyEl = require('spooky-element');
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var TweenMax = require('gsap');
var domSelect = require('dom-select');
var Thermometer = require('../ui/Thermometer');
var Signal = require('signals');

var controls;
var clock = new THREE.Clock();
var scale = 20;
class Canvas extends SpookyEl {

    constructor(data){


        this.template = require('../templates/ui/Canvas.hbs');
         // renderer

        this.renderer = new THREE.WebGLRenderer();

        super(data);

        //this.renderer.setSize(window.innerWidth*0.95, window.innerHeight);
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

            var material = new THREE.MeshNormalMaterial( {
                wireframe: true
            } );

            this.cube = new THREE.Mesh( new THREE.CubeGeometry( 10 * scale, 5 * scale, 2 * scale ), material );
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

        controls = new OrbitControls( this.camera, this._view );
        controls.addEventListener( 'change', this.animate.bind(this) );

    }
    animateIn(){

    }

    animate(){

        this.renderer.render(this.scene, this.camera);

    }

    addPoint(x,y,z){

        var selectedObject = this.scene.getObjectByName('point');
        this.scene.remove( selectedObject );

        var geometry = new THREE.SphereGeometry( 2, 100, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xDF0101} );
        var sphere = new THREE.Mesh( geometry, material );
        sphere.name = "point";
        sphere.position.x = x * scale;
        sphere.position.y = y * scale;
        sphere.position.z = z * scale;
        this.scene.add( sphere );
        this.animate();
    }

    addCafe(cafe){
        this.scene.add(cafe);
    }

    resize(){
            this.animate();
    }
}

module.exports = Canvas;
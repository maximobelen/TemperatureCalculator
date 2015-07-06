var SpookyEl = require('spooky-element');
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var TweenMax = require('gsap');
var domSelect = require('dom-select');
var Thermometer = require('../ui/Thermometer');
var Signal = require('signals');
var colorTemperatureToRGB = require('../utils/colorTempToRGB');

var controls;
var clock = new THREE.Clock();

class Canvas extends SpookyEl {

    constructor(data){
        //this.scale = data.scale;

        this.template = require('../templates/ui/Canvas.hbs');
         // renderer
        this.renderer = new THREE.WebGLRenderer();

        super(data);

        var _this = this;

        this.view.appendChild(this.renderer.domElement);

        // camera
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);

        this.onCanvasReady = new Signal();
        // scene
        this.scene = new THREE.Scene();

        if(data.isConcreteBar){

            var material = new THREE.MeshNormalMaterial( {
                wireframe: true
            } );

            var xSize = 10,
            ySize = 2,
            zSize = 5;
            this.cube = new THREE.Mesh( new THREE.BoxGeometry( xSize, ySize, zSize), material );
            this.cube.position.x = xSize/2;
            this.cube.position.y = ySize/2;
            this.cube.position.z = zSize/2;
            this.scene.add( this.cube );

            this.camera.position.x = 20;
            this.camera.position.y = 10;
            this.camera.position.z = 20;

        }else{

            var loader = new THREE.ObjectLoader();


            loader.load( "js/models/cup.json", ( obj ) => {
                this.scene.add(obj);
                this.onCanvasReady.dispatch();
            } );

            this.camera.position.x = 0;
            this.camera.position.y = 0;
            this.camera.position.z = 1000;
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
    
    animatePointsColors(){

        var point = this.scene.getObjectByName('point');

        this.animate();

    }

    addPoint(x,y,z, temperature){

        var selectedObject = this.scene.getObjectByName('point');
        this.scene.remove( selectedObject );

        var geometry = new THREE.SphereGeometry( 0.1, 100, 32 );
        var rgb = colorTemperatureToRGB(temperature);
        var colorString = "rgb("+rgb.r+","+rgb.g+","+rgb.b+")";

        var material = new THREE.MeshBasicMaterial( {color: colorString} );
        var sphere = new THREE.Mesh( geometry, material );
        sphere.name = "point";
        sphere.position.x = x;
        sphere.position.y = y;
        sphere.position.z = z;
        this.scene.add( sphere );
        //this.animate();
        this.animatePointsColors();
    }

    randomSpherePoint(x0,y0,z0,radius){
       var u = Math.random();
       var v = Math.random();
       var theta = 2 * Math.PI * u;
       var phi = Math.acos(2 * v - 1);
       var x = x0 + (radius * Math.sin(phi) * Math.cos(theta));
       var y = y0 + (radius * Math.sin(phi) * Math.sin(theta));
       var z = z0 + (radius * Math.cos(phi));
       return [x,y,z];
    }

    addCafe(cafe){
        this.scene.add(cafe);
    }

    resize(){
        this.animate();
    }
}

module.exports = Canvas;
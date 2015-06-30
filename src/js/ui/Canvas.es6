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
        this.camera.position.x = 0;
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

    addParticles(x, y, z){

        var selectedObject = this.scene.getObjectByName('particles');
        this.scene.remove( selectedObject );

        var particles = new THREE.Geometry;

        var colors = [];

        for (var p = 0; p < 2000; p++) {
            var vector = this.randomSpherePoint(x * scale, y * scale, z * scale, 1 * scale);
            var particle = new THREE.Vector3(vector[0],vector[1] ,vector[2] );
            var temperature = Math.floor((Math.random() * 100) + 1);
            var rgb = colorTemperatureToRGB(temperature);
            var colorString = "rgb("+rgb.r+","+rgb.g+","+rgb.b+")";
            colors[p] = new THREE.Color( colorString );

            particles.vertices.push(particle);

        }

        particles.colors = colors;

        // material
        var material = new THREE.PointCloudMaterial( {
            size: 0.5,
            transparent: false,
            opacity: 1,
            vertexColors: THREE.VertexColors
        } );

        var particleSystem = new THREE.PointCloud(particles, material);
        particleSystem.name = "particles";
        this.scene.add(particleSystem);
        this.animate();
    }


    addPoint(x,y,z){

        var selectedObject = this.scene.getObjectByName('point');
        this.scene.remove( selectedObject );

        var geometry = new THREE.SphereGeometry( 1, 100, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xDF0101} );
        var sphere = new THREE.Mesh( geometry, material );
        sphere.name = "point";
        sphere.position.x = x * scale;
        sphere.position.y = y * scale;
        sphere.position.z = z * scale;
        this.scene.add( sphere );
        this.animate();
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
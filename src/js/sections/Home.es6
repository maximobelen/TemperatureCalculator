var SpookyEl = require('spooky-element');
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);


// revolutions per second
var angularSpeed = 0.2; 
var lastTime = 0;
var controls;



class Home extends SpookyEl {

    constructor(data){

      
        this.template = require('../templates/sections/Home.hbs');
         // renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        
        super(this);

       

        // camera
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
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
        directionalLight_2.position.set( 10, 200, 150 );
        this.scene.add( directionalLight_2 );


        controls = new OrbitControls( this.camera );
        controls.addEventListener( 'change', this.animate );


        // start animation
        this.animate();


    }


    animate(){

        this.renderer.render(this.scene, this.camera);
 
        // request new frame
        requestAnimationFrame( ()=>{
            this.animate();
        });
    }


}

module.exports = Home;
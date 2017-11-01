
import * as THREE from 'three'

import DB from './db.js';

/*var config = {
	apiKey: "AIzaSyCyZ4mlZFrTS9RiiDoR-YRn0cBA6GxySvc",
	authDomain: "fishtank-b6f1f.firebaseapp.com",
	databaseURL: "https://fishtank-b6f1f.firebaseio.com",
	projectId: "fishtank-b6f1f",
	storageBucket: "",
	messagingSenderId: "995746268808"
};*/
//firebase.initializeApp(config);
// Get a reference to the database service
//var database = firebase.database();


var OrbitControls = require('three-orbitcontrols')

var camera;
var scene;
var renderer;
var controls;

var spotLight;
var greenPoint;
var bluePoint;
var counter = 0;
var knot;

init();
animate();

function init() {

    // Create a scene
    scene = new THREE.Scene();

    // Add the camera
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 100, 250);

    // Add scene elements
    addSceneElements();

    // Add lights
    addLights();

    // Create the WebGL Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    // Append the renderer to the body
    document.body.appendChild( renderer.domElement );

    // Add a resize event listener
    window.addEventListener( 'resize', onWindowResize, false );

    // Add the orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 100, 0);

    //setup firebase

	var test = new DB("pieter","bos");

	test.initFish();
	test.setupFish(addFish);

	console.log(test.getFullName());
	test.pushFish()
	setInterval( function(){
		test.pushFish()
	},1000);
}

function addFish(key,fish){
	// Sphere
	var ballMat = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0x555555, shininess: 30 } );
	console.log("Add the fish");
	var sphere = new THREE.Mesh(new THREE.SphereGeometry(20, 70, 20), ballMat);
	sphere.position.set(Math.floor(-50 + Math.random()*100 ), Math.floor(-50 + Math.random()*100 ), Math.floor(-Math.random()*100 ));
	scene.add(sphere);
}

function addLights() {
    var dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(100, 100, 50);
    scene.add(dirLight);

    //var ambLight = new THREE.AmbientLight(0x404040);
    //scene.add(ambLight);

    spotLight = new THREE.SpotLight(0xffffff, 1, 200, 20, 10);
    scene.add(spotLight);

    bluePoint = new THREE.PointLight(0x0033ff, 3, 150);
    bluePoint.position.set( 70, 5, 70 );
    scene.add(bluePoint);
    scene.add(new THREE.PointLightHelper(bluePoint, 3));

    greenPoint = new THREE.PointLight(0x33ff00, 1, 150);
    greenPoint.position.set( -70, 5, 70 );
    scene.add(greenPoint);
    scene.add(new THREE.PointLightHelper(greenPoint, 3));

    var hemLight = new THREE.HemisphereLight(0xffe5bb, 0xFFBF00, .1);
    scene.add(hemLight);
}

function addSceneElements() {
    // Create a cube used to build the floor and walls
    var cube = new THREE.CubeGeometry( 200, 1, 200);

    // create different materials
    var floorMat = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./wood-floor.jpg') } );
    var wallMat = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./bricks.jpg') } );
    var ballMat = new THREE.MeshPhongMaterial( { color: 0x00ff00, specular: 0x555555, shininess: 30 } );
    var torusMat = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0x555555, shininess: 30 } );

    // Floor
    var floor = new THREE.Mesh(cube, floorMat );
    scene.add( floor );

    // Back wall
    var backWall = new THREE.Mesh(cube, wallMat );
    backWall.rotation.x = Math.PI/180 * 90;
    backWall.position.set(0,100,-100);
    scene.add( backWall );

    // Left wall
    var leftWall = new THREE.Mesh(cube, wallMat );
    leftWall.rotation.x = Math.PI/180 * 90;
    leftWall.rotation.z = Math.PI/180 * 90;
    leftWall.position.set(-100,100,0);
    scene.add( leftWall );

    // Right wall
    var rightWall = new THREE.Mesh(cube, wallMat );
    rightWall.rotation.x = Math.PI/180 * 90;
    rightWall.rotation.z = Math.PI/180 * 90;
    rightWall.position.set(100,100,0);
    scene.add( rightWall );

    // Sphere
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(20, 70, 20), ballMat);
    sphere.position.set(-25, 100, -20);
    scene.add(sphere);

    // Knot thingy
    knot = new THREE.Mesh(new THREE.TorusKnotGeometry( 40, 3, 100, 16 ), torusMat);
    knot.position.set(0, 60, 30);
    scene.add(knot);
}



function animate() {
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
    controls.update();
    counter += .01;
    //greenPoint.position.x = -100; //Math.sin(counter) * 100;
    greenPoint.position.set( -70, 5, Math.sin(counter) * 100 );
    bluePoint.position.set( -Math.sin(counter) * 100 , 5, 70);


    knot.rotateZ( Math.sin(counter/100) * 100)
    //console.log("sorry")
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
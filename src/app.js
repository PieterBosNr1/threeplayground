
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


var halfPI = Math.PI/2;

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

	//test.initFish();
	test.setupFish(addFish);

	console.log(test.getFullName());
	test.pushFish()
	setInterval( function(){
		test.pushFish()
	},1000);

    createFish().position.x = 100;

    createFish().position.x = 50;
}

function __addFish(key,fish){
	// Sphere

	var ballMat = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0x555555, shininess: 30 } );
	console.log("Add the fish");
	var sphere = new THREE.Mesh(new THREE.SphereGeometry(20, 70, 20), ballMat);
	sphere.position.set(Math.floor(-50 + Math.random()*100 ), Math.floor(-50 + Math.random()*100 ), Math.floor(-Math.random()*100 ));
	scene.add(sphere);
}

function addFish(key,fish){
    // Sphere
    console.log("Add the real fish");


    var fish = createFish();
    fish.rotation.order = 'YXZ';
    //fish.scale.set(0.5,0.5,0,5);
    fish.position.set(Math.floor(Math.random()*300 ), Math.floor( Math.random()*300 ), Math.floor(Math.random()*300 )+50);
    fish.rotation.z = Math.random() * Math.PI;
    fish.rotation.y = Math.random() * Math.PI;
    fish.rotation.x = Math.random() * Math.PI;

    fish.scale.set(0.1 + 0.1 * Math.random(),0.1 + 0.1 * Math.random(),0.1 + 0.1 * Math.random());

    scene.add(fish);
}

function createFish(){


// FISH BODY PARTS
    var fish,
        bodyFish,
        tailFish,
        topFish,
        sideRightFish,
        sideLeftFish,
        rightIris,
        leftIris,
        rightEye,
        leftEye,
        lipsFish,
        tooth1,
        tooth2,
        tooth3,
        tooth4,
        tooth5;

    // A group that will contain each part of the fish
    fish = new THREE.Group();
    // each part needs a geometry, a material, and a mesh

    // Body
    var bodyGeom = new THREE.BoxGeometry(120, 120, 120);
    var bodyMat = new THREE.MeshLambertMaterial({
        color: Math.random() * 0xffffff ,
        flatShading: THREE.FlatShading
    });
    bodyFish = new THREE.Mesh(bodyGeom, bodyMat);

    // Tail
    var tailGeom = new THREE.CylinderGeometry(0, 60, 60, 4, false);
    var tailMat = new THREE.MeshLambertMaterial({
        color: 0xff00dc,
        flatShading: THREE.FlatShading
    });

    tailFish = new THREE.Mesh(tailGeom, tailMat);
    tailFish.scale.set(.8,1,.1);
    tailFish.position.x = -60;
    tailFish.rotation.z = -halfPI;

    // Lips
    var lipsGeom = new THREE.BoxGeometry(25, 10, 120);
    var lipsMat = new THREE.MeshLambertMaterial({
        color: 0x80f5fe ,
        flatShading: THREE.FlatShading
    });
    lipsFish = new THREE.Mesh(lipsGeom, lipsMat);
    lipsFish.position.x = 65;
    lipsFish.position.y = -47;
    lipsFish.rotation.z = halfPI;

    // Fins
    topFish = new THREE.Mesh(tailGeom, tailMat);
    topFish.scale.set(.8,1,.1);
    topFish.position.x = -20;
    topFish.position.y = 60;
    topFish.rotation.z = -halfPI;

    sideRightFish = new THREE.Mesh(tailGeom, tailMat);
    sideRightFish.scale.set(.8,1,.1);
    sideRightFish.rotation.x = halfPI;
    sideRightFish.rotation.z = -halfPI;
    sideRightFish.position.x = 0;
    sideRightFish.position.y = -50;
    sideRightFish.position.z = -60;

    sideLeftFish = new THREE.Mesh(tailGeom, tailMat);
    sideLeftFish.scale.set(.8,1,.1);
    sideLeftFish.rotation.x = halfPI;
    sideLeftFish.rotation.z = -halfPI;
    sideLeftFish.position.x = 0;
    sideLeftFish.position.y = -50;
    sideLeftFish.position.z = 60;

    // Eyes
    var eyeGeom = new THREE.BoxGeometry(40, 40,5);
    var eyeMat = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        flatShading: THREE.FlatShading
    });

    rightEye = new THREE.Mesh(eyeGeom,eyeMat );
    rightEye.position.z = -60;
    rightEye.position.x = 25;
    rightEye.position.y = -10;

    var irisGeom = new THREE.BoxGeometry(10, 10,3);
    var irisMat = new THREE.MeshLambertMaterial({
        color: 0x330000,
        flatShading: THREE.FlatShading
    });

    rightIris = new THREE.Mesh(irisGeom,irisMat );
    rightIris.position.z = -65;
    rightIris.position.x = 35;
    rightIris.position.y = -10;

    leftEye = new THREE.Mesh(eyeGeom,eyeMat );
    leftEye.position.z = 60;
    leftEye.position.x = 25;
    leftEye.position.y = -10;

    leftIris = new THREE.Mesh(irisGeom,irisMat );
    leftIris.position.z = 65;
    leftIris.position.x = 35;
    leftIris.position.y = -10;

    var toothGeom = new THREE.BoxGeometry(20, 4, 20);
    var toothMat = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        flatShading: THREE.FlatShading
    });

    // Teeth
    tooth1 = new THREE.Mesh(toothGeom,toothMat);
    tooth1.position.x = 65;
    tooth1.position.y = -35;
    tooth1.position.z = -50;
    tooth1.rotation.z = halfPI;
    tooth1.rotation.x = -halfPI;

    tooth2 = new THREE.Mesh(toothGeom,toothMat);
    tooth2.position.x = 65;
    tooth2.position.y = -30;
    tooth2.position.z = -25;
    tooth2.rotation.z = halfPI;
    tooth2.rotation.x = -Math.PI/12;

    tooth3 = new THREE.Mesh(toothGeom,toothMat);
    tooth3.position.x = 65;
    tooth3.position.y = -25;
    tooth3.position.z = 0;
    tooth3.rotation.z = halfPI;

    tooth4 = new THREE.Mesh(toothGeom,toothMat);
    tooth4.position.x = 65;
    tooth4.position.y = -30;
    tooth4.position.z = 25;
    tooth4.rotation.z = halfPI;
    tooth4.rotation.x = Math.PI/12;

    tooth5 = new THREE.Mesh(toothGeom,toothMat);
    tooth5.position.x = 65;
    tooth5.position.y = -35;
    tooth5.position.z = 50;
    tooth5.rotation.z = halfPI;
    tooth5.rotation.x = Math.PI/8;


    fish.add(bodyFish);
    fish.add(tailFish);
    fish.add(topFish);
    fish.add(sideRightFish);
    fish.add(sideLeftFish);
    fish.add(rightEye);
    fish.add(rightIris);
    fish.add(leftEye);
    fish.add(leftIris);
    fish.add(tooth1);
    fish.add(tooth2);
    fish.add(tooth3);
    fish.add(tooth4);
    fish.add(tooth5);
    fish.add(lipsFish);

    fish.rotation.y = -Math.PI/4;

    //scene.add(fish);



    return fish;

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
    greenPoint.position.set( 0, 100, Math.sin(counter) * 400 );
    bluePoint.position.set( -Math.sin(counter) * 400 , 5, 150);

knot.scale.set(2,2,2);
    knot.rotateZ( Math.sin(counter/100) * 100)
    //console.log("sorry")
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
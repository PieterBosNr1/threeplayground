import * as THREE from 'three';
var OrbitControls = require('three-orbitcontrols');

// Global variables
var camera, scene, renderer, controls;
var sun, planets = [], moons = [];
var clock = new THREE.Clock();

// Planet data: [name, radius, distance, orbitalSpeed, rotationSpeed, color, hasRings]
var planetData = [
    { name: 'Mercury', radius: 2, distance: 40, orbitalSpeed: 4.15, rotationSpeed: 0.02, color: 0x8c8c8c },
    { name: 'Venus', radius: 4, distance: 60, orbitalSpeed: 1.62, rotationSpeed: 0.015, color: 0xe6c87a },
    { name: 'Earth', radius: 4.5, distance: 85, orbitalSpeed: 1.0, rotationSpeed: 0.02, color: 0x6b93d6, hasMoon: true },
    { name: 'Mars', radius: 3, distance: 110, orbitalSpeed: 0.53, rotationSpeed: 0.018, color: 0xc1440e },
    { name: 'Jupiter', radius: 12, distance: 160, orbitalSpeed: 0.084, rotationSpeed: 0.04, color: 0xd8ca9d },
    { name: 'Saturn', radius: 10, distance: 220, orbitalSpeed: 0.034, rotationSpeed: 0.038, color: 0xf4d59e, hasRings: true },
    { name: 'Uranus', radius: 7, distance: 280, orbitalSpeed: 0.012, rotationSpeed: 0.03, color: 0xd1e7e7 },
    { name: 'Neptune', radius: 6.5, distance: 340, orbitalSpeed: 0.006, rotationSpeed: 0.032, color: 0x5b5ddf }
];

init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);

    // Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 300, 500);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 50;
    controls.maxDistance = 1500;

    // Create celestial bodies
    createStarfield();
    createSun();
    createPlanets();
    createOrbitalPaths();

    // Ambient light for subtle illumination
    var ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    // Window resize handler
    window.addEventListener('resize', onWindowResize, false);

    // Info display
    createInfoDisplay();
}

function createStarfield() {
    var starGeometry = new THREE.BufferGeometry();
    var starCount = 5000;
    var positions = new Float32Array(starCount * 3);

    for (var i = 0; i < starCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 4000;
        positions[i + 1] = (Math.random() - 0.5) * 4000;
        positions[i + 2] = (Math.random() - 0.5) * 4000;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    var starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1,
        sizeAttenuation: true
    });

    var starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
}

function createSun() {
    // Sun geometry and material
    var sunGeometry = new THREE.SphereGeometry(20, 32, 32);
    var sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        emissive: 0xffff00
    });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Sun glow effect
    var glowGeometry = new THREE.SphereGeometry(22, 32, 32);
    var glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.3
    });
    var sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    sun.add(sunGlow);

    // Second glow layer
    var glowGeometry2 = new THREE.SphereGeometry(25, 32, 32);
    var glowMaterial2 = new THREE.MeshBasicMaterial({
        color: 0xff6600,
        transparent: true,
        opacity: 0.15
    });
    var sunGlow2 = new THREE.Mesh(glowGeometry2, glowMaterial2);
    sun.add(sunGlow2);

    // Point light from sun
    var sunLight = new THREE.PointLight(0xffffff, 2, 1000);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
}

function createPlanets() {
    planetData.forEach(function(data, index) {
        var planetGroup = new THREE.Group();
        planetGroup.userData = {
            name: data.name,
            distance: data.distance,
            orbitalSpeed: data.orbitalSpeed,
            rotationSpeed: data.rotationSpeed,
            angle: Math.random() * Math.PI * 2 // Random starting position
        };

        // Planet mesh
        var geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        var material = new THREE.MeshPhongMaterial({
            color: data.color,
            shininess: 5
        });
        var planet = new THREE.Mesh(geometry, material);
        planetGroup.add(planet);

        // Add rings for Saturn
        if (data.hasRings) {
            var innerRadius = data.radius * 1.4;
            var outerRadius = data.radius * 2.2;
            var ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
            var ringMaterial = new THREE.MeshBasicMaterial({
                color: 0xc9b896,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8
            });
            var ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            planetGroup.add(ring);

            // Inner ring
            var innerRingGeometry = new THREE.RingGeometry(data.radius * 1.2, innerRadius, 64);
            var innerRingMaterial = new THREE.MeshBasicMaterial({
                color: 0xa89878,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.6
            });
            var innerRing = new THREE.Mesh(innerRingGeometry, innerRingMaterial);
            innerRing.rotation.x = Math.PI / 2;
            planetGroup.add(innerRing);
        }

        // Add moon for Earth
        if (data.hasMoon) {
            var moonGroup = new THREE.Group();
            moonGroup.userData = {
                orbitalSpeed: 5,
                distance: 10,
                angle: 0
            };

            var moonGeometry = new THREE.SphereGeometry(1.2, 16, 16);
            var moonMaterial = new THREE.MeshPhongMaterial({
                color: 0xaaaaaa,
                shininess: 2
            });
            var moon = new THREE.Mesh(moonGeometry, moonMaterial);
            moon.position.x = 10;
            moonGroup.add(moon);
            planetGroup.add(moonGroup);
            moons.push(moonGroup);
        }

        // Set initial position
        var angle = planetGroup.userData.angle;
        planetGroup.position.x = Math.cos(angle) * data.distance;
        planetGroup.position.z = Math.sin(angle) * data.distance;

        scene.add(planetGroup);
        planets.push(planetGroup);
    });
}

function createOrbitalPaths() {
    planetData.forEach(function(data) {
        var curve = new THREE.EllipseCurve(
            0, 0,
            data.distance, data.distance,
            0, 2 * Math.PI,
            false,
            0
        );

        var points = curve.getPoints(100);
        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        var material = new THREE.LineBasicMaterial({
            color: 0x444466,
            transparent: true,
            opacity: 0.3
        });

        var orbit = new THREE.Line(geometry, material);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);
    });
}

function createInfoDisplay() {
    var info = document.createElement('div');
    info.style.cssText = 'position:absolute;top:10px;left:10px;color:white;font-family:Arial,sans-serif;font-size:14px;background:rgba(0,0,0,0.5);padding:15px;border-radius:5px;';
    info.innerHTML = '<h2 style="margin:0 0 10px 0;">Solar System</h2>' +
        '<p style="margin:5px 0;">Use mouse to orbit, scroll to zoom</p>' +
        '<p style="margin:5px 0;font-size:12px;color:#888;">Planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune</p>';
    document.body.appendChild(info);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    var delta = clock.getDelta();
    var elapsed = clock.getElapsedTime();

    // Rotate sun
    sun.rotation.y += 0.002;

    // Animate planets
    planets.forEach(function(planetGroup) {
        var data = planetGroup.userData;

        // Update orbital position
        data.angle += data.orbitalSpeed * delta * 0.1;
        planetGroup.position.x = Math.cos(data.angle) * data.distance;
        planetGroup.position.z = Math.sin(data.angle) * data.distance;

        // Rotate planet on its axis
        planetGroup.children[0].rotation.y += data.rotationSpeed;
    });

    // Animate moons
    moons.forEach(function(moonGroup) {
        var data = moonGroup.userData;
        data.angle += data.orbitalSpeed * delta;
        moonGroup.children[0].position.x = Math.cos(data.angle) * data.distance;
        moonGroup.children[0].position.z = Math.sin(data.angle) * data.distance;
    });

    controls.update();
    renderer.render(scene, camera);
}

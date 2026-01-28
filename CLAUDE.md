# CLAUDE.md - AI Assistant Guide for Three.js Playground

## Project Overview

This is a Three.js-based 3D visualization playground that renders interactive fish objects in a WebGL scene. The project features real-time Firebase integration for dynamic fish spawning and camera orbit controls for scene navigation.

## Technology Stack

### Core Dependencies
- **Three.js v0.87.1** - WebGL 3D graphics library
- **Firebase v4.6.0** - Real-time database for fish data synchronization
- **three-orbitcontrols v1.2.1** - Camera controls for mouse/touch navigation

### Build Tools
- **Webpack v3.8.1** - Module bundler
- **Babel v6.26.0** - JavaScript transpiler (ES2015 + React presets)
- **html-webpack-plugin** - HTML template generation
- **webpack-concat-plugin** - File concatenation

## Project Structure

```
threeplayground/
├── src/                    # Source code
│   ├── app.js             # Main application entry point
│   ├── db.js              # Firebase database class
│   ├── helper.js          # Alternative implementation with particles
│   ├── modules.js         # Webpack concat configuration
│   ├── test1.js           # Test utilities
│   ├── test2.js           # Test utilities
│   ├── test3.js           # Test utilities
│   ├── index.html         # HTML template
│   └── bricks2.jpg        # Texture asset
├── dist/                   # Build output (generated)
│   ├── bundle.js          # Application bundle
│   ├── vendor.js          # Three.js vendor bundle
│   ├── manifest.js        # Webpack manifest
│   ├── index.html         # Generated HTML
│   └── *.jpg              # Texture assets
├── package.json           # Project configuration
├── webpack.config.js      # Webpack configuration
└── .gitignore            # Git ignore rules
```

## Development Commands

```bash
# Install dependencies
npm install

# Development mode (watch for changes)
npm run dev

# Production build (minified)
npm run prod
```

## Key Files

### src/app.js (Main Entry Point)
- Initializes Three.js scene, camera, and renderer
- Sets up lighting (DirectionalLight, SpotLight, PointLight, HemisphereLight)
- Creates scene elements (floor, walls, decorative objects)
- Integrates with Firebase via DB class for real-time fish spawning
- Contains `createFish()` function for building composite 3D fish models
- Runs animation loop with `requestAnimationFrame()`

### src/db.js (Database Class)
- `DB` class for Firebase operations
- Methods:
  - `constructor(firstName, lastName)` - Initializes Firebase
  - `getFullName()` - Returns full name string
  - `setupFish(callBackAdd, callBackUpdate, callBackRemove)` - Sets up real-time listeners
  - `pushFish()` - Adds new fish to database
  - `initFish()` - Initializes default fish data

### src/helper.js
- Alternative implementation with particle systems
- Contains advanced animation and optimization patterns
- Useful reference for particle effects

## Code Patterns and Conventions

### Module System
- ES6 imports/exports: `import * as THREE from 'three'`
- Default exports for classes: `export default class DB { ... }`
- CommonJS require for orbit controls: `var OrbitControls = require('three-orbitcontrols')`

### Naming Conventions
- **Variables/Functions**: camelCase (`createFish`, `addLights`, `spotLight`)
- **Classes**: PascalCase (`DB`)
- **Constants**: UPPER_SNAKE_CASE for config arrays (`VENDOR_LIBS`)

### Three.js Patterns
- Scene hierarchy using `THREE.Group()` for composite objects
- Materials: `MeshPhongMaterial`, `MeshLambertMaterial`
- Geometry primitives: `BoxGeometry`, `SphereGeometry`, `CylinderGeometry`, `TorusKnotGeometry`
- Texture loading: `THREE.ImageUtils.loadTexture()`
- Animation loop pattern:
  ```javascript
  function animate() {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
      controls.update();
  }
  ```

### Application Initialization Pattern
```javascript
init();
animate();

function init() {
    // Setup scene, camera, renderer, controls, lights
    // Initialize Firebase and callbacks
}

function animate() {
    // Render loop with requestAnimationFrame
}
```

### Firebase Callback Pattern
```javascript
db.setupFish(addFish);  // Register callback for child_added events

function addFish(key, fish) {
    // Create and add 3D object to scene
}
```

## Important Notes

### Global Variables
The application uses module-level globals for Three.js objects:
- `camera`, `scene`, `renderer`, `controls`
- `spotLight`, `greenPoint`, `bluePoint`
- `counter`, `knot`

### Math Constants
- `halfPI = Math.PI / 2` - Used for 90-degree rotations

### Fish Creation
Fish are composite objects built from multiple geometries:
- Body (BoxGeometry)
- Tail and fins (CylinderGeometry)
- Eyes and irises (BoxGeometry)
- Teeth (BoxGeometry)
- Lips (BoxGeometry)

Random colors applied: `color: Math.random() * 0xffffff`

### Build Output
Webpack generates three bundles:
1. `bundle.js` - Application code
2. `vendor.js` - Three.js library
3. `manifest.js` - Webpack runtime

### Browser Requirements
- WebGL support required
- No fallbacks implemented

## Common Tasks

### Adding a New 3D Object
1. Create geometry and material
2. Create mesh from geometry + material
3. Set position, rotation, scale
4. Add to scene: `scene.add(mesh)`

### Modifying Fish Appearance
Edit `createFish()` function in `src/app.js`:
- Modify geometry parameters for different shapes
- Change material colors for different appearances
- Adjust position values for part placement

### Adding New Firebase Data Listeners
In `src/db.js`, add new methods following the pattern in `setupFish()`:
```javascript
firebase.database().ref("path/").on('child_added', callback);
```

### Running in Development
1. `npm install` (first time only)
2. `npm run dev` (starts watch mode)
3. Open `dist/index.html` in browser (or serve via local server)

## Debugging Tips

- Check browser console for Three.js warnings and Firebase connection issues
- Use `console.log()` statements in animation loop sparingly (performance impact)
- PointLightHelper objects added to scene for visualizing light positions
- OrbitControls target set to `(0, 100, 0)` - adjust if camera behavior seems off

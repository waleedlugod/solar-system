import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as lil from "lil-gui";
import { gsap } from "gsap";

/**
 * Textures
 */
const loadPercent = document.querySelector("h1#load-percent");
const loadingManager = new THREE.LoadingManager(() => {
    loadPercent.dataset.percent = "100";
});
const textureLoader = new THREE.TextureLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

const sunColorTexture = textureLoader.load("/textures/sun/color.jpg");

const mercuryColorTexture = textureLoader.load("/textures/mercury/color.jpg");

const venusColorTexture = textureLoader.load("/textures/venus/color.jpg");

const earthColorTexture = textureLoader.load("/textures/earth/color.jpg");
const earthSpecularTexture = textureLoader.load("/textures/earth/specular.jpg");

const moonColorTexture = textureLoader.load("/textures/moon/color.jpg");

const marsColorTexture = textureLoader.load("/textures/mars/color.jpg");

const jupiterColorTexture = textureLoader.load("/textures/jupiter/color.jpg");

const saturnColorTexture = textureLoader.load("/textures/saturn/color.jpg");
const saturnRingColorTexture = textureLoader.load("/textures/saturn/ringColor.png");

const uranusColorTexture = textureLoader.load("/textures/uranus/color.jpg");
const uranusRingColorTexture = textureLoader.load("/textures/uranus/ringColor.png");

const neptuneColorTexture = textureLoader.load("/textures/neptune/color.jpg");

const plutoColorTexture = textureLoader.load("/textures/pluto/color.jpg");

cubeTextureLoader.setPath("/textures/env/");
const envMap = cubeTextureLoader.load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);

// GUI
const gui = new lil.GUI();
gui.show(false);

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = envMap;

/**
 * Objects
 */
// 1 unit = 1000 kilometers
// Parameters
const planetsParameters = [
    {
        // Sun
        radius: 696.434,
        spin: Math.PI * 2 * (1 / 25.05),
        distance: 0,
    },
    {
        // Mercury
        radius: 2.4397,
        spin: Math.PI * 2 * (1 / 58.646),
        distance: 1000,
    },
    {
        // Venus
        radius: 6.0518,
        spin: Math.PI * 2 * (1 / -243.0226),
        distance: 1100,
    },
    {
        // Earth
        radius: 6.371,
        spin: Math.PI * 2 * (1 / 0.99726968),
        distance: 1200,
    },
    {
        // Mars
        radius: 3.3895,
        spin: Math.PI * 2 * (1 / 1.025957),
        distance: 1250,
    },
    {
        // Jupiter
        radius: 69.911,
        spin: Math.PI * 2 * (1 / 0.41354167),
        distance: 1400,
    },
    {
        // Saturn
        radius: 58.232,
        spin: Math.PI * 2 * (1 / 0.43958333),
        distance: 1700,
    },
    {
        // Uranus
        radius: 25.362,
        spin: Math.PI * 2 * (1 / 0.708),
        distance: 2000,
    },
    {
        // Neptune
        radius: 24.622,
        spin: Math.PI * 2 * (1 / 0.6713),
        distance: 2200,
    },
    {
        // Pluto
        radius: 1.1883,
        spin: Math.PI * 2 * (1 / -6.38723),
        distance: 2300,
    },
];

// Sun
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(planetsParameters[0].radius, 128, 64),
    new THREE.MeshBasicMaterial({
        map: sunColorTexture,
    })
);

// Mercury
const mercury = new THREE.Mesh(
    new THREE.SphereGeometry(planetsParameters[1].radius, 64, 32),
    new THREE.MeshStandardMaterial({
        map: mercuryColorTexture,
    })
);
mercury.position.z = planetsParameters[1].distance;

// Venus
const venus = new THREE.Mesh(
    new THREE.SphereGeometry(planetsParameters[2].radius, 64, 32),
    new THREE.MeshStandardMaterial({
        map: venusColorTexture,
    })
);
venus.position.z = planetsParameters[2].distance;

// Earth
const earth = new THREE.Mesh(
    new THREE.SphereGeometry(planetsParameters[3].radius, 64, 32),
    new THREE.MeshPhongMaterial({
        map: earthColorTexture,
        specular: earthSpecularTexture,
    })
);
earth.position.z = planetsParameters[3].distance;

// Moon
const moonParameters = {
    radius: 1.773174,
    spin: Math.PI * 2 * (1 / 27.321661),
    orbit: 1 / 29.530589,
    distanceFromEarth: 10,
};
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.173174, 64, 32),
    new THREE.MeshStandardMaterial({
        map: moonColorTexture,
    })
);
moon.position.z = earth.position.z + moonParameters.distanceFromEarth;
moon.rotation.y = 1.5;

// Mars
const mars = new THREE.Mesh(
    new THREE.SphereGeometry(planetsParameters[4].radius, 64, 32),
    new THREE.MeshStandardMaterial({
        map: marsColorTexture,
    })
);
mars.position.z = planetsParameters[4].distance;

// Jupiter
const jupiter = new THREE.Mesh(
    new THREE.SphereGeometry(planetsParameters[5].radius, 64, 32),
    new THREE.MeshStandardMaterial({
        map: jupiterColorTexture,
    })
);
jupiter.position.z = planetsParameters[5].distance;

// Saturn
const saturnGroup = new THREE.Group();
const saturn = new THREE.Mesh(
    new THREE.SphereGeometry(planetsParameters[6].radius, 64, 32),
    new THREE.MeshStandardMaterial({
        map: saturnColorTexture,
    })
);
saturn.position.z = planetsParameters[6].distance;

const saturnRings = new THREE.Mesh(
    new THREE.RingGeometry(67.3, 140.3),
    new THREE.MeshStandardMaterial({
        map: saturnRingColorTexture,
        side: THREE.DoubleSide,
        transparent: true,
    })
);
saturnRings.rotation.x = Math.PI * 0.45;
saturnRings.position.copy(saturn.position);
saturnGroup.add(saturn, saturnRings);

// Uranus
const uranusGroup = new THREE.Group();
const uranus = new THREE.Mesh(
    new THREE.SphereGeometry(planetsParameters[7].radius, 64, 32),
    new THREE.MeshStandardMaterial({
        map: uranusColorTexture,
    })
);
uranus.position.z = planetsParameters[7].distance;

const uranusRings = new THREE.Mesh(
    new THREE.RingGeometry(42, 63.93),
    new THREE.MeshStandardMaterial({
        map: uranusRingColorTexture,
        side: THREE.DoubleSide,
        transparent: true,
    })
);
uranusRings.rotation.x = Math.PI * 0.2;
uranusRings.position.copy(uranus.position);
uranusGroup.add(uranus, uranusRings);

// Neptune
const neptune = new THREE.Mesh(
    new THREE.SphereGeometry(planetsParameters[8].radius, 64, 32),
    new THREE.MeshStandardMaterial({
        map: neptuneColorTexture,
    })
);
neptune.position.z = planetsParameters[8].distance;

// Pluto
const pluto = new THREE.Mesh(
    new THREE.SphereGeometry(planetsParameters[9].radius, 64, 32),
    new THREE.MeshStandardMaterial({
        map: plutoColorTexture,
    })
);
pluto.position.z = planetsParameters[9].distance;

const planets = [sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto];
scene.add(
    sun,
    mercury,
    venus,
    earth,
    moon,
    mars,
    jupiter,
    saturnGroup,
    uranusGroup,
    neptune,
    pluto
);

/**
 * Lights
 */
const sunLight = new THREE.PointLight(0xffffff, 1);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const moonLight = new THREE.PointLight(0xffffff, 0.5, 20);
moon.add(moonLight);

/**
 * Camera
 */
// Controls focus
const controlsParameters = {
    focus: 0,
    cameraAngle: 3.86,
};

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000);
camera.position.x =
    Math.sin(controlsParameters.cameraAngle) *
    planets[controlsParameters.focus].geometry.parameters.radius *
    3;
camera.position.z =
    Math.cos(controlsParameters.cameraAngle) *
    planets[controlsParameters.focus].geometry.parameters.radius *
    3;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;

// Update camera
window.addEventListener("resize", () => {
    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function focusPlanet() {
    const destination = new THREE.Vector3();
    destination.copy(planets[controlsParameters.focus].position);
    destination.x +=
        Math.sin(controlsParameters.cameraAngle) *
        planets[controlsParameters.focus].geometry.parameters.radius *
        3;
    destination.z +=
        Math.cos(controlsParameters.cameraAngle) *
        planets[controlsParameters.focus].geometry.parameters.radius *
        3;
    gsap.to(camera.position, {
        x: destination.x,
        y: destination.y,
        z: destination.z,
    });
    gsap.to(controls.target, {
        x: planets[controlsParameters.focus].position.x,
        y: planets[controlsParameters.focus].position.y,
        z: planets[controlsParameters.focus].position.z,
    });
}
gui.add(controlsParameters, "focus", 0, planets.length - 1, 1).onChange(focusPlanet);
gui.add(controlsParameters, "cameraAngle", 0, Math.PI * 2, 0.01).onChange(focusPlanet);
focusPlanet();

// Navigation
const navigateIn = document.querySelector("#navigate-in");
navigateIn.addEventListener("click", () => {
    if (controlsParameters.focus > 0) controlsParameters.focus--;
    focusPlanet();
});
const navigateOut = document.querySelector("#navigate-out");
navigateOut.addEventListener("click", () => {
    if (controlsParameters.focus < planets.length - 1) controlsParameters.focus++;
    focusPlanet();
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Clock
const clock = new THREE.Clock();

// Animate
function tick() {
    const deltaTime = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Animate planets
    for (let i = 0; i < planets.length; i++) {
        planets[i].rotation.y += deltaTime * planetsParameters[i].spin;
    }

    // Update moon
    moon.rotation.y = elapsedTime * moonParameters.spin;
    const moonOrbit = elapsedTime * moonParameters.orbit;
    moon.position.x = Math.sin(moonOrbit) * moonParameters.distanceFromEarth + earth.position.x;
    moon.position.y = Math.sin(moonOrbit) * moonParameters.distanceFromEarth + earth.position.y;
    moon.position.z = Math.cos(moonOrbit) * moonParameters.distanceFromEarth + earth.position.z;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
}

tick();

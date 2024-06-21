import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

const canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  59,
  canvas.clientWidth / canvas.clientHeight,
  0.2,
  50000
);
camera.position.set(300, 300, 22000);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  preserveDrawingBuffer: true,
});
renderer.setClearColor(0xffffff, 1);

// Настройка OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.dampingFactor = 0.05;
controls.minDistance = 16000;
controls.maxDistance = 35000;
controls.maxPolarAngle = Math.PI / 2;

const objLoader = new OBJLoader();
let object;

objLoader.load(
  "tyagovaya2v.obj",
  function (obj) {
    object = obj;
    const group = new THREE.Group();
    group.add(object);
    scene.add(group);
    group.scale.set(0.5, 0.5, 0.5);

    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const edgesGeometry = new THREE.EdgesGeometry(child.geometry);
        const edgesMaterial = new THREE.LineBasicMaterial({
          color: 0xffffff,
          linewidth: 10,
        });
        const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        group.add(edges);
      }
    });

    animate();
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error occurred while loading the model:", error);
  }
);

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  render();
});

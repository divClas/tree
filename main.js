import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

const canvas = document.getElementById("myCanvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  canvas.width / canvas.height,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

const loader = new OBJLoader();
let object;

loader.load(
  "test.obj",
  function (obj) {
    object = obj;
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    object.children.forEach((child) => {
      child.material = material;
    });
    object.position.set(0, 0, 0);
    scene.add(object);
    animate();
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error occurred while loading the model:", error);
  }
);

function animate() {
  requestAnimationFrame(animate);

  // Обновление камеры
  camera.position.z = 10;

  // Обновление сцены
  if (object) {
    object.rotation.y += 0.01;
  }
  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);
  // Отрисовка сцены
  renderer.render(scene, camera);
}

import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

const canvas = document.getElementById("myCanvas");

// Установка размера canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  59,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  50000
);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setClearColor(0xffffff, 1);

// Установка цвета фона на белый

// Настройка OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.dampingFactor = 0.05;
controls.minDistance = 20000;
controls.maxDistance = 40000;
controls.maxPolarAngle = Math.PI / 2;

const mtlLoader = new MTLLoader();
const objLoader = new OBJLoader();

let object; // Объявляем переменную здесь

mtlLoader.load(
  'tyagovaya2v.mtl',
  function (materials) {
    materials.preload();
    objLoader.setMaterials(materials);
    objLoader.load(
      'tyagovaya2v.obj',
      function (obj) {
        object = obj; // Присваиваем переменной object загруженный объект
        const group = new THREE.Group();
        group.add(object);
        scene.add(group);

        // Добавление белых линий
        const edgesGeometry = new THREE.EdgesGeometry(object.geometry);
        const edgesMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        group.add(edges);

        animate(); // Вызываем animate только после загрузки объекта
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.log("An error occurred while loading the model:", error);
      }
    );
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error occurred while loading the MTL file:", error);
  }
);

// Создание источников света
const ambientLight = new THREE.AmbientLight(0xffffff, 0.14);; // Мягкое окружающее освещение
const pointLight = new THREE.PointLight(0xffffff, 1, 100); // Точечный источник света
pointLight.position.set(1, 1, 1); // Позиция точечного источника света

// Добавление источников света в сцену
scene.add(ambientLight);
scene.add(pointLight);

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  render(); // Рендерим сцену после изменения размеров окна
});
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.getElementById("myCanvas");

// Установка размера canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  59,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  5000
);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: false, // Отключение сглаживания для повышения производительности
});

// Установка цвета фона на белый
renderer.setClearColor(0xffffff, 1);
renderer.outputEncoding = THREE.sRGBEncoding;
// Настройка OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.dampingFactor = 0.05;
controls.minDistance = 100;
controls.maxDistance = 40000;
controls.maxPolarAngle = Math.PI / 2;

const gltfLoader = new GLTFLoader();

let object; // Объявляем переменную здесь

gltfLoader.load(
  "tyagovaya1v.glb",
  function (gltf) {
    object = gltf.scene; // Присваиваем переменной object загруженный объект
    const group = new THREE.Group();
    group.add(object);
    scene.add(group);
    animate(); // Вызываем animate только после загрузки объекта
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error occurred while loading the model:", error);
  }
);

// // Создание источников света
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Мягкое окружающее освещение
// const pointLight = new THREE.PointLight(0xffffff, 0, 100); // Точечный источник света
// pointLight.position.set(1, 1, 1); // Позиция точечного источ
// ника света
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
function readGLBLog() {
  const logFile = "tyagovaya1v.glb.log";
  const xhr = new XMLHttpRequest();
  xhr.open("GET", logFile, true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      const logText = xhr.responseText;
      console.log(logText);
    }
  };
  xhr.send();
}

// Вызываем функцию для чтения логов
readGLBLog();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  render(); // Рендерим сцену после изменения размеров окна
});

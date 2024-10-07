<template>
    <v-app>
      <v-container fluid>
        <div class="three-container">
          <canvas id="three-canvas"></canvas>
        </div>
      </v-container>
    </v-app>
  </template>
  
  <script>
  import * as THREE from 'three';
  
  export default {
    name: 'App',
    mounted() {
    this.initThree();
  },
  methods: {
    initThree() {
      // シーンを作成
      const scene = new THREE.Scene();
      scene.add(new THREE.GridHelper(1000,1000));

      // カメラを設定
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 10;
      camera.position.y = 10;

      // レンダラーを設定
      const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas') });
      renderer.setSize(window.innerWidth, window.innerHeight);

      // シンプルなボックスを作成
    const generateGeometry = ()=> {
        const geometry1 = new THREE.BoxGeometry(10,3,10);
        const material1 = new THREE.MeshBasicMaterial({ color: 0xFFFFFFF });
        const cube1 = new THREE.Mesh(geometry1, material1);
        scene.add(cube1);
        cube1.position.x = 3.5;
        cube1.position.z = 3;
        const geometry2 = new THREE.CylinderGeometry(0.3,0.3,6);
        const material2 = new THREE.MeshBasicMaterial({ color: 0xDEB887 });
        const cylinders = [];
        const interval = 2;
        for(let i = 0; i < 16; i++) {
            const cylinder = new THREE.Mesh(geometry2, material2);
            cylinder.position.x = interval * (Math.floor(i / 4));
            cylinder.position.y = 3;
            cylinder.position.z = interval * (i % 4);
            cylinders.push(cylinder);
            scene.add(cylinder);
        }
    }
    generateGeometry();

      // アニメーションループ
    const animate = function () {
        requestAnimationFrame(animate);

        // 回転させる

        renderer.render(scene, camera);
    };
    const detectMousePoint = function () {
        let isClicking = false;
        const mouse = new THREE.Vector2();
    
        document.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            if(isClicking) {
                camera.position.x += mouse.x;
                camera.position.y += mouse.y;
            }
            camera.rotation.x = mouse.y;
            camera.rotation.y = mouse.x;
        });
        document.addEventListener('mousedown', () => {
            isClicking = true;
        });
        document.addEventListener('mouseup', () => {
            isClicking = false;
        });
        //Rで初期位置のリセット
        document.addEventListener('keydown', (event) => {
            if(event.key === 'r') {
                camera.position.x = 0;
                camera.position.y = 5;
                camera.position.z = 5;

            }
        });
    }
    detectMousePoint();
      animate();
    },
  },
};
  </script>
  
  <style scoped>
  /* Three.js を表示するコンテナ */
  .three-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
  }
  
  /* Three.js のキャンバスをレスポンシブに */
  #three-canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
  </style>
  
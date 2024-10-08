<template>
    <v-app>
        <div class="three-container">
            <canvas id="three-canvas"></canvas>
            <button id="up">↑</button>
            <button id="down">↓</button>
            <button id="left">←</button>
            <button id="right">→</button>
        </div>
    </v-app>
  </template>
  
  <script>
  import * as THREE from 'three';
  
  export default {
    name: 'BattleScene',
    mounted() {
    this.initThree();
  },
  methods: {
    initThree() {
      // シーンを作成
      const scene = new THREE.Scene();
      let cylinderList = [];
      scene.add(new THREE.GridHelper(1000,1000));

      // カメラを設定
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 10.8;
      camera.position.y = 10;
      camera.position.x = 3.2;

      // レンダラーを設定
      const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas') });
      renderer.setSize(window.innerWidth, window.innerHeight);

      // シンプルなボックスを作成
    const generateGeometry = ()=> {
        const geometry1 = new THREE.BoxGeometry(10,3,10);
        const material1 = new THREE.MeshBasicMaterial({ color: 0xFFFFFFF });
        const cube1 = new THREE.Mesh(geometry1, material1);
        scene.add(cube1);
        cube1.position.x = 0;
        cube1.position.z = 0;
        const geometry2 = new THREE.CylinderGeometry(0.3,0.3,6);
        const interval = 2;
        const offset_x = -3;
        const offset_z = -3;
        const offset_y = 3;
        for(let i = 0; i < 16; i++) {
            let material = new THREE.MeshBasicMaterial({ color: 0xDEB887 });
            let cylinder = new THREE.Mesh(geometry2, material);
            cylinder.position.x = offset_x +interval * (Math.floor(i / 4));
            cylinder.position.y = offset_y;
            cylinder.position.z = offset_z +interval * (i % 4);
            cylinderList.push(cylinder);
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
    const CameraMove = function () {
        let whichway = 0;
        document.getElementById('up').addEventListener('mousedown', function() {
            whichway = 1;
        });
        document.getElementById('down').addEventListener('mousedown', function() {
            whichway = 2;
        });
        document.getElementById('left').addEventListener('mousedown', function() {
            whichway = 3;
        });
        document.getElementById('right').addEventListener('mousedown', function() {
            whichway = 4;
        });
        document.getElementById('up').addEventListener('mouseup', function() {
            whichway = 0;
        });
        document.getElementById('down').addEventListener('mouseup', function() {
            whichway = 0;
        });
        document.getElementById('left').addEventListener('mouseup', function() {
            whichway = 0;
        });
        document.getElementById('right').addEventListener('mouseup', function() {
            whichway = 0;
        });
        document.getElementById('up').addEventListener('touchstart', function() {
            whichway = 1;
        });
        document.getElementById('down').addEventListener('touchstart', function() {
            whichway = 2;
        });
        document.getElementById('left').addEventListener('touchstart', function() {
            whichway = 3;
        });
        document.getElementById('right').addEventListener('touchstart', function() {
            whichway = 4;
        });
        document.getElementById('up').addEventListener('touchend', function() {
            whichway = 0;
        });
        document.getElementById('down').addEventListener('touchend', function() {
            whichway = 0;
        });
        document.getElementById('left').addEventListener('touchend', function() {
            whichway = 0;
        });
        document.getElementById('right').addEventListener('touchend', function() {
            whichway = 0;
        });
        const speed = 0.03;
        const radius = 20;
        let theta = Math.PI / 3;
        let phi = Math.PI / 3;
        const move = function() {
            /* cube1を中心に3次元極座標的に移動させる */
            /* 北極点、南極点に行ったら止まるようにする */

            switch(whichway) {
                case 1:
                    if(theta >= 4*Math.PI/10) {
                        break;
                    }
                    theta += speed;
                    break;
                case 2:
                    if(theta <= -4*Math.PI/10) {
                        break;
                    }
                    theta -= speed;
                    break;
                case 3:
                    phi += speed;
                    break;
                case 4:
                    phi -= speed;
                    break; 
            }
            camera.position.x = radius * Math.cos(theta) * Math.cos(phi);
            camera.position.z = radius * Math.cos(theta) * Math.sin(phi);
            camera.position.y = radius * Math.sin(theta);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
        setInterval(move, 1000 / 60);
    }
    CameraMove();

    const setBall = (i) => {
        const ballradius = 0.7;
        const geometry = new THREE.SphereGeometry(ballradius, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = cylinderList[i].position.x;
        sphere.position.y = cylinderList[i].position.y-0.3;
        sphere.position.z = cylinderList[i].position.z;
        scene.add(sphere);
    }
    const ClickDetect = () => {
        let selectedcylinder = null;
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const onClick = function(event) {
            const x = event.clientX;
            const y = event.clientY;
            const w = window.innerWidth;
            const h = window.innerHeight;
            mouse.x = (x / w) * 2 - 1;
            mouse.y = -(y / h) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children);
            if(intersects.length > 0) {
                if(intersects[0].object.material.color.getHex() === 0xFFFFFF) {
                    return;
                }
                if(intersects[0].object.material.color.getHex() === 0xFF0000) {
                    for(let i = 0; i < 16; i++) {
                        if(cylinderList[i] === selectedcylinder) {
                            /* ここで通し番号を取得 */
                            setBall(i);
                        }
                    }
                    intersects[0].object.material.color.set(0xDEB887);
                    selectedcylinder = null;
                    return;
                }
                if(intersects[0].object.material.color.getHex() === 0xDEB887) {
                    if(selectedcylinder !== null) {
                        selectedcylinder.material.color.set(0xDEB887);
                    }
                    intersects[0].object.material.color.set(0xFF0000);
                    selectedcylinder = intersects[0].object;
                    return;
                }
            }
        }
        document.addEventListener('click', onClick);
        document.addEventListener('touchstart', onClick);
    } 
    ClickDetect();
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
    width: 100%;
    height: 100vh;
  }
  
  /* Three.js のキャンバスをレスポンシブに */
  #three-canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
/* ボタンそれぞれにcssを割り当て */
   #up {
    position: fixed;
    /* 親要素の中央に配置 */
    top: 80%;
    left: 30%;

    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    font-size: 40px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    cursor: pointer;
  }

  #down {
    position: fixed;
    /* 親要素の中央に配置 */
    top: 90%;
    left: 30%;

    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    font-size: 40px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    cursor: pointer;
  }
  #right {
    position: fixed;
    /* 親要素の中央に配置 */
    top: 85%;
    left: 35%;

    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    font-size: 40px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    cursor: pointer;
  }
  #left {
    position: fixed;
    /* 親要素の中央に配置 */
    top: 85%;
    left: 25%;

    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    font-size: 40px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    cursor: pointer;
  }
  </style>
  
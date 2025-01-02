// 烟雾预警 粒子
import * as THREE from "three";

export class Smoke {
  scene: THREE.Scene;
  geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes> | undefined;
  matreial: THREE.PointsMaterial | undefined;
  points:
    | THREE.Points<
        any,
        THREE.Material | THREE.Material[],
        THREE.Object3DEventMap
      >
    | undefined;
  smokes: any;
  constructor(options: { scene: THREE.Scene }) {
    this.scene = options.scene;
    this.smokes = [];

    this.init();
  }

  init() {
    // 粒子初始化 空的缓冲几何体
    this.geometry = new THREE.BufferGeometry();

    this.matreial = new THREE.PointsMaterial({
      size: 50,
      map: new THREE.TextureLoader().load("/assets/smoke.png"),
      transparent: true,
      depthWrite: false, // 禁止深度写入
    });

    this.matreial.onBeforeCompile = function (shader) {
      // 修改着色器数据
      const vertex1 = `
        attribute float a_opacity;
        attribute float a_size;
        attribute float a_scale;
        varying float v_opacity;

        void main(){
          v_opacity = a_opacity;
      `;
      const glPointSize = `
        gl_PointSize = a_size * a_scale;
      `;
      shader.vertexShader = shader.vertexShader.replace("void main {", vertex1);
      shader.vertexShader = shader.vertexShader.replace(
        "gl_PointSize = a_size",
        glPointSize
      );

      const fragment1 = `
        varying float v_opacity;

        void main {
      `;

      const fragment2 = `
        gl_FragColor = vec4(outgoingLight, diffuseColor.a * v_opacity);
      `;
      shader.fragmentShader = shader.fragmentShader.replace(
        "void main {",
        fragment1
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        "gl_FragColor = vec4(outgoingLight, diffuseColor.a);",
        fragment2
      );
    };

    this.points = new THREE.Points(this.geometry, this.matreial);

    this.scene.add(this.points);
  }

  createParticle() {
    this.smokes.push({
      size: 50,
      opacity: 1,
      x: 0,
      y: 0,
      z: 0,
      speed: {
        x: Math.random(),
        y: Math.random() + 0.3,
        z: Math.random(),
      },
      scale: 1,
    });
  }

  setAttribute(
    positionList: number[],
    opacityList: number[],
    sizeList: number[],
    scaleList: number[]
  ) {
    // 坐标信息、纹理信息、自己设置的变量信息
    this.geometry?.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(positionList), 3)
    );
    this.geometry?.setAttribute(
      "a_opacity",
      new THREE.BufferAttribute(new Float32Array(opacityList), 1)
    );
    this.geometry?.setAttribute(
      "a_size",
      new THREE.BufferAttribute(new Float32Array(sizeList), 1)
    );
    this.geometry?.setAttribute(
      "a_scale",
      new THREE.BufferAttribute(new Float32Array(scaleList), 1)
    );
  }

  update() {
    const positionList: number[] = [];
    const opacityList: number[] = [];
    const sizeList: number[] = [];
    const scaleList: number[] = [];
    this.smokes = this.smokes.filter(
      (item: {
        opacity: number;
        x: number;
        speed: { x: number; y: number; z: number };
        y: number;
        z: number;
        size: number;
        scale: number;
      }) => {
        // 如果说达到某一个条件，就抛弃当前的粒子。opacity <= 0
        if (item.opacity < 0) {
          return false;
        }

        item.opacity -= 0.01;
        item.x = item.x - item.speed.x;
        item.y = item.y + item.speed.y;
        item.z = item.z - item.speed.z;

        item.scale += 0.01;
        positionList.push(item.x, item.y, item.z);
        opacityList.push(item.opacity);
        sizeList.push(item.size);
        scaleList.push(item.scale);
        return true;
      }
    );
    this.setAttribute(positionList, opacityList, sizeList, scaleList);
  }

  animation() {
    this.createParticle();

    this.update();
  }
}

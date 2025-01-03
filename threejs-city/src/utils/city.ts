import * as THREE from "three";
import { loadFBX } from "./loadFBX";
import {
  Background,
  Ball,
  Circle,
  Cone,
  Fly,
  Font,
  Radar,
  Rain,
  Road,
  Smoke,
  Snow,
  SurroundLine,
  Wall,
} from "./effect/index";
import { Tween } from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export class City {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  tweenPosition: Tween<THREE.Vector3> | null;
  tweenRotation: Tween<THREE.Euler> | null;
  height: { value: number };
  top: { value: number };
  time: { value: number };
  flag: boolean;
  controls: OrbitControls;
  effect: any;
  constructor(options: {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
  }) {
    this.loadCity();
    this.scene = options.scene;
    this.camera = options.camera;
    this.controls = options.controls;
    this.tweenPosition = null;
    this.tweenRotation = null;

    this.height = {
      value: 5,
    };

    this.time = {
      value: 0,
    };

    this.top = {
      value: 0,
    };

    this.effect = {};

    this.flag = false;
  }

  loadCity() {
    // 加载模型，并且渲染到画布上，需要放在静态文件目录下
    loadFBX("/model/beijing.fbx").then((object: any) => {
      object.traverse((child: any) => {
        if (child.isMesh) {
          new SurroundLine(this.scene, child, this.height, this.time);
        }
      });
      this.initEffect();
    });
  }

  initEffect() {
    new Background(this.scene);
    new Radar({
      scene: this.scene,
      time: this.time,
    });

    new Wall({
      scene: this.scene,
      time: this.time,
    });
    new Circle({
      scene: this.scene,
      time: this.time,
    });
    new Ball({
      scene: this.scene,
      time: this.time,
    });

    new Cone({
      scene: this.scene,
      top: this.top,
      height: this.height,
    });

    new Fly({
      scene: this.scene,
      time: this.time,
    });

    new Road({
      scene: this.scene,
      time: this.time,
    });

    new Font({
      scene: this.scene,
    });

    this.effect.snow = new Snow({
      scene: this.scene,
    });

    this.effect.rain = new Rain({
      scene: this.scene,
    });

    this.effect.smoke = new Smoke({
      scene: this.scene,
    });
    // 添加点击选择
    this.addClick();

    this.addWheel();
  }

  // 让场景跟随鼠标的坐标进行缩放
  addWheel() {
    const body = document.body;
    body.onmousewheel = (event) => {
      const value = 30; // 缩放系数
      // 获取到浏览器坐标
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      const vector = new THREE.Vector3(x, y, 0.5);
      vector.unproject(this.camera);
      vector.sub(this.camera.position).normalize();

      if (event.wheelDelta > 0) {
        this.camera.position.x += vector.x * value;
        this.camera.position.y += vector.y * value;
        this.camera.position.z += vector.z * value;

        this.controls.target.x += vector.x * value;
        this.controls.target.y += vector.y * value;
        this.controls.target.z += vector.z * value;
      } else {
        this.camera.position.x -= vector.x * value;
        this.camera.position.y -= vector.y * value;
        this.camera.position.z -= vector.z * value;

        this.controls.target.x -= vector.x * value;
        this.controls.target.y -= vector.y * value;
        this.controls.target.z -= vector.z * value;
      }
    };
  }

  addClick() {
    let flag = true;
    document.onmousedown = () => {
      flag = true;

      document.onmousemove = () => {
        flag = false;
      };
    };

    document.onmouseup = (event) => {
      if (flag) {
        this.clickEvent(event);
      }
      document.onmousemove = null;
    };
  }

  clickEvent(event: MouseEvent) {
    // 获取到浏览器坐标
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 创建设备坐标（三维）
    const standardVector = new THREE.Vector3(x, y, 0.5);

    // 转化为世界坐标
    const worldVector = standardVector.unproject(this.camera);

    // 做序列化
    const ray = worldVector.sub(this.camera.position).normalize();

    // 如何实现点击选中
    // 创建一个射线发射器，用来发射一条射线
    const raycaster = new THREE.Raycaster(this.camera.position, ray);

    // 返回射线碰撞到的物体
    const intersects = raycaster.intersectObjects(this.scene.children, true);
    console.log(intersects);
    let point3d = null;
    // 射线碰到的第一个物体就是选中的物体
    if (intersects.length) {
      point3d = intersects[0];
    }
    if (point3d) {
      const proportion = 3;
      // 开始动画来修改观察点
      const time = 2000;

      this.tweenPosition = new Tween(this.camera.position)
        .to(
          {
            x: point3d.point.x * proportion,
            y: point3d.point.y * proportion,
            z: point3d.point.z * proportion,
          },
          time
        )
        .start();

      this.tweenRotation = new Tween(this.camera.rotation)
        .to(
          {
            x: this.camera.rotation.x,
            y: this.camera.rotation.y,
            z: this.camera.rotation.z,
          },
          time
        )
        .start();
    }
  }

  start(delta: number) {
    for (const key in this.effect) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.effect[key] && this.effect[key].animation();
    }

    if (this.tweenPosition && this.tweenRotation) {
      this.tweenPosition.update();
      this.tweenRotation.update();
    }
    this.time.value += delta;
    this.height.value += 0.4;
    if (this.height.value > 160) {
      this.height.value = 5;
    }

    if (this.top.value > 15 || this.top.value < 0) {
      this.flag = !this.flag;
    }
    this.top.value += this.flag ? -0.8 : 0.8;
  }
}

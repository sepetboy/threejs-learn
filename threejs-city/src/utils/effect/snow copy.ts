/**
 * 文件引入问题解决方法：https://blog.csdn.net/qq_44278289/article/details/131230064
 */
import * as THREE from "three";

type PointType = {
  x: number;
  y: number;
  z: number;
  speedX: number;
  speedY: number;
  speedZ: number;
};

export class Snow {
  scene: THREE.Scene;
  range: number;
  count: number;
  material: THREE.PointsMaterial | undefined;
  geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes> | undefined;
  pointList: PointType[];
  points:
    | THREE.Points<
        THREE.BufferGeometry<THREE.NormalBufferAttributes>,
        THREE.PointsMaterial,
        THREE.Object3DEventMap
      >
    | undefined;
  constructor(options: { scene: THREE.Scene }) {
    this.scene = options.scene;

    // 范围
    this.range = 1000;
    // 雪花的个数
    this.count = 600;
    this.pointList = [];
    this.init();
  }
  init() {
    // 粒子和粒子系统
    // 材质
    this.material = new THREE.PointsMaterial({
      size: 30,
      map: new THREE.TextureLoader().load("/assets/snow.png"),
      transparent: true,
      opacity: 0.8,
      depthTest: false, //消除loader的黑色背景
    });

    // 几何对象
    this.geometry = new THREE.BufferGeometry();

    // 添加顶点信息
    for (let i = 0; i < this.count; i++) {
      const position = new THREE.Vector3(
        Math.random() * this.range - this.range / 2, //有正数也有负数
        Math.random() * this.range,
        Math.random() * this.range - this.range / 2
      ) as unknown as PointType;

      position.speedX = Math.random() - 0.5;
      position.speedY = Math.random() + 0.4;
      position.speedZ = Math.random() - 0.5;
      this.pointList.push(position);
    }
    this.geometry.setFromPoints(this.pointList as unknown as THREE.Vector3[]);

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }

  animation() {
    this.pointList.forEach((position) => {
      position.x -= position.speedX;
      position.y -= position.speedY;
      position.z -= position.speedZ;

      if (position.y <= 0) {
        position.y = this.range / 2;
      }

      this.points?.geometry?.setFromPoints(
        this.pointList as unknown as THREE.Vector3[]
      );
    });
  }
}

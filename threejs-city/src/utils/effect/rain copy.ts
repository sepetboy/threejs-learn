import * as THREE from "three";

type PointType = {
  x: number;
  y: number;
  z: number;
  speedY: number;
};

export class Rain {
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
    // 个数
    this.count = 800;
    this.pointList = [];
    this.init();
  }
  init() {
    this.material = new THREE.PointsMaterial({
      size: 10,
      map: new THREE.TextureLoader().load("/assets/rain.png"),
      transparent: true,
      opacity: 0.4,
      depthTest: false,
    });

    this.geometry = new THREE.BufferGeometry();

    for (let i = 0; i < this.count; i++) {
      const position = new THREE.Vector3(
        Math.random() * this.range - this.range / 2, //有可能是负数
        Math.random() * this.range,
        Math.random() * this.range - this.range / 2
      ) as unknown as PointType;

      position.speedY = 20;
      this.pointList.push(position);
    }
    this.geometry.setFromPoints(this.pointList as unknown as THREE.Vector3[]);

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }

  animation() {
    this.pointList.forEach((position) => {
      position.y -= position.speedY;

      // 边界检查
      if (position.y <= 0) {
        position.y = this.range / 2;
      }
    });
    this.points?.geometry.setFromPoints(
      this.pointList as unknown as THREE.Vector3[]
    );
  }
}

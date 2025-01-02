import * as THREE from "three";

type PointType = {
  x: number;
  y: number;
  z: number;
  speedX?: number;
  speedY: number;
  speedZ?: number;
};

export class Points {
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  setPosition: Function;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  setAnimation: Function;
  url: string;
  size: number;
  opacity: number;
  constructor(options: {
    scene: THREE.Scene;
    range: number;
    count: number;
    size: number;
    opacity: number;
    url: string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    setPosition: Function;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    setAnimation: Function;
  }) {
    this.scene = options.scene;

    // 范围
    this.range = options.range;
    // 个数
    this.count = options.count;
    this.url = options.url;
    this.size = options.size;
    this.opacity = options.opacity;
    this.pointList = [];

    this.setPosition = options.setPosition;
    this.setAnimation = options.setAnimation;
    this.init();
  }

  init() {
    // 粒子和粒子系统
    // 材质
    this.material = new THREE.PointsMaterial({
      size: this.size,
      map: new THREE.TextureLoader().load(this.url),
      transparent: true,
      opacity: this.opacity,
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
      this.setPosition(position);
      this.pointList.push(position);
    }
    this.geometry.setFromPoints(this.pointList as unknown as THREE.Vector3[]);

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }

  animation() {
    this.pointList.forEach((position) => {
      this.setAnimation(position);

      this.points?.geometry?.setFromPoints(
        this.pointList as unknown as THREE.Vector3[]
      );
    });
  }
}

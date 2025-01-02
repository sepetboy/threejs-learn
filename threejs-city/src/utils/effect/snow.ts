/**
 * 文件引入问题解决方法：https://blog.csdn.net/qq_44278289/article/details/131230064
 */
import * as THREE from "three";
import { Points } from "./points";

type PointType = {
  x: number;
  y: number;
  z: number;
  speedX: number;
  speedY: number;
  speedZ: number;
};

export class Snow {
  points: Points;
  constructor(options: { scene: THREE.Scene }) {
    this.points = new Points({
      scene: options.scene,
      range: 1000,
      count: 600,
      size: 30,
      opacity: 0.8,
      url: "/assets/snow.png",
      setPosition(position: PointType) {
        position.speedX = Math.random() - 0.5;
        position.speedY = Math.random() + 0.4;
        position.speedZ = Math.random() - 0.5;
      },
      setAnimation(position: PointType) {
        position.x -= position.speedX;
        position.y -= position.speedY;
        position.z -= position.speedZ;

        if (position.y <= 0) {
          position.y = this.range / 2;
        }
      },
    });
  }
  animation() {
    this.points.animation();
  }
}

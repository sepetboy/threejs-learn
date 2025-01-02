import * as THREE from "three";
import { Points } from "./points";

type PointType = {
  x: number;
  y: number;
  z: number;
  speedY: number;
};

export class Rain {
  points: Points;
  constructor(options: { scene: THREE.Scene }) {
    this.points = new Points({
      scene: options.scene,
      range: 1000,
      count: 800,
      size: 10,
      opacity: 0.4,
      url: "/assets/rain.png",
      setPosition(position: PointType) {
        position.speedY = 20;
      },
      setAnimation(position: PointType) {
        position.y -= position.speedY;

        // 边界检查
        if (position.y <= 0) {
          position.y = this.range / 2;
        }
      },
    });
  }

  animation() {
    this.points?.animation();
  }
}

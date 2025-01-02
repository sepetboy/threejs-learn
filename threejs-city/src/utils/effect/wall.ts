import * as THREE from "three";
import { color } from "../../config";
import { Cylinder } from "./cylinder";
export class Wall {
  scene: THREE.Scene;
  time: { value: number };
  config: {
    radius: number;
    height: number;
    open: boolean;
    color: string;
    opacity: number;
    speed: number;
  };
  constructor(options: { scene: THREE.Scene; time: { value: number } }) {
    this.scene = options.scene;
    this.time = options.time;
    this.config = {
      radius: 50,
      height: 50,
      open: true,
      color: color.wallColor,
      opacity: 0.6,
      speed: 1.0,
    };

    new Cylinder({
      scene: this.scene,
      time: this.time,
    }).createCylinder(this.config);
  }
}

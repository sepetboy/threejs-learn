import * as THREE from "three";
import { color } from "../../config";
import { Cylinder } from "./cylinder";
export class Circle {
  scene: THREE.Scene;
  time: { value: number };
  config: {
    radius: number;
    height: number;
    open: boolean;
    color: string;
    opacity: number;
    speed: number;
    position: {
      x: number;
      y: number;
      z: number;
    };
  };
  constructor(options: { scene: THREE.Scene; time: { value: number } }) {
    this.scene = options.scene;
    this.time = options.time;
    this.config = {
      radius: 50,
      height: 1,
      open: false,
      color: color.circleColor,
      opacity: 0.6,
      speed: 2.0,
      position: {
        x: 300,
        y: 0,
        z: 300,
      },
    };
    new Cylinder({
      ...options,
    }).createCylinder(this.config);
  }
}

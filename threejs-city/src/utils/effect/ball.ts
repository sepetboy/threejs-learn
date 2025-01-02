import * as THREE from "three";
import { color } from "../../config";

export class Ball {
  scene: THREE.Scene;
  time: { value: number };
  constructor(options: { scene: THREE.Scene; time: { value: number } }) {
    this.scene = options.scene;
    this.time = options.time;

    this.createSphere({
      color: color.ballColor,
      height: 60,
      opacity: 0.6,
      speed: 4.0,
      position: {
        x: 300,
        y: 0,
        z: -200,
      },
    });
  }

  createSphere(options: {
    height: number;
    color: string;
    opacity: number;
    speed: number;
    position?: {
      x: number;
      y: number;
      z: number;
    };
  }) {
    if (!options.position) {
      options.position = {
        x: 0,
        y: 0,
        z: 0,
      };
    }
    const geometry = new THREE.SphereGeometry(
      50,
      32,
      32,
      Math.PI / 2,
      Math.PI * 2,
      0,
      Math.PI / 2
    );

    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_color: {
          value: new THREE.Color(options.color),
        },
        u_height: {
          value: options.height,
        },
        u_opacity: {
          value: options.opacity,
        },
        u_speed: {
          value: options.speed || 1,
        },
        u_time: this.time,
      },
      vertexShader: `
        uniform float u_time;
        uniform float u_height;
        uniform float u_speed;
        varying float v_opacity;

        void main() {
          vec3 v_position = position * mod(u_time / u_speed, 1.0);
          
          v_opacity = mix(1.0,0.0,position.y / u_height);

          gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 u_color;
        uniform float u_opacity;
        varying float v_opacity;

        void main() {
          gl_FragColor = vec4(u_color, u_opacity * v_opacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide, // 圆
      depthTest: false, // 不会被建筑物遮挡
    });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.copy(options.position);
    this.scene.add(mesh);
  }
}
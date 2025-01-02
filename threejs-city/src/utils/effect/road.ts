import * as THREE from "three";
import { color } from "../../config";
// TODO 有bug待解决
export class Road {
  scene: THREE.Scene;
  time: { value: number };
  constructor(options: { scene: THREE.Scene; time: { value: number } }) {
    this.scene = options.scene;
    this.time = options.time;

    this.createFly({
      range: 200,
      height: 300,
      color: color.flyColor,
      size: 3, // 飞线宽度
    });
  }

  createFly(options: {
    range: number;
    height: number;
    color: string;
    size: number;
  }) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-320, 0, 160),
      new THREE.Vector3(-150, 0, -40),
      new THREE.Vector3(-10, 0, -35),
      new THREE.Vector3(40, 0, 40),
      new THREE.Vector3(30, 0, 150),
      new THREE.Vector3(-100, 0, 310),
    ]);

    const len = 400;
    // 获取粒子
    const points = curve.getPoints(len);

    const positions: number[] = [];
    const aPositions: number[] = [];
    points.forEach((item, index) => {
      positions.push(item.x, item.y, item.z);
      aPositions.push(index);
    });

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute(
      "a_position",
      new THREE.Float32BufferAttribute(aPositions, 3)
    );

    const marterial = new THREE.ShaderMaterial({
      uniforms: {
        u_color: {
          value: new THREE.Color(options.color),
        },
        u_range: {
          value: options.range,
        },
        u_size: {
          value: options.size,
        },
        u_total: {
          value: len,
        },
        u_time: this.time,
      },
      vertexShader: `
        attribute float a_position;
        
        uniform float u_time;
        uniform float u_size;
        uniform float u_range;
        uniform float u_total;
        
        varying float v_opacity;

        void main(){
          float size = u_size;
          float total_number = u_total * mod(u_time, 1.0);

          if(total_number > a_position && total_number < a_position + u_range) {
            float index = (a_position + u_range - total_number) / u_range;
            size *= index;
            v_opacity = 1.0;
          } else {
            v_opacity = 0.0; 
          }

          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size;
        }
      `,
      fragmentShader: `
        uniform vec3 u_color;
        varying float v_opacity;
        void main(){
          gl_FragColor = vec4(u_color, v_opacity);
        }
      `,
      transparent: true,
    });

    const point = new THREE.Points(geometry, marterial);
    this.scene.add(point);
  }
}

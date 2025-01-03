import * as THREE from "three";
import { color } from "../../config";
// TODO 有bug待解决
type PositionType = {
  x: number;
  y: number;
  z: number;
};
export class Fly {
  scene: THREE.Scene;
  time: { value: number };
  constructor(options: { scene: THREE.Scene; time: { value: number } }) {
    this.scene = options.scene;
    this.time = options.time;

    this.createFly({
      // 起始点
      source: {
        x: 300,
        y: 0,
        z: -200,
      },
      // 终止点
      target: {
        x: -500,
        y: 0,
        z: -240,
      },
      range: 200,
      height: 300,
      color: color.flyColor,
      size: 3, // 飞线宽度
    });
  }

  createFly(options: {
    source: PositionType;
    target: PositionType;
    range: number;
    height: number;
    color: string;
    size: number;
  }) {
    // 起始点
    const source = new THREE.Vector3(
      options.source.x,
      options.source.y,
      options.source.z
    );
    // 终止点
    const target = new THREE.Vector3(
      options.target.x,
      options.target.y,
      options.target.z
    );
    // 通过起始点和终止点计算中心位置
    const center = target.clone().lerp(source, 0.5);
    // 设置中心位置的高度
    center.y += options.height;

    // 起点到终点的距离
    const len = source.distanceTo(target);

    // 添加好了贝塞尔曲线运动
    const curve = new THREE.QuadraticBezierCurve3(source, center, target);

    // 获取粒子
    const points = curve.getPoints(len);

    const positions: number[] = [];
    const aPositions: number[] = [];
    points.forEach((item, index) => {
      positions.push(item.x, item.y, item.z);
      aPositions.push(index);
    });

    const geometry = new THREE.BufferGeometry();

    // 从position里面获取位置信息，每次获取三个信息：x/y/z
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    // 从position里面获取位置信息，每次获取一个信息
    geometry.setAttribute(
      "a_position",
      new THREE.Float32BufferAttribute(aPositions, 1)
    );
    console.log("a_position", new THREE.Float32BufferAttribute(aPositions, 3));

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
          float total_number = u_total * mod(u_time, 1.0);// mod 对1取余

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

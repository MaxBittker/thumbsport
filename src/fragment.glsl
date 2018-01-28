precision mediump float;

uniform float t;
uniform vec2 resolution;
uniform sampler2D texture;
uniform vec2 mouse;
uniform vec3 orbs[2];
uniform float health;

varying vec2 uv;

float PI = 3.14159;
vec2 doModel(vec3 p);

// clang-format off
#pragma glslify: smin = require('glsl-smooth-min')
#pragma glslify: hsv2rgb = require('glsl-hsv2rgb')

#pragma glslify: raytrace = require('glsl-raytrace', map = doModel, steps = 90)
#pragma glslify: normal = require('glsl-sdf-normal', map = doModel)
#pragma glslify: orenn = require('glsl-diffuse-oren-nayar')
#pragma glslify: gauss = require('glsl-specular-gaussian')
#pragma glslify: camera = require('glsl-turntable-camera')

#pragma glslify: fbm4d = require('glsl-fractal-brownian-noise/4d')
#pragma glslify: fbm3d = require('glsl-fractal-brownian-noise/3d')

#pragma glslify: noise3d = require('glsl-noise/simplex/3d')
#pragma glslify: noise2d = require('glsl-noise/simplex/2d')
#pragma glslify: noise4d = require('glsl-noise/simplex/4d')

#pragma glslify: squareFrame = require('glsl-square-frame')
// #pragma glslify: noise4d = require(glsl-noise/simplex/4d)
// clang-format on

vec2 doModel(vec3 p) {
  float r = 0.5;
  // 1.2 + fbm4d(vec4(p,t*0.1), 5) * 0.05
  float d = 100.;
  float id = 0.0;

  for (int i = 0; i < 2; i++) {
    float b = length(p - orbs[i].xyz) - r;
    if (b < d) {
      d = b;
      id = float(i);
    }
  }
  // d = max(wall-wr , d);

  return vec2(d, id);
}

vec3 lighting(vec3 pos, vec3 nor, vec3 ro, vec3 rd) {
  vec3 dir1 = normalize(vec3(0, 1, 0));
  vec3 col1 = vec3(1.0, 0.7, 2.4);
  vec3 dif1 = col1 * orenn(dir1, -rd, nor, 0.15, 1.0);
  vec3 spc1 = col1 * gauss(dir1, -rd, nor, 0.15);

  // vec3 dir2 = normalize(vec3(0.4, -1, 0.4));
  vec3 dir2 = normalize(vec3(0.9, -1, 0.4));
  vec3 col2 = vec3(2.4, 0.8, 0.9);
  vec3 dif2 = col2 * orenn(dir2, -rd, nor, 0.15, 1.0);
  vec3 spc2 = col2 * gauss(dir2, -rd, nor, 0.15);

  return dif1 + spc1 + dif2 + spc2;
}

void main() {
  vec2 st = squareFrame(resolution);

  vec3 color = vec3(0.0);
  vec3 ro, rd;

  float rotation = 0.;
  float height = 1.0;
  float dist = 3.0;
  // camera(rotation, height, dist, resolution, ro, rd);
  bool touched = false;
  // vec2 tr = raytrace(ro, rd);
  // if (tr.x > -0.5) {
  // vec3 pos = ro + rd * tr.x;
  // vec3 nor = normal(pos);

  // color = lighting(pos, nor, ro, rd);
  // touched = true;
  // }

  float d = 100.;
  float wd = 100.;

  float team = 0.;
  float ad = length(orbs[0] - orbs[1]);

  for (int i = 0; i < 2; i++) {
    float b = length(st - orbs[i].xy) - 0.1;
    b += noise3d(vec3(st * 4., t)) * 0.05;
    if (d < b) {
      team = float(i);
    }
    d = smin(d, b, 0.5);
  }
  wd = (sin(d) * 0.5 + 1.0);

  if (d * 100. > 5.) {
    team = 0.;
    wd = 0.;

    // vec4 back = texture2D(texture, uv +(vec2(0.0, 0./resolution.y)));
    // color = sample.rgb*0.9;

  } else {
  }
  // float wd = sin((d-t*0.2)*100.);
  float hue = (team * 0.3) + sin((d - (t * 0.5) * (team - 0.5)) * 50.) * 0.1;
  float saturation = (wd * 0.01) + 0.3;
  float value = 0.3 + wd * 0.1 + ((1.5 - ad) * 0.2);
  color = hsv2rgb(vec3(hue, saturation, value));

  // float a = noise3d( vec3(uv*10.,t*1.1) ) * PI*2.;
  //   float ps = 2.0;
  //   vec4 sample = texture2D(texture, uv + vec2( (cos(a)*ps)/resolution.x,
  //   (sin(a)*ps)/resolution.y ));

  if (abs(st.x) < 0.8 && abs(st.y) < 0.9) {
  } else {
    if (st.y < health) {
      color = hsv2rgb(vec3(0.0, 0.5, 0.5));
    }
  }
  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.0;
}
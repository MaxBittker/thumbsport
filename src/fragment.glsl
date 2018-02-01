precision mediump float;

uniform float t;
uniform vec2 resolution;
uniform sampler2D texture;
uniform vec2 mouse;
uniform vec3 orbs[2];
uniform bool side;
uniform float fightDistance;

uniform float health;

varying vec2 uv;

float PI = 3.14159;

// clang-format off
#pragma glslify: smin = require('glsl-smooth-min')
#pragma glslify: hsv2rgb = require('glsl-hsv2rgb')

// #pragma glslify: raytrace = require('glsl-raytrace', map = doModel, steps = 90)
// #pragma glslify: normal = require('glsl-sdf-normal', map = doModel)
// #pragma glslify: orenn = require('glsl-diffuse-oren-nayar')
// #pragma glslify: gauss = require('glsl-specular-gaussian')
#pragma glslify: camera = require('glsl-turntable-camera')

// #pragma glslify: fbm4d = require('glsl-fractal-brownian-noise/4d')
// #pragma glslify: fbm3d = require('glsl-fractal-brownian-noise/3d')
#pragma glslify: voronoi3d = require('glsl-voronoi-noise/3d')
// #pragma glslify: voronoi2d = require('glsl-voronoi-noise/2d')


// #pragma glslify: noise3d = require('glsl-noise/simplex/3d')
// #pragma glslify: noise2d = require('glsl-noise/simplex/2d')
// #pragma glslify: noise4d = require('glsl-noise/simplex/4d')

#pragma glslify: squareFrame = require('glsl-square-frame')
// #pragma glslify: noise4d = require(glsl-noise/simplex/4d)
// clang-format on
// vec2 rd = vec2(atan(teamOrg.y, teamOrg.x), length(teamOrg) * 20.);
void main() {
  vec2 st = squareFrame(resolution);
  vec2 pix = 1. / resolution;
  vec3 color = vec3(0.0);

  float d = 100.;

  int player = 0;
  float ad = length(orbs[0] - orbs[1]);
  vec2 teamOrg = orbs[0].xy - st;
  for (int i = 0; i < 2; i++) {
    float b = length(st - orbs[i].xy) - 0.1;
    float fi = float(i);
    b += (voronoi3d(vec3(st * 10., t)).x - 0.5) * 0.1 * (0.5 - fi) *
         (side ? -1. : 1.);
    player = (d > b) ? i : player;

    teamOrg = (d > b) ? orbs[i].xy - st : teamOrg;
    vec2 rd = vec2(atan(teamOrg.y, teamOrg.x), length(teamOrg) * 20.);

    d = smin(d, b, 0.2);
  }

  bool clash =
      fightDistance > (sin((d * 30.) - t * 10.) * 0.4 * (1. - d)) || d > 0.8;

  vec3 bg = hsv2rgb(vec3(0.1, clash ? 0.1 : 0.9, 0.9));

  float thrsh = 1. / 200.;
  float hue = (player == 1) ? 0.03 : .6;
  float saturation = 0.7;
  float value = d < (thrsh - (pix.x * 2.)) ? 0.7 : 0.;

  color = (d > thrsh) ? bg : hsv2rgb(vec3(hue, saturation, value));

  vec3 vcolor = color;
  vcolor = abs(st.x) < 0.8 + (pix.x * 2.) && abs(st.y) < 0.8 + (pix.y * 2.)
               ? hsv2rgb(vec3(0.1, 0.1, 0.4))
               : vcolor;

  float vtext = voronoi3d(vec3(st * 20. - vec2(-t * 2.0, d), t)).x;
  float hp = health * 0.8;
  float tk = side ? 0.03 : 0.6;

  bool drain =
      (fightDistance < 0.4 && ((st.x + 0.1 * (0.5 - fightDistance)) > hp));

  vcolor =
      (st.x < hp && st.x > -0.8 && st.y < -0.84 && st.y > -0.96 && vtext < 0.7)
          ? hsv2rgb(
                vec3(tk, 0.7, vtext > 0.7 - pix.x * 30. || drain ? .0 : 0.7))
          : vcolor;

  color = (abs(st.x) < 0.8 && abs(st.y) < 0.8) ? color : vcolor;

  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.0;
}

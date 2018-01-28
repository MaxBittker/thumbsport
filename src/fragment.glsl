precision mediump float;

uniform float t;
uniform vec2 resolution;
uniform sampler2D texture;
uniform vec2 mouse;
uniform vec3 orbs[2];
uniform float health;

varying vec2 uv;

float PI = 3.14159;

// clang-format off
#pragma glslify: smin = require('glsl-smooth-min')
#pragma glslify: hsv2rgb = require('glsl-hsv2rgb')

// #pragma glslify: raytrace = require('glsl-raytrace', map = doModel, steps = 90)
// #pragma glslify: normal = require('glsl-sdf-normal', map = doModel)
#pragma glslify: orenn = require('glsl-diffuse-oren-nayar')
#pragma glslify: gauss = require('glsl-specular-gaussian')
#pragma glslify: camera = require('glsl-turntable-camera')

#pragma glslify: fbm4d = require('glsl-fractal-brownian-noise/4d')
#pragma glslify: fbm3d = require('glsl-fractal-brownian-noise/3d')
#pragma glslify: voronoi3d = require('glsl-voronoi-noise/3d')
#pragma glslify: voronoi2d = require('glsl-voronoi-noise/2d')


#pragma glslify: noise3d = require('glsl-noise/simplex/3d')
#pragma glslify: noise2d = require('glsl-noise/simplex/2d')
#pragma glslify: noise4d = require('glsl-noise/simplex/4d')

#pragma glslify: squareFrame = require('glsl-square-frame')
// #pragma glslify: noise4d = require(glsl-noise/simplex/4d)
// clang-format on

vec2 rotate2D(vec2 _st, float _angle) {
  _st -= 0.5;
  _st = mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle)) * _st;
  _st += 0.5;
  return _st;
}

vec2 tile(vec2 _st, float _zoom) {
  _st *= _zoom;
  return fract(_st);
}

vec2 rotateTilePattern(vec2 _st) {

  //  Scale the coordinate system by 2x2
  _st *= 2.0;

  //  Give each cell an index number
  //  according to its position
  float index = 0.0;
  index += step(1., mod(_st.x, 2.0));
  index += step(1., mod(_st.y, 2.0)) * 2.0;

  //      |
  //  2   |   3
  //      |
  //--------------
  //      |
  //  0   |   1
  //      |

  // Make each cell between 0.0 - 1.0
  _st = fract(_st);

  // Rotate each cell according to the index
  if (index == 1.0) {
    //  Rotate cell 1 by 90 degrees
    _st = rotate2D(_st, PI * 0.5);
  } else if (index == 2.0) {
    //  Rotate cell 2 by -90 degrees
    _st = rotate2D(_st, PI * -0.5);
  } else if (index == 3.0) {
    //  Rotate cell 3 by 180 degrees
    _st = rotate2D(_st, PI);
  }

  return _st;
}

void main() {
  vec2 st = squareFrame(resolution);

  vec3 color = vec3(0.0);

  float d = 100.;
  float wd = 100.;

  float team = 0.;
  float ad = length(orbs[0] - orbs[1]);
  vec2 teamOrg = orbs[0].xy - st;
  for (int i = 0; i < 2; i++) {
    float b = length(st - orbs[i].xy) - 0.1;
    float fi = float(i);
    // b += 0.2 * (fi - 0.3) * -1.;
    // b += voronoi3d(vec3(st * 15., t)).x * 0.2 * (fi - 0.5);
    if (d > b) {
      team = fi;
      teamOrg = orbs[i].xy - st;
    }
    d = smin(d, b, 0.5);
  }
  wd = (sin(d) * 0.5 + 1.0);

  if (d * 100. > 5.) {
    team = 0.;
    wd = 0.;
    color = hsv2rgb(vec3(0.1, 0.1, 0.9));

  } else {
    float hue = (team * 0.3);
    float saturation = 0.7 + sin((d - (t * 0.5) * (team - 0.5)) * 50.) * 0.3;
    float value = 0.5;
    color = hsv2rgb(vec3(hue, saturation, value));

    vec2 rd = vec2(atan(teamOrg.y, teamOrg.x), length(teamOrg) * 10.);
    rd = tile(rd, 0.5);
    rd = rotateTilePattern(rd);
    color = vec3(step(rd.x, rd.y));
  }

  float a = noise3d(vec3(uv * 10., t * 1.1)) * PI * 2.;
  float ps = 2.0;
  vec4 sample = texture2D(
      texture,
      uv + vec2((cos(a) * ps) / resolution.x, (sin(a) * ps) / resolution.y));

  if (abs(st.x) < 0.8 && abs(st.y) < 0.8) {
  } else {
    color = vec3(0.8, 0.8, 0.9);
    if (st.x < (health * 0.8) && st.x > -0.8 && st.y < -0.84 && st.y > -0.96) {
      float hptx = step(fbm3d(vec3(uv * 30., t), 2), 0.0) * 0.1;
      color = hsv2rgb(vec3(0.0, 0.7 + hptx, 0.7));
    }
  }

  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.0;
}
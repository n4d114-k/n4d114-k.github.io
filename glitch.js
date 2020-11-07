const data = {
  font: {
    family: 'Oswald',
    size: 70,
    weight: 'bold'
  },
  colors: ['rgb(248, 225, 0)', 'rgb(232, 0, 137)', 'rgb(0, 170, 234)'],
  text: `LOREM IPSUM DOLOR SIT AMET * CONCECTETUR ADIPISCING ELIT`,
  textlength: 0
}
const canvas = {
  elem: document.querySelector('canvas'),
  init() {
    return this.elem.getContext('2d')
  },
  resize() {
    canvas.elem.width = innerWidth;
    canvas.elem.height = innerHeight;
  }
}
canvas.resize();
const ctx = canvas.init();
const pointer = {
  x: innerWidth/2, y: innerHeight/2,
  r: 220
}
class CHAR {
  constructor(char, x, y, color, layer) {
    this.char = char;
    this.cx = x;
    this.cy = y;
    this.color = color;
    this.layer = layer;
    this.r = 0;
    this.alpha = 0;
    this.dx = this.cx;
    this.dy = this.cy;
  }
  static measuretext(text) {
    return ctx.measureText(text).width;
  }
  static dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }
  static getAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  }
  static init(text, x, y) {
    ctx.font = `${data.font.weight} ${data.font.size}px ${data.font.family}`;
    ctx.textBaseline = 'middle';
    ctx.globalCompositeOperation = 'darken';
    for (let color = 0; color < data.colors.length; color++) {
      let layer = 1;
      switch (color) {
        case 0:
          layer = 0.5;
          break;
        case 1:
          layer = 0.7;
          break;
        case 2:
          layer = 1;
          break;
      }
      const strs = text.split(' * ');
      const textlength = strs.map(str => this.measuretext(str));
      data.textlength = Math.max(...textlength);
      const textheight = this.measuretext('M') * 1.5;
      for (let i = 0; i < strs.length; i++) {
        let ww = 0;
        for (let j = 0; j < strs[i].length; j++) {
          const xx = x - textlength[i] / 2 + ww;
          const yy = i == 0 ? y - textheight / 2 : y + textheight / 2;
          chars.push(new CHAR(strs[i][j], Math.round(xx), Math.round(yy), data.colors[color], layer));
          ww += this.measuretext(strs[i][j]);
        }
      }
    }
  }
  static draw() {
    for (let i = 0; i < data.colors.length; i++) {
      ctx.fillStyle = data.colors[i];
      for (let j = 0; j < chars.length; j++) {
        if (chars[j].color == data.colors[i]) {
          ctx.fillText(chars[j].char, chars[j].dx, chars[j].dy);
        }
      }
    }
  }
  render() {
    this.dx += (this.cx - this.dx) * 0.2;
    this.dy += (this.cy - this.dy) * 0.2;
  }
  update() {
    const dis = CHAR.dist(pointer.x, pointer.y, this.cx, this.cy);
    if (dis < pointer.r) {
      this.alpha = CHAR.getAngle(pointer.x, pointer.y, this.cx, this.cy) + Math.PI;
      this.r = this.layer * dis * (pointer.r - dis) / pointer.r;
      this.dx += (this.cx + this.r * Math.cos(this.alpha) - this.dx) * 0.2;
      this.dy += (this.cy + this.r * Math.sin(this.alpha) - this.dy) * 0.2;
    } else {
      this.render()
    }
  }
}

let chars = [];
CHAR.init(data.text, innerWidth / 2, innerHeight / 2);
setTimeout(() => {
  chars = [];
  CHAR.init(data.text, innerWidth / 2, innerHeight / 2);
}, 10);

window.addEventListener('mousemove', e => {
  pointer.x = e.clientX; pointer.y = e.clientY;
})
window.addEventListener('touchmove', e => {
  e.preventDefault();
  pointer.x = e.targetTouches[0].clientX;
  pointer.y = e.targetTouches[0].clientY;
})
window.addEventListener('resize', () => {
  canvas.resize();
  chars = [];
  CHAR.init(data.text, innerWidth / 2, innerHeight / 2);
})

const run = () => {
  requestAnimationFrame(run);
  ctx.clearRect(innerWidth / 2 - data.textlength, innerHeight / 2 - 0.7 * data.textlength, 2 * data.textlength, 1.4 * data.textlength);
  if (Math.abs(pointer.x - innerWidth / 2) < data.textlength &&
    Math.abs(pointer.y - innerHeight / 2) < 0.7 * data.textlength) {
    chars.forEach(e => e.update())
  } else { chars.forEach(e => e.render()) }
  CHAR.draw();
}
setTimeout(run, 50);

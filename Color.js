const hexReg = /^#([a-fA-F\d]{3}|[a-fA-F\d]{6})$/;
const rgbReg = /^rgb\(\d{1,3}(,\d{1,3}){2}\)$/;

const _hex2Rgb = hex => {
  // pad to six numbers, #fff => #ffffff
  if (hex.length < 7) {
    hex = '#' + hex.slice(1).split('').map(el => el + el).join('');
  }
  const f = n => parseInt('0x' + n);
  return `rgb(${f(hex.slice(1, 3))},${f(hex.slice(3, 5))},${f(hex.slice(5, 7))})`;
}

const _rgb2Hex = (r, g, b) => {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const _toRgbArray = color => {
  // delete spaces
  let colorStr = color.replace(/\s/g, '');

  if (hexReg.test(colorStr)) {
    // HEX, transfrom to rgb
    colorStr = _hex2Rgb(colorStr);
  } else if (rgbReg.test(colorStr)) {
    // RGB, do nothing
  } else {
    console.error('Invalid color!')
    return null;
  }

  // delete extra chars and return an array
  return colorStr.replace(/rgb|rgba|\(|\)/g, '').split(',').map(el => {
    return parseInt(el);
  });
}

/**
 * we usually use calculated color for dynamic styles.
 * In this case, browser will translate Hex color into Rgb one.
 * So, we use rgb-formed color string as a return.
 */
class Color {
  /**
   * @description mix 2 colors into 1
   * @param {string} color rgb or hex form
   * @param {string} color2 rgb or hex form
   * @param {number} percent from 0 to 1
   * @return {string} rgb form
   */
  static mix(color, color2, percent = 0.5) {
    if (percent > 1 || percent < 0) {
      console.error('Invalid perentage!')
      return null;
    }
    const f = _toRgbArray(color);
    const t = _toRgbArray(color2);
    if (!f || !t) return null;

    return (
      'rgb(' +
      Math.round((t[0] - f[0]) * percent + f[0]) +
      ',' +
      Math.round((t[1] - f[1]) * percent + f[1]) +
      ',' +
      Math.round((t[2] - f[2]) * percent + f[2]) +
      ')'
    );
  }

  // get a darker color
  static darker(color, percent = 0.2) {
    return this.mix(color, 'rgb(0, 0, 0)', percent);
  }
  // get a lighter color
  static lighter(color, percent = 0.2) {
    return this.mix(color, 'rgb(255, 255, 255)', percent);
  }

  static hex2Rgb(hex) {
    if (!hexReg.test(hex)) {
      console.error('Invalid HEX!')
      return null;
    }
    return _hex2Rgb(hex);
  }

  static rgb2Hex(rgb) {
    if (!rgbReg.test(rgb)) {
      console.error('Invalid RGB!')
      return null;
    }
    const RGB = rgb.replace(/rgb|rgba|\(|\)/g, '').split(',').map(el => {
      return parseInt(el);
    })
    return _rgb2Hex.apply(null, RGB);
  }
}

// export default Color;
const svgtofont = require('svgtofont');
const path = require('path');

const rootPath = path.resolve(__dirname, '../src');
const FONT_NAME = 'neimsicons';
const CLASS_PREFIX = 'ne';

svgtofont({
  src: path.resolve(rootPath, 'assets/icons'),
  dist: path.resolve(rootPath, `assets/fonts/${FONT_NAME}`),
  styleTemplates: path.resolve(__dirname, 'templates'),
  fontName: FONT_NAME,
  classNamePrefix: CLASS_PREFIX,
  css: true,
  emptyDist: true,
  svgicons2svgfont: {
    fontHeight: 1000,
    normalize: true,
  },
}).then(() => {
  console.log('Done');
});

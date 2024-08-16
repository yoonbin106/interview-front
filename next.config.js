// next.config.js
const path = require('path');

module.exports = {
  reactStrictMode: false,
  pageExtensions: ['jsx', 'js'], // 사용할 파일 확장자 설정
  webpack(config) {
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    return config;
  }
};
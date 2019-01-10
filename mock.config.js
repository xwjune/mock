/**
 * mock配置文件
 */
const path = require('path');
const fs = require('fs');

const mock = {};
fs.readdirSync(path.join(`${__dirname}/services`)).forEach((file) => {
  Object.assign(mock, require(`./services/${file}`));
})
module.exports = mock;

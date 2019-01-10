const networkInterfaces = require('os').networkInterfaces();
const express = require('express');
// body-parser中间件来解析请求体
const bodyParser = require('body-parser');
const chalk = require('chalk');
// 模拟数据
const mockData = require('./mock.config');

const app = express();
const port = process.env.port || 3000;
const allowCrossDomain = (req, res, next) => {
  // 设置允许跨域的域名，*代表允许任意域名跨域
  res.header('Access-Control-Allow-Origin', '*');
  // 设置跨域允许包含的请求头
  res.header('Access-Control-Allow-Headers', '*');
  next();
};

// 运用跨域的中间件
app.use(allowCrossDomain);
// for parsing application/json
app.use(bodyParser.json());
app.listen(port, () => {
  const lanUrlForTerminal = getIPAdress();
  const logs = [
    `> @ start ${__dirname}`,
    `${chalk.default.green('Start successfully!\n')}`,
    '  App running at:',
    `  - Local:   ${chalk.cyan(`http://localhost:${port}`)}`,
    `  - Network: ${chalk.cyan(`http://${lanUrlForTerminal}:${port}`)}`,
  ];
  console.log(logs.join('\n'));
});

/* ---------- 通用API ----------*/
app.post('/api/local/success', (_, res) => {
  res.send({
    code: '200',
    data: '成功',
  });
});

app.post('/api/local/error', (_, res) => {
  res.send({
    code: '500',
    message: '请求失败',
  });
});

/* ---------- 业务API ----------*/
Object.keys(mockData).forEach((key) => {
  const [type, api] = key.split(' ');
  if (type === 'POST') {
    app.post(api, mockData[key]);
  } else if (type === 'GET') {
    app.get(api, mockData[key]);
  }
});

// 获取本地ip地址
function getIPAdress () {
  for (const devName in networkInterfaces) {
    const iface = networkInterfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (
        alias.family === 'IPv4'
        && alias.address !== '127.0.0.1'
        && !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}


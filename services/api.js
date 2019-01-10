/**
 * 模拟数据
 */
const mockjs = require('mockjs');

module.exports = {
  'GET /api/local/test': (_, res) => {
    res.send(mockjs.mock({
      code: '200',
      data: {
        id: '@guid',
        date: '@now',
      }
    }));
  },
};

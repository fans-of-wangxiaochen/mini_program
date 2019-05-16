// 云函数入口文件
const cloud = require('wx-server-sdk');
const ai = require('baidu-aip-sdk');
const fs = require('fs');

cloud.init({
  env: 'test-f77484',
});

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }

  var APP_ID = process.env.APPID;
  var API_KEY = process.env.APIKEY;
  var SECRET_KEY = process.env.SECRETKEY;

  // 新建一个对象，建议只保存一个对象调用服务接口
  var client = new ai.bodyanalysis(APP_ID, API_KEY, SECRET_KEY);

  data = event.base64data;

  try {
    result = await client.bodySeg(data);
    data = result.foreground;
  } catch (e) {
    reject('e');
  }

  // let result = await new Promise(resolve => {
  //   fs.writeFile('/tmp/demo.txt', data, () => {
  //     resolve();
  //   });
  // });

  fs.writeFileSync('/tmp/demo.txt', data);

  const fileStream = fs.createReadStream('/tmp/demo.txt');

  let cloudPath = new Date().getTime() + '.txt';

  await cloud.uploadFile({
    cloudPath: 'tmp/' + cloudPath,
    fileContent: fileStream,
  });

  return cloudPath;
};

const AV = require('leanengine')
const fs = require('fs')
const path = require('path')
const axios = require('axios').default

/**
 * Loads all cloud functions under the `functions` directory.
 */
fs.readdirSync(path.join(__dirname, 'functions')).forEach(file => {
  require(path.join(__dirname, 'functions', file))
})

function checkAttendance({ cookie }) {
  const method = 'callService';
  const serviceName = 'getManagerConfigService';
  const belongElement = 'month-attendence';
  const url = `https://hr.goldentec.com/shr/shr/msf/service.do?method=${method}&serviceName=${serviceName}&belongElement=${belongElement}`;
  console.log(url)
  return axios.post(url, null, {
    headers: {
      cookie,
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

function sendMessage(content) {
  axios.post(`https://sctapi.ftqq.com/xxx.send`, {
    title: content
  }, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

/**
 * A simple cloud function.
 */
AV.Cloud.define('CheckAttendance', async function (request) {
  const { cookie } = request.params;
  const content = await checkAttendance({ cookie });
  const { result } = content.data;
  let message = '考勤检查通知：cookie已失效，请及时更新'
  if (result) {
    message = `考勤检查通知：${result.exception > 0 ? `${result.exception}次异常` : `正常`}`;
    sendMessage(message)
  } else {
    sendMessage(message)
  }
  return message;
})

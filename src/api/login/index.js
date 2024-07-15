import request from '@/utils/request'

// 获取图形验证码
export const getPicCode = () => {
  return request.get('/captcha/image', { platform: 'H5' })
}

// 获取短信验证码
export const getMsgCode = (captchaCode, captchaKey, mobile) => {
  return request.post('/captcha/sendSmsCaptcha', {
    form: {
      captchaCode,
      captchaKey,
      mobile
    }
  })
}

// 验证验证码登录
export const loginVerify = (smsCode, mobile) => {
  const data = {
    form: {
      smsCode: smsCode,
      mobile: mobile,
      isParty: false,
      partyData: {}
    }
  }
  const options = {
    method: 'POST',
    url: '/passport/login',
    data: data
  }

  return request(options)
  // var data = {
  //   form: {
  //     smsCode: smsCode,
  //     mobile: mobile,
  //     isParty: false,
  //     partyData: {}
  //   }
  // }

  // var config = {
  //   method: 'post',
  //   url: 'http://smart-shop.itheima.net/index.php?s=/api/passport/login',
  //   headers: {
  //     platform: 'H5'
  //   },
  //   data: data
  // }

  // return request(config)
}

<template>
  <div class="login-page">
    <!-- 上导航栏 -->
    <van-nav-bar title="会员登录" left-arrow @click-left="onClickLeft" />
    <!-- 登录部分 -->
    <div class="container">
      <h1>手机号登录</h1>
      <h3>未注册的手机号登录后将自动注册</h3>
      <div>
        <input type="text" v-model="in_mobile" placeholder="请输入手机号码" />
      </div>
      <div>
        <input
          type="text"
          v-model="in_picCode"
          placeholder="请输入图形验证码"
        />
        <img v-if="pic" :src="pic" alt="" @click="getPicCode()" />{{ pic }}
      </div>
      <div>
        <input
          type="text"
          v-model="in_msgCode"
          placeholder="请输入短信验证码"
        />
        <button class="getmsgBtn" @click="getMsgCode">
          {{ timer === null ? '获取验证码' : '请查收(' + count + ')' }}
        </button>
      </div>
      <button class="login-btn" @click="login">登录</button>
    </div>
  </div>
</template>

<script>
import { getPicCode, getMsgCode, loginVerify } from '@/api/login'
export default {
  name: 'loginIndex',
  data() {
    return {
      //数据绑定部分
      in_mobile: '17700215825',
      in_picCode: 'ztp3',
      in_msgCode: '246810',
      //图形验证码相关
      pic: '', //图形码
      picKey: '', //图片key
      //倒计时显示
      totalcount: 3,
      count: 3,
      timer: null
    }
  },
  async created() {
    this.getPicCode()
    console.log(this.forwardUrl)
  },
  computed: {
    forwardUrl() {
      return this.$route.query.forwardUrl
    }
  },
  methods: {
    //获取图片验证码
    async getPicCode() {
      const {
        data: { base64, key }
      } = await getPicCode()
      this.pic = base64
      this.picKey = key
    },
    //获取短信验证码
    async getMsgCode() {
      //都有正确输入才发起验证码请求
      if (this.testInput()) {
        //如果当前没有定时器
        if (!this.timer) {
          //开启定时器
          // console.log('开启了一个定时器')
          this.timer = setInterval(() => {
            console.log(this.count)
            if (this.count > 0) {
              this.count--
            } else {
              clearInterval(this.timer)
              this.timer = null
              this.count = this.totalcount
            }
          }, 1000)
          console.log('现在发送请求')
          await getMsgCode(this.in_picCode, this.picKey, this.in_mobile)
          this.$toast('短信已发送，注意查收')
        }
      }
    },
    //登录
    async login() {
      if (!/^\d{6}$/.test(this.in_msgCode)) {
        this.$toast('验证码有误')
        return
      } else if (this.testInput()) {
        const res = await loginVerify(this.in_msgCode, this.in_mobile)
        console.log('登录')
        console.log(res)
        this.$store.commit('user/setUserInfo', res.data)
        const url = this.forwardUrl || '/home'
        this.$router.push(url)
      }
    },
    testInput() {
      if (!/^1[3-9]\d{9}$/.test(this.in_mobile)) {
        this.$toast('请输入正确的手机号')
        return false
      } else if (/^w{4}$/g.test(this.in_picCode)) {
        this.$toast('请输入正确的图形验证码')
      }
      return true
    },
    onClickLeft() {
      if (this.forwardUrl === '/cart') {
        this.$router.push('/')
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 400px;
  width: 300px;
  // background-color: red;
  margin: 40px auto;
  h1 {
    font-size: 30px;
    font-weight: normal;
  }
  h3 {
    font-size: 14px;
    color: gray;
    font-weight: lighter;
    margin-bottom: 20px;
  }
  div {
    // background-color: skyblue;
    height: 40px;
    margin: 20px 0px;
    border-bottom: 1px solid gray;
    font-size: 0;
    div::after {
      content: '';
      display: block;
      clear: both;
    }
    input {
      height: 30px;
      width: 200px;
      font-size: 16px;
      vertical-align: middle;
      border: 0px;
      float: left;
    }
    img {
      height: 30px;
      width: 100px;
      vertical-align: middle;
      float: right;
    }
    button {
      height: 30px;
      width: 100px;
      font-size: 12px;
      color: orange;
      background-color: transparent;
      border: 0px;
      vertical-align: middle;
      float: right;
    }
  }
  .login-btn {
    width: 300px;
    height: 50px;
    border: 0px;
    background: linear-gradient(to right, rgb(237, 206, 8), orange);
    color: white;
    font-size: 16px;
    border-radius: 30px;
  }
}
</style>

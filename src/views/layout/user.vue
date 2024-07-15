<template>
  <div class="user">
    <div class="user-card info">
      <div class="protrait" @click="ToLogin"></div>
      <div class="NamePhone" @click="ToLogin">
        <span>{{ ifLogin ? userInfo.nick_name : '未登录' }}</span>
        <span>{{ ifLogin ? userInfo.mobile : '***********' }}</span>
      </div>
    </div>
    <div class="user-pay info" @click="ToLogin">
      <div class="balance UpDown">
        <span class="red">{{ ifLogin ? userInfo.balance : 0 }}</span>
        <span>账户余额</span>
      </div>
      <div class="integral UpDown">
        <span class="red">{{ ifLogin ? userInfo.points : 0 }}</span>
        <span>积分</span>
      </div>
      <div class="discounts UpDown">
        <span class="red">0</span>
        <span>优惠券</span>
      </div>
      <div class="wallet UpDown">
        <van-icon name="pending-payment " />
        <span>我的钱包</span>
      </div>
    </div>
    <div class="user-order info" @click="ToLogin">
      <div class="UpDown" @click="myorderTo('all')">
        <van-icon name="orders-o" />
        <span>全部订单</span>
      </div>
      <div class="UpDown" @click="myorderTo('payment')">
        <van-icon name="balance-o" />
        <span>待支付</span>
      </div>
      <div class="UpDown" @click="myorderTo('delivery')">
        <van-icon name="logistics" />
        <span>待发货</span>
      </div>
      <div class="UpDown" @click="myorderTo('received')">
        <van-icon name="sign" />
        <span>待收货</span>
      </div>
    </div>
    <div class="user-serve info">
      <div class="title">
        <span>我的服务</span>
      </div>
      <div class="serveList" @click="ToLogin">
        <div class="serve-item" @click="$router.push('/address')">
          <van-icon name="location-o" />
          <span>收货地址</span>
        </div>
        <div class="serve-item">
          <van-icon name="point-gift-o" />
          <span>领券中心</span>
        </div>
        <div class="serve-item">
          <van-icon name="gift-card-o" />
          <span>优惠券</span>
        </div>
        <div class="serve-item">
          <van-icon name="question-o" />
          <span>我的帮助</span>
        </div>
        <div class="serve-item">
          <van-icon name="award-o" />
          <span>我的积分</span>
        </div>
        <div class="serve-item">
          <van-icon name="refund-o" />
          <span>退换/售后</span>
        </div>
      </div>
    </div>
    <div class="logout info" v-if="ifLogin">
      <button class="logoutBtn" @click="logout">退出登录</button>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/user'
export default {
  name: 'userIndex',
  data() {
    return {
      userInfo: {}
    }
  },
  methods: {
    async getUserInfo() {
      const result = await getUserInfo()
      this.userInfo = result.data.userInfo
      console.log('userInfo')
      console.log(this.userInfo)
    },
    logout() {
      this.$dialog
        .confirm({
          title: '温馨提示',
          message: '你确认要退出么？'
        })
        .then(() => {
          this.$store.dispatch('user/logout')

          // this.$router.push(`/user`)
        })
        .catch(() => {})
    },
    myorderTo(type) {
      if (this.ifLogin) this.$router.push(`/myorder/${type}`)
    },
    ToLogin() {
      if (this.ifLogin) return
      //如果登录了
      this.$router.push(`/login?forwardUrl=user`)
    }
  },
  computed: {
    ifLogin() {
      console.log('Token:')
      console.log(this.$store.getters.token)
      return this.$store.getters.token
    }
  },
  watch: {
    token(newToken) {
      console.log(newToken)
    }
  },
  mounted() {},
  async created() {
    //如果有登录了，就渲染个人信息
    if (this.$store.getters.token) {
      this.getUserInfo()

      this.testV += 1
    }
  }
}
</script>

<style lang="less" scoped>
.user {
  background-color: #fafafa;
  min-height: 700px;
  overflow: auto;
  .user-card {
    height: 120px;
    width: 375px;
    padding: 20px;
    background:
      url('https://smart-shop.itheima.net/static/background/user-header2.png')
        0px 0px / 375px,
      120px;
    display: flex;
    align-items: center;
    .protrait {
      height: 60px;
      width: 60px;
      border-radius: 30px;
      background: url('@/assets/default-avatar.png') 0px 0px / 60px;
    }
    .NamePhone {
      margin-left: 10px;
      height: 40px;
      display: flex;
      flex-direction: column;
      font-size: 20px;
      color: #ca9f4b;
      font-weight: bolder;
      span:last-child {
        font-size: 16px;
        font-weight: normal;
      }
    }
  }
  .user-pay {
    background-color: #fff;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: lighter;
    // background-color: skyblue;
    .UpDown {
      display: flex;
      flex-direction: column;
      align-items: center;
      span:last-child {
        margin-top: 5px;
      }
    }
    .red {
      color: red;
      font-weight: normal;
    }
    .wallet {
      .van-icon {
        font-size: 24px;
      }
    }
  }
  .user-order {
    width: 360px;
    margin: 10px auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    box-shadow: 1px 1px 1px rgb(227, 226, 226);
    border-radius: 5px;
    div {
      height: 90px;
      width: 90px;
      // background-color: skyblue;
      .van-icon {
        font-size: 24px;
      }
      span {
        margin-top: 5px;
      }
    }
    .UpDown {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
  .user-serve {
    width: 360px;
    margin: 20px auto;
    background-color: #fff;
    box-shadow: 1px 1px 1px rgb(227, 226, 226);
    border-radius: 5px;
    overflow: hidden;
    .title {
      margin: 10px;
    }
    .serveList {
      .serve-item {
        height: 90px;
        width: 90px;
        float: left;
        // background-color: skyblue;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .van-icon {
          font-size: 24px;
          color: red;
        }
        span {
          margin-top: 5px;
        }
      }
    }
    .serveList:after {
      content: '';
      display: block;
      clear: both;
    }
  }
  .logout {
    height: 40px;
    width: 200px;
    margin: 30px auto;
    border-radius: 10px;
    border: 1px solid rgb(194, 192, 192);
    .logoutBtn {
      border: 0;
      background: transparent;
      height: 100%;
      width: 100%;
    }
  }
}
</style>

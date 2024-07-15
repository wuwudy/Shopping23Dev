<template>
  <div class="layout-page">
    <router-view></router-view>
    <van-tabbar
      route
      v-model="active"
      active-color="#ee0a24"
      inactive-color="#000"
      class="navs-bottom-layout"
    >
      <van-tabbar-item class="nav-item" to="/home" icon="wap-home-o"
        >首页</van-tabbar-item
      >
      <van-tabbar-item class="nav-item" to="/categroy" icon="list-switch"
        >分类</van-tabbar-item
      >
      <van-tabbar-item
        class="nav-item"
        to="/cart"
        icon="cart-o"
        :badge="this.$store.state.cart.cartTotal"
        >购物车</van-tabbar-item
      >
      <van-tabbar-item class="nav-item" to="/user" icon="user-o"
        >我的</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  data() {
    return {
      active: 0
    }
  },
  async created() {
    if (this.$store.getters.token) {
      await this.$store.dispatch('cart/getCartTotal')
    }
  }
}
</script>

<style lang="less" scoped>
.layout-page {
  .van-tabber-item {
    font-size: 16px;
  }
}
</style>

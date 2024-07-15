<template>
  <div class="comment">
    <van-nav-bar title="所有评论" left-arrow @click-left="$router.back()" />
    <van-tabs v-model="active">
      <van-tab title="全部" name="-1"></van-tab>
      <van-tab title="好评" name="10"></van-tab>
      <van-tab title="中评" name="20"></van-tab>
      <van-tab title="差评" name="30"></van-tab>
    </van-tabs>
    <div class="content">
      <div class="commentsList"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'commentIndex',
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped></style>

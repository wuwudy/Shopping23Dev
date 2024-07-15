<template>
  <van-card
    v-if="item.goods_id"
    :price="item.goods_price_min"
    :desc="`已售${item.goods_sales}件`"
    :title="item.goods_name"
    :thumb="item.goods_image"
    :origin-price="item.line_price_max"
    @click="$router.push(`/prodetail/${item.goods_id}`)"
  />
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style>
.van-card {
  margin: 5px 0px;
}
</style>

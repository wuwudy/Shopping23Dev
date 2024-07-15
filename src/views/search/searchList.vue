<template>
  <div>
    <van-nav-bar
      title="商品列表"
      left-arrow
      @click-left="$router.go(-1)"
    ></van-nav-bar>
    <van-search
      :placeholder="searchKey || '搜素商品'"
      input-align="center"
      show-action
    >
      <template #action>
        <van-icon class="tool" name="apps-o" />
      </template>
    </van-search>
    <div class="topNav3">
      <div class="nav3item">综合</div>
      <div class="nav3item">销量</div>
      <div class="nav3item">价格</div>
    </div>
    <ul>
      <GoodsItem
        v-for="item in searchReslut"
        :key="item.goods_id"
        :item="item"
      ></GoodsItem>
    </ul>
  </div>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
import { searchPro } from '@/api/product'
export default {
  name: 'searchList',
  components: {
    GoodsItem
  },
  data() {
    return {
      page: 1,
      searchReslut: []
    }
  },
  async created() {
    // console.log(this.searchKey)
    const res = await this.searchGoods()
    this.searchReslut = res.data.list.data
    console.log(res)
    console.log(this.searchReslut)
  },
  methods: {
    searchGoods() {
      return searchPro({
        goodsName: this.searchKey,
        page: this.page,
        categoryId: this.searchId
      })
    }
  },
  computed: {
    searchKey() {
      return this.$route.query.searchkey
    },
    searchId() {
      return this.$route.query.id
    }
  }
}
</script>

<style scoped lang="less">
.tool {
  font-size: 24px;
  height: 40px;
  line-height: 40px;
}
.topNav3 {
  width: 375px;
  display: flex;

  .nav3item {
    font-size: 14px;
    text-align: center;
    flex: 1 1 0;
  }
}
</style>

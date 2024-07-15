<template>
  <div>
    <!-- 标题 -->
    <van-nav-bar title="智慧商城"></van-nav-bar>
    <!-- 搜索 -->
    <!-- 注册回车事件 -->
    <van-search
      v-model="searchKey"
      input-align="center"
      placeholder="点击搜索"
      @click="$router.push('/search')"
    />
    <!-- 轮播图推荐 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="pic in ReqSwipe" :key="pic.imgUrl">
        <img v-lazy="pic.imgUrl" />
      </van-swipe-item>
    </van-swipe>
    <!-- 分类导航 -->
    <van-grid :column-num="5">
      <van-grid-item
        v-for="nav in ReqItemNav"
        :key="nav.imgUrl"
        :icon="nav.imgUrl"
        :text="nav.text"
      />
    </van-grid>
    <!-- 活动 -->
    <img class="activePic" :src="ReqAdPicUrl" />
    <!-- 商品展示 -->
    <span>———猜你喜欢———</span>
    <ul class="goods-list">
      <li v-for="item in ReqGoodsItems" :key="item.goods_id">
        <GoodsItem :item="item"></GoodsItem>
      </li>
    </ul>
  </div>
</template>

<script>
import GoodsItem from '@/components/GoodsItem'
import request from '@/utils/request'
export default {
  name: 'homeIndex',
  components: {
    GoodsItem
  },
  data() {
    return {
      ReqSearch: {},
      ReqSwipe: [],
      ReqItemNav: [],
      ReqAdPicUrl: '',
      ReqGoodsItems: [],
      ReqPageSet: {},
      searchKey: ''
    }
  },
  async created() {
    const {
      data: { pageData }
    } = await this.getPageInfo()

    this.ReqSearch = pageData.items[0]
    this.ReqSwipe = pageData.items[1].data
    this.ReqItemNav = pageData.items[3].data
    this.ReqAdPicUrl = pageData.items[4].data[0].imgUrl
    this.ReqGoodsItems = pageData.items[6].data
    this.ReqPageSet = pageData.page
    // console.log(pageData)
  },
  methods: {
    //获取页面数据
    getPageInfo() {
      return request.get('/page/detail', { pageId: 0 })
    }
  }
}
</script>

<style lang="less" scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  height: 170px;
  img {
    width: 375px;
    height: 170px;
  }
}
span {
  display: block;
  width: 375px;
  text-align: center;
  font-size: 12px;
}
.activePic {
  margin: 10px 0px;
  width: 375px;
}
.goods-list {
  margin-bottom: 50px;
}
</style>

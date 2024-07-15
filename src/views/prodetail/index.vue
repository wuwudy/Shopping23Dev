<template>
  <div class="prodetail">
    <van-nav-bar
      class="test1"
      title="商品详情"
      left-arrow
      @click-left="$router.go(-1)"
      fixed
      placeholder
    ></van-nav-bar>
    <!-- 手动轮播图 -->
    <div class="picShow">
      <van-swipe @change="onChange" :loop="false">
        <van-swipe-item v-for="pic in showPics" :key="pic.file_id">
          <img :src="pic.external_url" />
        </van-swipe-item>
        <template #indicator>
          <div v-if="showPics" class="custom-indicator">
            {{ currentPic + 1 }}/{{ showPics.length }}
          </div>
        </template>
      </van-swipe>
    </div>
    <div class="goodsDetail">
      <div>
        <div class="priceAndsales">
          <div>
            <span class="current-price">￥{{ goodsInfo.goods_price_max }}</span>
            <span class="original-price">￥{{ goodsInfo.line_price_max }}</span>
          </div>
          <span class="goods-sales">已售{{ goodsInfo.goods_sales }}</span>
        </div>
        <div class="name">
          <span class="goods-name text-ellipsis-2">{{
            goodsInfo.goods_name
          }}</span>
        </div>
      </div>
    </div>
    <div class="serves" v-if="serviceList.length > 0">
      <div v-for="i in 2" :key="i" class="oneserve">
        <van-icon name="passed" />
        <span>{{ serviceList[i - 1].name }}</span>
      </div>
      <span class="arrows" @click="serveSheetShow = true">
        共{{ serviceList.length }}项
        <van-icon name="arrow" />
      </span>
    </div>
    <div class="comments">
      <div class="comTop">
        <span>商品评论({{ commentsCount }}条)</span>
        <span @click="$router.push(`/comment?id=${goodsId}&type=-1`)"
          >查看更多<van-icon name="arrow"
        /></span>
      </div>
      <commentsList
        :comments="comments"
        :commentsScores="commentsScores"
      ></commentsList>
    </div>
    <div class="prodescribe">
      <span>商品描述</span>
      <img
        v-for="item in showPics"
        :key="item.file_id"
        :src="item.external_url"
      />
    </div>
    <div class="Footer">
      <div class="toHome UpAndDown">
        <van-icon name="wap-home-o" />
        <span>主页</span>
      </div>
      <div class="toCart UpAndDown">
        <van-icon name="shopping-cart-o" />
        <span>购物车</span>
      </div>
      <button
        class="addCart"
        @click="
          sheetShow = true
          isAddToCart = true
        "
      >
        加入购物车
      </button>
      <button
        class="buy"
        @click="
          sheetShow = true
          isAddToCart = false
        "
      >
        立即购买
      </button>
    </div>

    <!-- 所有服务面板 -->
    <div class="ServeSheet">
      <van-action-sheet
        v-model="serveSheetShow"
        :actions="actions"
        description="所有服务"
        close-on-click-action
      />
    </div>

    <div class="CartSheet">
      <!-- 加入购物车和立即购买动作面板 -->
      <van-action-sheet
        v-model="sheetShow"
        :title="sheetTitle"
        :cancel-text="sheetCancle"
        :closeable="false"
        @cancel="CartOrPay"
      >
        <div class="content">
          <div class="buyGoodsInfo">
            <img :src="goodsInfo.goods_image" />
            <div>
              <span class="price">￥{{ goodsInfo.goods_price_min }}</span>
              <span class="allMounts">库存:{{ goodsInfo.stock_total }}</span>
            </div>
          </div>
          <div class="buyCounts">
            <span>数量</span>
            <div>
              <CountBox
                :value="buyCounts"
                @add="addBuyCounts"
                @sub="subBuyCounts"
              ></CountBox>
            </div>
          </div>
        </div>
      </van-action-sheet>
    </div>
  </div>
</template>

<script>
import {
  searchGoods,
  getGoodsComment,
  getGoodsCommentCount,
  getGoodsService
} from '@/api/product'
import { addCart } from '@/api/cart'
import CountBox from '@/components/CountBox.vue'
import CommentsList from '@/components/CommentsList'
export default {
  name: 'prodetailIndex',
  components: {
    CountBox,
    CommentsList
  },
  data() {
    return {
      isAddToCart: true,
      sheetShow: false,
      serveSheetShow: false,
      i: 0,
      tmpRateValue: 5,
      currentPic: 0,
      goodsInfo: {},
      showPics: [],
      buyCounts: 1,
      serviceList: [],
      comments: [],
      commentsCount: 0,
      commentsScores: []
    }
  },
  computed: {
    goodsId() {
      return this.$route.params.id
    },
    sheetTitle() {
      if (this.isAddToCart) return '购物车'
      else return '购买'
    },
    sheetCancle() {
      if (this.goodsInfo.stock_total === 0) return '商品已售罄'
      if (this.isAddToCart) return '加入购物车'
      else return '立即购买'
    },
    actions() {
      return this.serviceList.map(item => {
        return {
          name: item.name,
          subname: item.summary,
          color: '#ff5d33'
        }
      })
    }
  },
  async created() {
    //获取商品信息
    await this.getGoodsInfo()
    //获取商品服务
    await this.setServiceList()
    //获取评论总数
    await this.setCommentsCount()
    //获取两条评论
    await this.setComments()
    //处理评论分数
    this.handleCommentsScores()
  },
  methods: {
    onChange(index) {
      this.currentPic = index
    },
    async getGoodsInfo() {
      // console.log('goodsId:')
      // console.log(this.goodsId)
      const res = await searchGoods(this.goodsId)
      this.goodsInfo = res.data.detail
      this.showPics = this.goodsInfo.goods_images
      console.log('goodsInfo:')
      console.log(this.goodsInfo)
    },
    //设置商品服务
    async setServiceList() {
      const {
        data: { list }
      } = await getGoodsService(this.goodsId)
      this.serviceList = list
      console.log(this.serviceList)
    },
    //设置评论总数
    async setCommentsCount() {
      const {
        data: {
          total: { all }
        }
      } = await getGoodsCommentCount(this.goodsId)
      this.commentsCount = all
    },
    //设置展示的评论
    async setComments() {
      const {
        data: { list }
      } = await getGoodsComment(this.goodsId, 2)
      this.comments = list
    },
    //处理评价星级
    handleCommentsScores() {
      this.commentsScores = this.comments.map(item => {
        console.log(item.score)
        switch (item.score) {
          case 10:
            return 5
          case 20:
            return 3
          case 30:
            return 1
          default:
            return 0
        }
      })
    },
    //加入购物车或是立即购买逻辑
    CartOrPay() {
      if (this.goodsInfo.stock_total === 0) {
        this.$toast('商品没有啦！')
        this.sheetShow = false
        return
      }
      // 验证登录
      if (!this.$store.getters.token) {
        this.$dialog
          .confirm({
            message: '您还没有登录哦~',
            confirmButtonText: '去登录',
            cancelButtonText: '确定'
          })
          .then(() => {
            // 去登录
            this.$router.replace({
              path: `/login?forwardUrl=${this.$route.fullPath}`
            })
          })
          .catch(() => {
            // 取消
          })
      }
      //加入购物车
      if (this.isAddToCart) {
        addCart(this.goodsInfo.goods_id, this.buyCounts)
        this.$toast('已加入购物车')
        console.log('success')
        this.sheetShow = false
      }
      //立即购买
      else {
        this.$router.push({
          path: '/pay',
          query: {
            mode: 'buyNow',
            goodsInfo: {
              goodsId: this.goodsInfo.goods_id,
              goodsNum: this.buyCounts,
              goodsSkuId: 0
            }
          }
        })
      }
    },
    subBuyCounts() {
      this.buyCounts--
    },
    addBuyCounts() {
      this.buyCounts++
    }
  }
}
</script>

<style lang="less" scoped>
.prodetail {
  // margin: 0;
  // padding: 0;
  // position: relative;
  background-color: #fafafa;
  .picShow {
    height: 375px;
    width: 375px;
    margin-top: 5px;
    .custom-indicator {
      position: absolute;
      right: 5px;
      bottom: 0px;
      border-radius: 5px;
      padding: 2px 5px;
      font-size: 12px;
      background: rgba(0, 0, 0, 0.1);
    }
    img {
      width: 375px;
      height: 375px;
    }
  }
  .goodsDetail {
    background-color: #ffffff;
    margin-top: 20px;
    .priceAndsales {
      padding: 10px;
      display: flex;
      justify-content: space-between;
      span {
        display: inline-block;
      }
      .current-price {
        font-size: 24px;
        color: red;
      }
      .current-price::first-letter {
        font-size: 16px;
      }
      .original-price {
        font-size: 16px;
        color: #acacac;
        text-decoration-line: line-through;
        text-decoration-style: solid;
        text-decoration-color: #acacac;
      }
      .goods-sales {
        font-size: 16px;
        color: #acacac;
        position: relative;
        top: 5px;
      }
    }
    .name {
      padding: 0px 10px;
      .goods-name {
        line-height: 20px;
        font-size: 16px;
      }
    }
  }
  .serves::after {
    content: '';
    display: block;
    clear: both;
  }
  .serves {
    height: 50px;
    line-height: 50px;
    background-color: #fafafa;
    .oneserve {
      margin-left: 10px;
      color: red;
      float: left;
      font-size: 14px;
      span {
        margin-left: 5px;
        color: black;
      }
    }
    .arrows {
      float: right;
      margin-right: 5px;
    }
  }
  .comments {
    padding: 10px;
    background-color: #ffffff;
    .comTop::after {
      content: '';
      display: block;
      clear: both;
    }
    .comTop {
      span:first-child {
        font-size: 16px;
        float: left;
      }
      span:last-child {
        float: right;
        font-size: 16px;
        .van-icon {
          vertical-align: baseline;
        }
      }
    }
  }

  .prodescribe {
    margin-top: 10px;
    margin-bottom: 50px;
    background-color: #ffffff;
    span {
      margin-left: 10px;
      font-size: 16px;
    }
    img {
      width: 375px;
    }
  }
  .Footer {
    width: 375px;
    height: 50px;
    box-shadow: 0px 0px 5px gray;
    background-color: #ffffff;
    padding: 20px;
    position: fixed;
    bottom: 0px;
    left: 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .UpAndDown {
      display: flex;
      flex-direction: column;
      align-items: center;
      .van-icon {
        font-size: 20px;
      }
      span {
        font-size: 16px;
      }
    }
    button {
      height: 30px;
      width: 80px;
      border: 0;
      border-radius: 15px;
      font-size: 14px;
      color: white;
      background-image: linear-gradient(
        to right,
        #ffb800 30px,
        rgb(224, 213, 110) 80px
      );
    }
    .buy {
      background-image: linear-gradient(
        to right,
        #ff5d33 30px,
        rgb(245, 127, 127) 80px
      );
    }
  }
  .ServeSheet {
    .van-action-sheet__name {
      color: #ff5d33;
      font-weight: normal;
    }
    .van-action-sheet__subname {
      color: rgb(64, 27, 27);
    }
  }
  .CartSheet {
    .content {
      height: 150px;
      width: 375px;
      background-color: #ffffff;
      padding: 10px;
      .buyGoodsInfo {
        display: flex;
        img {
          width: 100px;
          height: 100px;
        }
        div {
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          .price {
            color: red;
            font-size: 30px;
          }
          .price::first-letter {
            font-size: 16px;
          }
          .allMounts {
            margin-left: 10px;
            color: #acacac;
            font-size: 16px;
          }
        }
      }
      .buyCounts {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        span {
          font-size: 16px;
        }
        div {
          font-size: 16px;
        }
      }
    }
  }
}
</style>

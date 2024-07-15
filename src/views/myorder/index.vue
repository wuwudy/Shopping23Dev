<template>
  <div class="myorder">
    <van-nav-bar
      title="我的订单"
      left-arrow
      @click-left="$router.go(-1)"
    ></van-nav-bar>
    <div class="content">
      <van-tabs v-model="active">
        <van-tab name="all" title="全部"></van-tab>
        <van-tab name="payment" title="待支付"></van-tab>
        <van-tab name="delivery" title="待发货"></van-tab>
        <van-tab name="received" title="待收货"></van-tab>
        <van-tab name="comment" title="待评价"></van-tab>
      </van-tabs>
      <div class="orderList" v-if="orderList.data.length !== 0">
        <div
          class="orderList-item"
          v-for="item in orderList.data"
          :key="item.order_id"
        >
          <div class="oL-item-top">
            <div class="time">
              <span>{{ item.create_time }}</span>
            </div>
            <div class="state">
              <span>{{ item.state_text }}</span>
            </div>
          </div>
          <div class="oL-item-main">
            <div
              class="goods-item"
              v-for="goods in item.goods"
              :key="goods.goods_id"
            >
              <div class="goodsImg">
                <img :src="goods.goods_image" />
              </div>
              <div class="goodsName">
                <span class="text-ellipsis-2">{{ goods.goods_name }}</span>
              </div>
              <div class="goodsPriceNum">
                <span>￥{{ goods.goods_price }}</span>
                <span>X{{ goods.total_num }}</span>
              </div>
            </div>
          </div>
          <div class="oL-item-footer">
            <div class="total clear">
              <span class="right"
                >共{{ item.goods.length }}件商品，总金额￥{{
                  item.pay_price
                }}</span
              >
            </div>
            <div class="operate clear">
              <button class="right">申请取消</button>
            </div>
          </div>
        </div>
      </div>
      <div class="none" v-else>
        <span>这里是空的哦~</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrderList } from '@/api/order'
export default {
  name: 'myorderIndex',
  data() {
    return {
      active: this.$route.params.dataType || 'all',
      orderList: {}
    }
  },
  created() {},
  methods: {
    async getOrderList() {
      const { data } = await getOrderList(this.active)
      this.orderList = data.list
      console.log(this.orderList)
    }
  },
  watch: {
    active: {
      immediate: true,
      handler() {
        this.getOrderList()
      }
    }
  },
  computed: {}
}
</script>

<style lang="less" scoped>
.myorder {
  .van-nav-bar {
    height: 50px;
  }
  .content {
    .orderList {
      font-size: 14px;
      background-color: #fafafa;
      min-height: 520px;
      padding: 20px 10px;
      .orderList-item {
        margin-top: 10px;
        width: 355px;
        padding: 10px;
        box-shadow: 1px 1px 1px rgb(238, 234, 234);
        background-color: white;
        border-radius: 10px;
        .oL-item-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          .state {
            color: red;
          }
        }
        .oL-item-main {
          .goods-item {
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            .goodsImg {
              img {
                width: 80px;
                height: 80px;
              }
            }
            .goodsName {
              // font-size: 12px;
              height: 40px;
              width: 160px;
            }
            .goodsPriceNum {
              height: 40px;
              width: 60px;
              color: gray;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: flex-end;
            }
          }
        }
        .oL-item-footer {
          margin: 10px 0px;
          .right {
            float: right;
          }
          .clear::after {
            content: '';
            display: block;
            clear: both;
          }
          .total {
            margin: 10px 0px;
          }
          .operate {
            button {
              height: 30px;
              width: 80px;
              border-radius: 5px;
              border: 1px solid gray;
              background-color: white;
            }
          }
        }
      }
    }
    .none {
      margin-top: 100px;
      font-size: 26px;
      width: 100%;
      text-align: center;
      color: gray;
    }
  }
}
</style>

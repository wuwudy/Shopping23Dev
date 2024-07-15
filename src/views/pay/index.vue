<template>
  <div class="pay">
    <van-nav-bar
      title="订单结算台"
      left-arrow
      @click-left="$router.go(-1)"
    ></van-nav-bar>
    <div class="address-block">
      <div class="addressB-icon">
        <van-icon name="logistics" />
      </div>
      <div class="addressB-info" v-if="showAddress">
        <span class="user">{{ showAddress.name }} {{ showAddress.phone }}</span>
        <br />
        <span class="address"
          >{{ showAddress.region.province }} {{ showAddress.region.city }}
          {{ showAddress.region.region }} {{ showAddress.detail }}</span
        >
      </div>
      <div
        class="addressB-arrow"
        @click="$router.push(`/address?forwardUrl=${$route.path}`)"
      >
        <van-icon name="arrow" />
      </div>
    </div>
    <div class="carts" v-if="order.goodsList">
      <div
        class="cart-item"
        v-for="item in order.goodsList"
        :key="item.goods_id"
      >
        <img :src="item.goods_image" />
        <div class="cart-item-right">
          <div class="pro-name text-ellipsis-2">
            {{ item.goods_name }}
          </div>
          <div class="NumsCost">
            <div class="nums">x{{ item.total_num }}</div>
            <div class="cost">
              ￥{{ item.total_num * item.goods_price_min }}
            </div>
          </div>
        </div>
      </div>
      <div class="cart-footer">
        共件商品，合计：<span>￥{{ cost }}</span>
      </div>
    </div>
    <div class="pay-detail" v-if="personal.balance">
      <div class="totalCost left-right BlackRed">
        <span>订单总金额:</span>
        <span>￥{{ cost }}</span>
      </div>
      <div class="discounts left-right">
        <span>优惠券：</span>
        <span>无优惠券可用</span>
      </div>
      <div class="deliveryCost left-right BlackRed">
        <span>配送费用</span>
        <span>+￥0.00</span>
      </div>
    </div>
    <div class="pay-style">
      <van-radio-group v-model="radio">
        <div class="tag">支付方式</div>
        <div class="item-block">
          <div class="item">
            <van-icon name="balance-pay" /> 余额支付（可用余额￥{{
              +personal.balance
            }}元）
          </div>
          <van-radio name="YvE" checked-color="#ee0a24"></van-radio>
        </div>
        <div class="item-block">
          <div class="item">
            <van-icon name="balance-pay" /> 余额支付（可用余额￥{{
              +personal.balance
            }}元）
          </div>
          <van-radio name="YinHang" checked-color="#ee0a24"></van-radio>
        </div>
      </van-radio-group>
    </div>
    <div class="pay-msg">
      <textarea
        name=""
        id=""
        cols="30"
        rows="10"
        placeholder="选填：买家留言（50字内）"
        v-model="remark"
      ></textarea>
    </div>
    <div class="pay-footer" v-if="order.goodsList">
      <div class="payCost">
        实际付款<span>￥{{ cost }}</span>
      </div>
      <div class="payBtn" @click="submit">提交订单</div>
    </div>
  </div>
</template>

<script>
import { getAddress, defaultAddress } from '@/api/address'
import { checkOrder, submitOrder } from '@/api/order'
export default {
  name: 'payIndex',
  data() {
    return {
      radio: 'YinHang',
      showAddress: {},
      order: {},
      personal: {},
      remark: ''
    }
  },
  async created() {
    this.setDefaultAddress(), this.getOrderList()
  },
  methods: {
    async setDefaultAddress() {
      const {
        data: { list }
      } = await getAddress()
      const addressList = list

      const {
        data: { defaultId }
      } = await defaultAddress()
      console.log(defaultId)
      //从addressList中找到address_id属性值为defaultId的项，赋值给showAddress
      this.showAddress = addressList.find(item => item.address_id === defaultId)
    },
    async getOrderList() {
      let data = {}
      if (this.mode === 'cart') {
        const result = await checkOrder(this.mode, { cartIds: this.cartsId })
        data = result.data
      } else if (this.mode === 'buyNow') {
        const result = await checkOrder(this.mode, this.goodsInfo)
        data = result.data
      } else {
        return
      }
      this.order = data.order
      this.personal = data.personal
      console.log('order:')
      console.log(this.order)
      console.log('personal:')
      console.log(this.personal)
    },
    async submit() {
      if (this.mode === 'cart') {
        const result = await submitOrder(this.mode, this.remark, {
          cartIds: this.cartsId
        })
        console.log('result:')
        console.log(result)
      } else if (this.mode === 'buyNow') {
        await submitOrder(this.mode, this.remark, this.goodsInfo)
      }
    }
  },
  computed: {
    mode() {
      return this.$route.query.mode
    },
    cartsId() {
      return this.$route.query.cartsId
    },
    goodsInfo() {
      return this.$route.query.goodsInfo
    },
    cost() {
      return this.order.goodsList
        .reduce(
          (price, item) => price + item.goods_price_min * item.total_num,
          0
        )
        .toFixed(2)
    }
  }
}
</script>

<style lang="less" scoped>
.pay {
  .van-nav-bar {
    height: 50px;
  }
  .address-block {
    padding: 10px 20px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: gray;
    font-size: 20px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANYAAAANCAYAAADVGpDCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3Yjk4M2ExYy1jMDhkLTQ1OTktYTI0Ny1kZjNjYzdiYTQ5ZTgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDQwNkY3RkU5N0NGMTFFNUI3N0M4NTU4MzM2RjlFODIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDQwNkY3RkQ5N0NGMTFFNUI3N0M4NTU4MzM2RjlFODIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowNzgwZWI1NS03OGFhLTQzOTUtODQ4OC1lOWI5YmVlYTY1ZDciIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1OTRiYzUyMy1jMzc3LTExNzgtYTdkZS04NGY3YmM1ZGIxMDMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz556PLxAAACBElEQVR42tyaSyhEYRTHP48imlKibDQeSSlkSlEWLCRFsZNH5FE2FqQ8ErIRC9lIkTwXSpMkWWChhEJCSnlkoUZGSsr78f98n43CMFPu/Z/6NZuZ2zn33/+cb869XkmLx8IDEQaGQJbgiytQDSY3MyL+LYnL/HxPXSoHDIJQQq2WQQk4Dbbb/yUB29LJ+6e3B66VB3ZITbUIEqSpCGoJBP1ghtBUD6ARpEtTGSEhXzd+awE9oJzQUPegWdf3QlBPMhgDMYRa7YNisGWkpP5qrBQtVBShUHugUE9hs4fUtwG0utlEjRivoA/Ug1sj3vjffr8FNJEK1auPFHcE9UTq5pdK2PwcoAzMG7mjuRrRYEIfK9jiDJSCBZJ6ynSTsBBqNQ0qgdPISbq6vJCFbJOaagrEk5gqWNczRGiqG1Ah1LLMafRkf5pYIUKtZnMJDXUNasAIST2ZYFioRx9ssQaKwJFZEv5uYmWDXVJTrYBEElP562PfPKGpnkAbSDOTqb6aWAGgW6iHol5kQj2CdtAJngnqkc1hHMQRNr9DPaXWzZj8Z2PZtFCxhEIdaKE2CGqRJ4060AH8CLUaALX6f5VpBZLhI9SaeZXQVHKNLt84SCIxVbhQi5YuQlNd6OVElZlN9TGxrGBUn2PZ4lyoTdIsST0FQj0UDSLUak6ot3gcBLVY3wQYAJoVXxmNERajAAAAAElFTkSuQmCC)
      0 100% / auto 5px repeat-x;
    .addressB-info {
      font-size: 16px;
    }
  }
  .carts {
    padding: 20px 20px 30px;
    border-bottom: 1px solid #dddddd;
    .cart-item {
      margin-bottom: 10px;
      height: 100px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        height: 100px;
      }
      .cart-item-right {
        font-size: 16px;
        height: 80px;
        width: 220px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .NumsCost {
          width: 220px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: baseline;
          .cost {
            color: red;
          }
        }
      }
    }
    .cart-footer {
      font-size: 16px;
      float: right;
      span {
        color: red;
      }
    }
    .cart-footer::after {
      content: '';
      display: block;
      clear: both;
    }
  }
  .pay-detail {
    padding: 10px;
    border-bottom: 1px solid #dddddd;
    div {
      height: 30px;
      line-height: 30px;
      font-size: 16px;
      // border: 1px solid black;
    }
    .left-right {
      display: flex;
      justify-content: space-between;
      align-content: center;
    }
    .BlackRed {
      span:last-child {
        color: red;
      }
    }
  }
  .pay-style {
    padding: 10px;
    border-bottom: 1px #dddddd solid;
    .tag {
      margin-bottom: 10px;
      font-size: 16px;
    }
    .item-block {
      font-size: 16px;
      padding: 0px 10px;
      height: 30px;
      line-height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .pay-msg {
    min-height: 40px;
    width: 375px;
    padding: 10px;
    border-bottom: 1px solid #ddd;
    textarea {
      font-size: 16px;
      border: 0px;
      width: 100%;
    }
  }
  .pay-footer {
    position: fixed;
    left: 0px;
    bottom: 0px;
    background-color: #ffffff;
    height: 50px;
    width: 375px;
    box-shadow: -1px 0px 3px gray;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .payCost {
      margin-left: 20px;
      font-size: 18px;
      span {
        color: red;
      }
    }
    .payBtn {
      text-align: center;
      line-height: 50px;
      height: 50px;
      width: 100px;
      color: white;
      background-image: linear-gradient(to right, #f9221c, #ff6234);
    }
  }
}
</style>

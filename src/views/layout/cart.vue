<template>
  <div class="cart">
    <van-nav-bar title="购物车 "></van-nav-bar>
    <div class="cartList" v-if="cartList.length != 0">
      <div class="listTop">
        <span
          >共<span class="allMount">{{ cartNums }}</span
          >件商品</span
        >
        <div class="edit" v-if="!ifEdit" @click="edit">
          <van-icon name="edit" />
          编辑
        </div>
        <div class="edit" v-else @click="edit">完成</div>
      </div>
      <div class="listBody">
        <div class="cartItem" v-for="item in cartList" :key="item.goods_id">
          <div>
            <van-checkbox
              :value="item.isCheck"
              @click="
                checkShift({ goodsId: item.goods_id, nowState: item.isCheck })
              "
            ></van-checkbox>
          </div>
          <div class="productImg">
            <img :src="item.goods.goods_image" />
          </div>
          <div class="itemRight">
            <span class="productName text-ellipsis-2">{{
              item.goods.goods_name
            }}</span>
            <div class="rightBottom">
              <span class="productPrice"
                >￥{{ item.goods.goods_price_min }}</span
              >
              <CountBoxVue
                :value="item.goods_num"
                @add="
                  updateCart({
                    goodsId: item.goods_id,
                    goodsNum: item.goods_num + 1
                  })
                "
                @sub="
                  updateCart({
                    goodsId: item.goods_id,
                    goodsNum: item.goods_num - 1
                  })
                "
              ></CountBoxVue>
            </div>
          </div>
        </div>
      </div>
      <div class="listFooter">
        <van-checkbox :value="ifAllSel" @click="allCheckShift(ifAllSel)">
          全选
        </van-checkbox>
        <div class="footerRight">
          <div v-if="!ifEdit">
            合计:￥
            <span class="allCost">{{ selCost }}</span>
          </div>
          <div v-else>
            选中:
            <span class="allCost">{{ selList.length }}</span>
            件
          </div>
          <button class="payBtn" v-if="!ifEdit" @click="goPay">
            结算<span class="allMount">({{ selList.length }})</span>
          </button>
          <button class="payBtn" @click="delCart" v-else>删除</button>
        </div>
      </div>
    </div>
    <div class="emptyCart" v-else>
      <van-icon name="smile-comment-o" />
      <span>您购物车是空的，快去逛逛吧</span>
    </div>
  </div>
</template>

<script>
import CountBoxVue from '@/components/CountBox.vue'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
export default {
  name: 'cartIndex',
  data() {
    return {
      ifEdit: false
    }
  },
  computed: {
    ...mapState('cart', ['cartTotal', 'cartList']),
    ...mapGetters('cart', ['cartNums', 'selList', 'selCost', 'ifAllSel'])
  },
  methods: {
    ...mapMutations('cart', ['checkShift', 'allCheckShift']),
    ...mapActions('cart', ['getCart', 'updateCart', 'deleteCart']),
    edit() {
      this.ifEdit = !this.ifEdit
    },
    delCart() {
      const cartIds = this.cartList
        .filter(item => item.isCheck)
        .map(item => item.goods_id)
      console.log(cartIds)
      this.deleteCart(cartIds)
      this.ifEdit = false
    },
    goPay() {
      // console.log(this.selList.map(item => item.id).join(','))
      this.$router.push({
        path: '/pay',
        query: {
          mode: 'cart',
          cartsId: this.selList.map(item => item.id).join(',')
        }
      })
    }
  },
  components: {
    CountBoxVue
  },
  created() {
    this.getCart()
  }
}
</script>

<style lang="less" scoped>
.cart {
  background-color: #f5f5f5;
  .cartList {
    .listTop {
      margin-top: 10px;
      padding: 0px 10px;
      display: flex;
      justify-content: space-between;
      .allMount {
        color: red;
      }
    }
    .listBody {
      margin-top: 10px;
      min-height: 500px;
      padding-bottom: 100px;
      .cartItem {
        padding: 20px 10px;
        margin: 0px 10px;
        margin-top: 10px;
        background-color: #ffffff;
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .productImg {
          margin-left: 10px;
          width: 100px;
          height: 100px;
          text-align: center;
          img {
            max-width: 100px;
            max-height: 100px;
          }
        }
        .itemRight {
          padding: 10px;
          height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .productName {
            font-size: 16px;
          }
          .rightBottom {
            display: flex;
            justify-content: space-between;
            .productPrice {
              font-size: 16px;
            }
            .productPrice::first-letter {
              font-size: 12px;
            }
          }
        }
      }
    }
    .listFooter {
      width: 375px;
      height: 50px;
      background-color: #ffffff;
      // border: 1px solid black;
      box-shadow: 0px 0px 5px gray;
      position: fixed;
      bottom: 50px;
      left: 0px;
      display: flex;
      justify-content: space-between;
      padding: 10px;
      .van-checkbox {
        font-size: 16px;
      }
      .footerRight {
        div {
          display: inline-block;
          font-size: 16px;
          span {
            display: inline-block;
          }
          .allCost {
            color: red;
            font-size: 20px;
          }
        }
        .payBtn {
          // display: inline-block;
          width: 80px;
          height: 30px;
          border: 0px;
          color: white;
          background-color: red;
          border-radius: 10px;
          margin-left: 10px;
        }
      }
    }
  }
  .emptyCart {
    min-height: 550px;
    padding-top: 180px;
    text-align: center;
    font-size: 100px;
    span {
      display: block;
      font-size: 20px;
    }
  }
}
</style>

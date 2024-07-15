import { deleteCart, getCart, updateCart, getCartNum } from '@/api/cart'
import { Toast } from 'vant'
export default {
  namespaced: true,
  state() {
    return {
      // cartInfo: getCart()
      cartList: [],
      cartTotal: 0
    }
  },
  mutations: {
    //设置cartList
    setCartList(state, newList) {
      state.cartList = newList
    },
    //设置cartTotal
    setCartTotal(state, cartTotal) {
      state.cartTotal = cartTotal
    },
    //修改购买数量
    handleUpdate(state, obj) {
      //修改本地数据
      state.cartList.forEach(element => {
        if (element.goods_id === obj.goodsId) element.goods_num = obj.goodsNum
      })
      console.log('this:' + state.cartList)
    },
    //删除某些购物项
    handleDelete(state, cartIds) {
      //修改本地数据
      state.cartList = state.cartList.filter(
        item => !cartIds.includes(item.goods_id)
      )
      //log
      console.log('11:' + cartIds)
      console.log('22:' + state.cartList)
    },
    //某一商品选中状态切换
    checkShift(state, obj) {
      state.cartList.forEach(item => {
        if (item.goods_id === obj.goodsId) item.isCheck = !obj.nowState
      })
    },
    //全选按钮
    allCheckShift(state, nowState) {
      state.cartList.forEach(item => {
        item.isCheck = !nowState
      })
    }
  },
  actions: {
    //发送获取cartTotal请求
    async getCartTotal(context) {
      const {
        data: { cartTotal }
      } = await getCartNum()
      context.commit('setCartTotal', cartTotal)
    },
    //发送获取cartList请求
    async getCart(context) {
      const { data } = await getCart()
      data.list.forEach(element => {
        element.isCheck = true
      })
      console.log(data)
      context.commit('setCartList', data.list)
    },
    //更新cartList
    async updateCart(context, obj) {
      //修改处理
      context.commit('handleUpdate', obj)
      //提交修改
      await updateCart(obj.goodsId, obj.goodsNum)
    },
    //删除cartList
    async deleteCart(context) {
      //获取id数组
      console.log(context.getters.selList)
      const cartIds = context.getters.selList.map(item => item.id)
      //提交删除
      console.log(cartIds)
      await deleteCart(cartIds)
      //提示
      Toast('删除成功')
      //拉取更新
      context.dispatch('getCart')
    }
  },
  getters: {
    //商品数量
    cartNums(state) {
      return state.cartList.length
    },
    //选中商品数
    selList(state) {
      return state.cartList.filter(item => item.isCheck)
    },
    //总金额
    selCost(state) {
      const selList = state.cartList.filter(item => item.isCheck)
      return selList
        .reduce(
          (sum, item) => sum + item.goods_num * item.goods.goods_price_min,
          0
        )
        .toFixed(2)
    },
    //是否全选
    ifAllSel(state) {
      return state.cartList.every(item => item.isCheck)
    }
  }
}

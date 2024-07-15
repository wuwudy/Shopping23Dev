// import store from '@/store'
import request from '@/utils/request'

//加入购物车
export const addCart = (goodsId, goodsNum) => {
  const data = {
    goodsId: goodsId,
    goodsNum: goodsNum,
    goodsSkuId: '0'
  }
  // const option = {
  //   method: 'POST',
  //   url: '/cart/add',
  //   headers: {
  //     'Access-Token': store.getters.token,
  //     platform: 'H5'
  //   },
  //   data: data
  // }
  request.post('/cart/add', data)
}

//获取购物车列表
export const getCart = () => {
  return request.get('/cart/list')
}

//更新购物车
export const updateCart = (goodsId, goodsNum) => {
  const data = {
    goodsId: goodsId,
    goodsNum: goodsNum,
    goodsSkuId: '0'
  }
  request.post('/cart/update', data)
}

//删除购物车某一商品
export const deleteCart = cartIds => {
  return request.post('/cart/clear', { cartIds: cartIds })
}

//获取购物车总数
export const getCartNum = () => {
  return request.get('/cart/total')
}

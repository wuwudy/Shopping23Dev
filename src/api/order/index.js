import request from '@/utils/request'

//获取订单结算信息
export const checkOrder = (mode, obj) => {
  const data = {
    mode: mode,
    delivery: 0,
    couponId: 0,
    isUsePoints: 0,
    ...obj
  }
  return request.get('/checkout/order', { params: data })
}

//提交订单
export const submitOrder = (mode, remark, obj) => {
  const data = {
    mode: mode,
    delivery: 0,
    couponId: 0,
    isUsePoints: 0,
    payType: 10,
    remark: remark,
    ...obj
  }
  return request.post('/checkout/order', data)
}

//获取订单列表
export const getOrderList = dataType => {
  const data = {
    dataType: dataType,
    page: 1
  }
  return request.get('/order/list', { params: data })
}

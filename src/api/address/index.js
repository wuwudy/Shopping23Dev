import request from '@/utils/request'

//获取收货地址
export const getAddress = () => {
  return request.get('address/list')
}

//获取详细收货地址
export const getAddressDetail = addressId => {
  return request.post('address/detail', {
    addressId
  })
}

//默认收货地址id
export const defaultAddress = () => {
  return request.get('/address/defaultId')
}

//获取省市区
export const getRegion = () => {
  return request.get('/region/tree')
}

//设置默认收货地址
export const setDefaultAddress = addressId => {
  request.post('/address/setDefault', {
    addressId
  })
}

//添加收货地址
export const addAddress = data => {
  request.post('/address/add', data)
}

//编辑收货地址
export const editAddress = data => {
  request.post('/address/edit', data)
}

//删除收货地址
export const deleteAddress = addressId => {
  request.post('/address/remove', { addressId })
}

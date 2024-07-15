import request from '@/utils/request'

//搜索相应关键词的商品
export const searchPro = searchObj => {
  const { categoryId, goodsName, page } = searchObj
  return request.get('/goods/list', {
    params: {
      categoryId: categoryId,
      goodsName: goodsName,
      page: page
    }
  })
}

//依据商品id获得商品信息
export const searchGoods = goodsId => {
  return request.get('/goods/detail', {
    params: {
      goodsId
    }
  })
}

//获取商品保障服务
export const getGoodsService = goodsId => {
  return request.get('/goods.service/list', {
    params: {
      goodsId
    }
  })
}

//获取nums条商品评论
export const getGoodsComment = (goodsId, limit) => {
  return request.get('/comment/listRows', {
    params: {
      goodsId,
      limit
    }
  })
}

//获取商品评价总数
export const getGoodsCommentCount = goodsId => {
  return request.get('/comment/total', {
    params: {
      goodsId
    }
  })
}

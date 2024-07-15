import request from '@/utils/request'

import { getGoodsCommentCount } from '@/api/product'

//获取商品评价列表
export const getGoodsCommentList = (scoreType, goodsId, page) => {
  return request.get('/comment/list', {
    params: {
      scoreType,
      goodsId,
      page
    }
  })
}

export { getGoodsCommentCount }

import request from '@/utils/request'

//依据分类查询对应
export const getCategory = () => {
  return request.get('/category/list')
}

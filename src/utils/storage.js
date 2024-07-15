//持久化本地存储
//约定一个键名
const USERINFO_KEY = 'shoppingMall23_userinfo'
const SEARCHISTORY_KEY = 'shoppingMall23_searchhistory'

//用户存储相关
export const getInfo = () => {
  const defaultInfo = {
    token: '',
    userId: ''
  }
  const result = localStorage.getItem(USERINFO_KEY)
  return result ? JSON.parse(result) : defaultInfo
}
export const setInfo = obj => {
  localStorage.setItem(USERINFO_KEY, JSON.stringify(obj))
}
export const removeInfo = () => {
  localStorage.removeItem(USERINFO_KEY)
}

//搜索记录相关
export const getHistory = () => {
  const defaultHistory = []
  const result = localStorage.getItem(SEARCHISTORY_KEY)
  return result ? JSON.parse(result) : defaultHistory
}
export const setHistory = array => {
  localStorage.setItem(SEARCHISTORY_KEY, JSON.stringify(array))
}
export const removeHistory = () => {
  localStorage.removeItem(SEARCHISTORY_KEY)
}

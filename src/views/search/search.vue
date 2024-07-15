<template>
  <div>
    <van-nav-bar
      title="商品搜索"
      left-arrow
      @click-left="$router.go(-1)"
    ></van-nav-bar>
    <div class="searchBox">
      <div class="searchIcon">
        <van-icon name="search" />
      </div>
      <input
        type="text"
        v-model="searchKey"
        placeholder="请输入您所搜索的商品"
        @keydown.enter="search(searchKey)"
      />
      <button class="searchBtn" @click="search(searchKey)">搜索</button>
    </div>
    <div class="searchHistory">
      <div class="searchHistoryNav">
        <h2>最近搜索</h2>
        <div>
          <van-icon name="delete-o" @click="removeHistory" />
        </div>
      </div>
      <ul>
        <div
          class="searchHistoryItem"
          v-for="(item, index) in searchHistorys"
          :key="index"
          @click="search(item)"
        >
          {{ item }}
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
import { getHistory, removeHistory, setHistory } from '@/utils/storage'
export default {
  name: 'searchIndex',
  data() {
    return {
      searchKey: '',
      searchHistorys: getHistory()
    }
  },
  methods: {
    search(key) {
      if (this.searchHistorys.includes(key)) {
        //历史搜索记录中已经有该搜索关键词
        //则先删除
        this.searchHistorys = this.searchHistorys.filter(item => item !== key)
      }
      // 首部添加最新搜索记录
      this.searchHistorys.unshift(key)
      //本地存储持久化
      setHistory(this.searchHistorys)
      //跳转搜索详情页
      this.$router.push(`/searchList?searchkey=${key}`)
    },
    removeHistory() {
      this.searchHistorys = []
      removeHistory()
    }
  }
}
</script>

<style scoped lang="less">
.searchBox {
  height: 25px;
  line-height: 25px;
  width: 350px;
  margin: 10px auto;
  background-color: rgb(238, 232, 232);
  div {
    margin: 0px 5px;
    padding-top: 1px;
    display: inline-block;
  }
  input {
    border: 0px;
    width: 270px;
    background-color: transparent;
    vertical-align: top;
    // background-color: skyblue;
  }
  button {
    border: 0;
    width: 50px;
    background-color: red;
    color: white;
    float: right;
  }
}
.searchBox::after {
  content: '';
  display: block;
  clear: both;
}
.searchHistory {
  overflow: hidden;
  width: 350px;
  margin: 10px auto;
  // background-color: skyblue;
  .searchHistoryNav {
    h2 {
      float: left;
      font-weight: normal;
      font-size: 12px;
    }
    div {
      float: right;
      margin-right: 5px;
    }
  }
  .searchHistoryNav::after {
    content: '';
    display: block;
    clear: both;
  }
  ul {
    margin-top: 5px;
    .searchHistoryItem {
      margin: 2px 4px;
      padding: 1px;
      border-radius: 5px;
      box-shadow: 0px 0px 2px black;
      float: left;
    }
  }
  ul::after {
    content: '';
    display: block;
    clear: both;
  }
}
</style>

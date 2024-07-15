<template>
  <div>
    <van-nav-bar title="商品分类"></van-nav-bar>
    <van-search
      placeholder="点击搜索"
      input-align="center"
      readonly
      @click="$router.push('/search')"
    ></van-search>
    <div class="category">
      <div class="categoryItems">
        <ul>
          <li
            v-for="(item, index) in categorys"
            :key="item.category_id"
            :class="{ OneItems: true, activeItem: activeIndex === index }"
            @click="activeIndex = index"
          >
            {{ item.name }}
            <div v-if="activeIndex === index" class="categoryItem">
              <van-grid column-num="3">
                <van-grid-item
                  class="OneItem"
                  v-for="child in item.children"
                  :key="child.category_id"
                  @click="$router.push(`/searchList?id=${child.category_id}`)"
                >
                  <img :src="child.image.external_url" />
                  <span>{{ child.name }}</span>
                </van-grid-item>
              </van-grid>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getCategory } from '@/api/category'
export default {
  name: 'categroyIndex',
  data() {
    return {
      activeIndex: 0,
      categorys: []
    }
  },
  async created() {
    const res = await getCategory()
    this.categorys = res.data.list
    console.log(this.categorys)
  },
  mounted() {
    // console.log(document.clientHeight)
    //输出视口的高度
    // console.log(document.documentElement.clientHeight)
    // document.querySelector('.categoryItems').style.height =
    //   document.documentElement.clientHeight - 150 + 'px'
    // document
    //   .querySelectorAll('.categoryItem')
    //   .forEach(
    //     item =>
    //       (item.style.height =
    //         document.documentElement.clientHeight - 150 + 'px')
    //   )
  }
}
</script>

<style lang="less" scoped>
.category {
  position: relative;
  margin-top: 0px;
  .categoryItems {
    width: 100px;
    height: calc(100vh - 150px);
    overflow-y: auto;
    .OneItems {
      height: 40px;
      line-height: 40px;
      text-align: center;
      display: block;
      font-size: 16px;
      // background-color: #f8f8f8;
      transition: 0.5s 0s all ease;
      .categoryItem {
        position: absolute;
        top: 0px;
        left: 100px;
        height: 100%;
        width: 275px;
        overflow-y: auto;
        // background-color: skyblue;
        .OneItem {
          color: black;
          img {
            width: 40px;
          }
          span {
            font-size: 14px;
          }
        }
      }
    }
    .activeItem {
      font-size: 18px;
      color: red;
      background-color: white;
    }
  }
}
</style>

<template>
  <div class="comment">
    <van-nav-bar title="所有评论" left-arrow @click-left="$router.back()" />
    <van-tabs v-model="type">
      <van-tab :title="'全部(' + commentCount.all + ')'" name="-1"></van-tab>
      <van-tab :title="'好评(' + commentCount.praise + ')'" name="10"></van-tab>
      <van-tab :title="'中评(' + commentCount.review + ')'" name="20"></van-tab>
      <van-tab
        :title="'差评(' + commentCount.negative + ')'"
        name="30"
      ></van-tab>
    </van-tabs>
    <div class="content">
      <div class="commentsList">
        <commentsListComponent
          :comments="commentsList"
          :commentsScores="scores"
        ></commentsListComponent>
      </div>
    </div>
  </div>
</template>

<script>
import { getGoodsCommentCount, getGoodsCommentList } from '@/api/comment'
import commentsListComponent from '@/components/CommentsList'
export default {
  components: {
    commentsListComponent
  },
  name: 'commentIndex',
  data() {
    return {
      commentCount: {},
      commentsList: [],
      type: this.$route.query.type,
      scores: []
    }
  },
  computed: {
    goodsId() {
      return this.$route.query.id
    }
  },
  methods: {
    //设置评论列表
    async setCommentList() {
      const {
        data: {
          list: { data }
        }
      } = await getGoodsCommentList(this.type, this.goodsId, 1)
      this.commentsList = data
      console.log('List:')

      console.log(this.commentsList)
    },
    //设置评论数
    async setCommentCount() {
      const {
        data: { total }
      } = await getGoodsCommentCount(this.goodsId)
      this.commentCount = total
    },
    //处理评价星级
    handleScores() {
      this.scores = this.commentsList.map(item => {
        switch (item.score) {
          case 10:
            return 5
          case 20:
            return 3
          case 30:
            return 1
          default:
            return 0
        }
      })
    }
  },
  async created() {
    await this.setCommentList()
    await this.setCommentCount()
  },
  watch: {
    type(newValue) {
      this.setCommentList(newValue, this.goodsId, 1)
    },
    commentsList() {
      this.handleScores()
      console.log('scores:')
      console.log(this.scores)
    }
  }
}
</script>

<style lang="less" scoped>
.comment {
  .commentsList {
    padding: 10px;
  }
}
</style>

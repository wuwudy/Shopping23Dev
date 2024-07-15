<template>
  <div class="commentsList">
    <div
      class="onecomment"
      v-for="(item, index) in comments"
      :key="item.comment_id"
    >
      <div class="ocTop">
        <img :src="item.user.avatar_url" />
        <span>{{ item.user.nick_name }}</span>
        <div class="rateShow">
          <van-rate v-model="scores[index]" readonly color="#f4a213" />
        </div>
      </div>
      <div class="ocMain text-ellipsis-2">
        {{ item.content }}
      </div>
      <div class="ocFooter">{{ item.create_time }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scores: this.commentsScores
    }
  },
  props: {
    comments: {
      type: Array,
      require: true
    },
    commentsScores: {
      type: Array,
      require: true
    }
  },
  created() {
    console.log('Yes')
    console.log(this.comments)
    console.log(this.commentsScores)
  },
  watch: {
    commentsScores(newValue) {
      console.log('change')
      this.scores = newValue
    }
  }
}
</script>

<style lang="less" scoped>
.commentsList {
  margin-top: 10px;
  .onecomment {
    // border-bottom: 1px solid red;
    margin-top: 20px;
    .ocTop {
      height: 30px;
      line-height: 30px;
      img {
        display: inline-block;
        border-radius: 15px;
        height: 30px;
        width: 30px;
      }
      span {
        font-size: 14px;
        margin-left: 10px;
        display: inline-block;
        vertical-align: top;
      }
      .rateShow {
        margin-left: 10px;
        display: inline-block;
        vertical-align: top;
      }
    }
    .ocMain {
      margin: 5px 0px;
      font-size: 16px;
    }
    .ocFooter {
      font-size: 14px;
      color: #acacac;
    }
  }
}
</style>

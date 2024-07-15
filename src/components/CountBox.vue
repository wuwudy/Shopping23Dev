<template>
  <div class="CountBox">
    <button @click="sub" :class="{ forbid: subForbid }">-</button>
    <input :value="value" @change="handleChange" />
    <button @click="add" :class="{ forbid: addForbid }">+</button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {}
  },
  computed: {
    subForbid() {
      if (this.value <= 1) return true
      else return false
    },
    addForbid() {
      return false
    }
  },
  methods: {
    sub() {
      if (!this.subForbid) {
        this.$emit('sub')
      }
    },
    add() {
      if (!this.addForbid) {
        this.$emit('add')
      }
    },
    handleChange(e) {
      console.log(e.target.value)
      if (e.target.value >= 1) this.$emit('setValue', e.target.value)
      else {
        console.log('购买数量不符：' + e.target.value)
        this.$emit('setValue', this.value)
      }
    }
  }
}
</script>

<style lang="less">
.CountBox {
  display: flex;
  button {
    width: 30px;
    height: 20px;
    line-height: 20px;
    border: 0px;
    background-color: #f2f3f5;
    color: black;
    font-size: 16px;
  }
  input {
    margin: 0px 10px;
    width: 30px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    background-color: #f2f3f5;
    border: 0px;
    font-size: 16px;
  }
  .forbid {
    background-color: #f7f8fa;
    color: #c8c9cc;
  }
}
</style>

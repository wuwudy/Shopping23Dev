<template>
  <div class="address">
    <van-nav-bar
      title="收货地址"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>
    <div class="address-list" v-if="addressList">
      <van-radio-group v-model="defaultAddressId">
        <div
          class="address-item"
          v-for="item in addressList"
          :key="item.address_id"
        >
          <div class="user-info">
            <span class="user-name">{{ item.name }}</span>
            <span class="user-phone">{{ item.phone }}</span>
          </div>
          <div class="address-info">
            <address>
              {{ item.region.province }} {{ item.region.city }}
              {{ item.region.region }} {{ item.detail }}
            </address>
          </div>
          <div class="operation" :data-id="item.address_id">
            <span class="default-address">
              <van-radio :name="item.address_id">
                <span v-if="item.address_id == defaultAddressId">默认</span>
                <span v-else>选择</span>
              </van-radio>
            </span>
            <div class="edit-del">
              <span
                class="edit-address"
                @click="
                  $router.push(
                    `/addressEditAdd?id=${item.address_id}&defaultId=${defaultAddressId}`
                  )
                "
                ><van-icon name="edit" />编辑</span
              >
              <span
                class="delete-address"
                @click="deleteAddress(item.address_id)"
                ><van-icon name="delete-o" />删除</span
              >
            </div>
          </div>
        </div>
      </van-radio-group>
    </div>
    <div class="address-footer">
      <button class="add-address-btn" @click="$router.push('/addressEditAdd')">
        添加收货地址
      </button>
    </div>
  </div>
</template>

<script>
import {
  getAddress,
  defaultAddress,
  setDefaultAddress,
  deleteAddress
} from '@/api/address'
export default {
  name: 'addressIndex',
  data() {
    return {
      show: false,
      addressList: [],
      defaultAddressId: 0,
      firstRender: true
    }
  },
  methods: {
    async setAddressList() {
      const result = await getAddress()
      this.addressList = result.data.list
      console.log('addressList:')
      console.log(this.addressList)
    },
    async setDefaultAddressId() {
      const result = await defaultAddress()
      this.defaultAddressId = result.data.defaultId
      console.log('defaultId:')
      console.log(this.defaultAddressId)
    },
    // 数据处理，将addressList中，地址项的address_id与defaultAddressId相同的项提前至数组开头
    async handleAddressList() {
      const index = this.addressList.findIndex(
        item => item.address_id === this.defaultAddressId
      )
      if (index !== -1) {
        const item = this.addressList.splice(index, 1)[0]
        this.addressList.unshift(item)
      }
    },
    async deleteAddress(id) {
      deleteAddress(id)

      await this.setAddressList()
      this.handleAddressList()
    }
  },
  watch: {
    //监听数据defaultAddressId的变化
    defaultAddressId: async function (newVal) {
      try {
        if (this.firstRender) return
        // 发送修改默认地址请求
        await setDefaultAddress(newVal)

        console.log('inUpdate')
        //如果是从订单结算页面pay来的，需要返回
        if (this.forwardUrl === '/pay') {
          this.$router.go(-1)
        }
        this.$toast('修改默认地址成功')
      } catch (error) {
        console.dir(error)
        this.$toast('修改默认地址失败')
      }

      console.log(newVal)
    }
  },
  computed: {
    forwardUrl() {
      return this.$route.query.forwardUrl
    }
  },
  async created() {
    await this.setAddressList()
    await this.setDefaultAddressId()

    this.handleAddressList()

    this.firstRender = false
    console.log(this.forwardUrl)
  },
  mounted() {
    console.log('mounted')
  },
  updated() {
    console.log('updated')
  }
}
</script>

<style scoped lang="less">
.address {
  .van-nav-bar {
    height: 46px;
    background-color: #ffffff;
  }
  .address-list {
    height: 550px;
    background-color: #fafafa;
    overflow: auto;
    .address-item {
      // background-color: skyblue;
      margin: 10px;
      padding: 15px;
      height: 120px;
      border-radius: 10px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: center;
      .user-info {
        height: 40px;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: baseline;
        .user-name {
          margin-right: 10px;
        }
      }
      .address-info {
        height: 40px;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: baseline;
        margin-bottom: 5px;
        border-bottom: 1px solid #e5e5e5;
        address {
          font-size: 16px;
          // 取消address标签的倾斜和加粗
          font-style: normal;
          font-weight: normal;
        }
      }
      .operation {
        height: 30px;
        width: 100%;
        margin-top: 5px;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        .edit-del {
          display: flex;
          span {
            margin-left: 10px;
            .van-icon {
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
  .address-footer {
    position: fixed;
    bottom: 0;
    width: 375px;
    height: 50px;
    background-color: #ffffff;
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    .add-address-btn {
      width: 80%;
      height: 80%;
      background-color: #ff4444;
      color: #ffffff;
      border: none;
      border-radius: 20px;
      font-size: 16px;
    }
  }
}
</style>

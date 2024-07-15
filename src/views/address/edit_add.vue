<template>
  <div class="edit_add">
    <van-nav-bar
      title="添加收货地址"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>
    <van-address-edit
      class="myEdit"
      :address-info="addressDetail"
      :area-list="vantRegion"
      :show-set-default="!(addressId === defaultAddressId)"
      area-value="110000"
      :area-placeholder="
        addressId
          ? [
              addressDetail.province,
              addressDetail.city,
              addressDetail.county
            ].join('/')
          : '选择省/市/区'
      "
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      :save-button-text="addressId ? '修改' : '添加'"
      @save="onSave"
      @change-area="onChangeArea"
    />
  </div>
</template>

<script>
import {
  getRegion,
  getAddressDetail,
  editAddress,
  addAddress,
  setDefaultAddress,
  getAddress
} from '@/api/address'
export default {
  name: 'editAndAdd',
  data() {
    return {
      addressDetail: {},
      region: {},
      vantRegion: {},
      regionId: 0
    }
  },
  methods: {
    async setRegion() {
      const result = await getRegion()
      this.region = result.data.list
      console.log('region:')
      console.log(this.region)
      this.handleregion()
    },
    //将返回的数据格式转换为vant area 能显示的数据格式
    handleregion() {
      const vantRegion = {
        province_list: {},
        city_list: {},
        county_list: {}
      }
      let province_code = 100000
      for (let province in this.region) {
        const provinceObj = this.region[province]
        vantRegion.province_list[province_code] = provinceObj.name
        let city_code = province_code + 100
        for (let city in provinceObj.city) {
          const cityObj = provinceObj.city[city]
          vantRegion.city_list[city_code] = cityObj.name
          let county_code = city_code + 1
          for (let county in cityObj.region) {
            const countyObj = cityObj.region[county]
            vantRegion.county_list[county_code] = countyObj.name
            county_code += 1
          }
          city_code += 100
        }
        province_code += 10000
      }
      console.log(vantRegion)
      this.vantRegion = vantRegion

      //设置一下
    },
    //将返回数据的格式变为vant2 area组件需求的格式
    IdToVantId(province_id, city_id, region_id) {
      //看是第几个province
      let rank1 = 0
      for (let i in this.region) {
        if (i === province_id.toString()) break
        rank1++
      }
      let rank2 = 0
      for (let i in this.region[province_id.toString()].city) {
        if (i === city_id.toString()) break
        rank2++
      }
      console.log('city_id - province_id' + (city_id - province_id))
      let result =
        100000 + rank1 * 10000 + (rank2 + 1) * 100 + (region_id - city_id)
      console.log('result' + result)
      return result.toString()
    },
    //转换回
    VantIdtoId(provinceName, cityName, countyName) {
      let regionArray = []
      for (let i in this.region) {
        if (this.region[i].name === provinceName) {
          regionArray[0] = {
            value: i * 1,
            lavel: provinceName
          }
          const city = this.region[i].city
          for (let i1 in city) {
            if (city[i1].name === cityName) {
              regionArray[1] = {
                value: i1 * 1,
                lavel: cityName
              }
              const region = city[i1].region
              for (let i2 in region) {
                if (region[i2].name === countyName) {
                  regionArray[2] = {
                    value: i2 * 1,
                    lavel: countyName
                  }
                  return regionArray
                }
              }
            }
          }
        }
      }
    },
    async setAddressForm() {
      const { data } = await getAddressDetail(this.addressId)
      console.log(data)
      const d = data.detail
      //将信息保存至表单绑定对象addressDetial
      const obj = {}
      obj.id = this.addressId
      obj.name = d.name
      obj.tel = d.phone
      obj.province = d.region.province
      obj.city = d.region.city
      obj.county = d.region.region
      obj.addressDetail = d.detail
      obj.isDefault = this.addressId === this.defaultAddressId
      const cal_area_id = this.IdToVantId(d.province_id, d.city_id, d.region_id)
      console.log('cal_area_id:' + cal_area_id)
      obj.areaCode = cal_area_id
      this.addressDetail = obj
      //单独设置最初的regionId
      this.regionId = d.region_id

      console.log(this.addressDetail)
      // console.log(obj)
      // obj.name = result.this.addressDetail
    },
    async onSave(content) {
      console.log(content)

      //获取到地址数组
      const regionArray = this.VantIdtoId(
        content.province,
        content.city,
        content.county
      )
      console.log('regionArray')
      console.log(regionArray)

      const data = {
        form: {
          name: content.name,
          phone: content.tel,
          region: regionArray,
          detail: content.addressDetail
        }
      }

      try {
        if (!this.addressId) {
          //如果是添加，发送添加收货地址请求
          await addAddress(data)
        } else {
          //如果是修改，发送修改收货地址请求
          data.addressId = this.addressId
          await editAddress(data)
        }
        //如果设置该地址为默认地址
        if (content.isDefault) {
          if (!this.addressId) {
            //如果是添加
            //需先发送获取所有地址
            const addressList = await getAddress().data.list
            //遍历addressList,找到detail属性与content的addressDetail属性相等的项，返回其address_id属性的值
            const addressId = addressList.find(
              item => item.detail === content.addressDetail
            ).address_id
            setDefaultAddress(addressId)
          } else {
            //如果是修改
            if (!this.addressId === this.defaultAddressId) {
              //本来不是默认才需要发送
              setDefaultAddress(this.addressId)
            }
          }
        }
      } catch (error) {
        console.dir(error)
      }

      //还需发送设置默认地址请求
      this.$router.push('/address')
    },
    onChangeDetail() {},
    onChangeArea(e) {
      console.log(e)
    }
  },
  computed: {
    addressId() {
      return this.$route.query.id
    },
    defaultAddressId() {
      return this.$route.query.defaultId
    }
  },
  async created() {
    await this.setRegion()
    if (this.addressId) {
      await this.setAddressForm()
    }
  },
  mounted() {
    // if (this.addressId) {
    //   document
    //     .querySelectorAll('input.van-field__control')
    //     .forEach(item => item.classList.add('edit_add-realPlaceHolder'))
    // }
  }
}
</script>

<style lang="less" scoped>
// .edit_add {
//   .van-address-edit /deep/ .van-field__control::placeholder {
//     color: black;
//   }
// }
</style>

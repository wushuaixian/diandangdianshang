<!--
 * @Author: your name
 * @Date: 2021-07-10 21:11:53
 * @LastEditTime: 2021-07-25 02:54:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/components/AddressList/index.vue
-->
<template>
  <div>
    <ul>
      <li class="item" v-for="(item, index) in addressList" :key="index">
        <a-card>
          <div class="address">
            <div class="address-left">
              <div class="left-div">
                <div class="left-div-top">
                  <span>{{ item.userName }}</span>
                  <span>{{ item.mobile }}</span>
                  <span class="default-address" v-if="item.isDefault">默认地址</span>
                </div>
                <div>
                  {{ item.provinceName || '' }}&nbsp; {{ item.cityName || '' }}&nbsp; {{ item.regionName || '' }}&nbsp;
                  {{ item.detailAddress || '' }}
                </div>
              </div>
            </div>
            <div class="address-right">
              <span class="right-set" @click="setDefaultUserAddressForm(item)" v-if="!item.isDefault">
                设为默认地址
              </span>
              <span class="right-icon" v-for="(i, ind) in iconList" :key="ind" @click="iconFunction(item, i.type)">
                <a-icon type="form" />
                <div>{{ i.text }}</div>
              </span>
            </div>
          </div>
        </a-card>
      </li>
    </ul>
    <addNewAddress
      ref="addNewAddress"
      :isEdit="isEdit"
      :visible.sync="visible"
      :params="queryParams"
      @updateList="init()"
    ></addNewAddress>
  </div>
</template>
<script>
import addNewAddress from '@/components/addNewAddress'
import { getAllAddressForm, setDefaultUserAddressForm, deleteAddressForm } from '@/api/recevingAddress'
export default {
  components: {
    addNewAddress
  },
  data() {
    return {
      iconList: [
        {
          type: 'edit',
          text: '编辑'
        },
        {
          type: 'delete',
          text: '删除'
        }
      ],
      addressList: [],
      queryParams: {},
      isEdit: 0,
      visible: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const result = await getAllAddressForm()
      this.addressList = result.data
    },
    iconFunction(item, type) {
      if (type === 'delete') {
        this.deleteFunction(item)
      } else {
        this.isEdit = 2
        this.queryParams = item
        // this.$refs.addNewAddress.init(item)
        this.visible = true
      }
    },
    async deleteFunction(item) {
      const result = await deleteAddressForm({
        id: item.id
      })
      if (result.code === '0') {
        this.$message.success('删除成功')
        this.init()
      }
    },
    async setDefaultUserAddressForm(item) {
      const result = await setDefaultUserAddressForm({
        id: item.id
      })
      if (result.code === '0') {
        this.$message.success('设置默认地址成功')
        this.init()
      }
    }
  }
}
</script>
<style scoped lang="less">
.item {
  padding-bottom: 20px;
}
.address {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .address-left {
    display: flex;
    align-items: center;
    .left-radio {
      margin-right: 20px;
    }
    .left-div {
      .left-div-top {
        margin-bottom: 10px;
        span {
          margin-right: 10px;
          vertical-align: middle;
        }
        .default-address {
          background: #ff9336;
          cursor: pointer;
          font-size: 10px;
          transform: scale(0.4);
          color: #fff;
          padding: 5px;
          border-radius: 3px;
          box-shadow: 1px 1px 1px 1px #eee;
        }
      }
    }
  }
  .address-right {
    display: flex;
    align-items: center;
    .right-set {
      cursor: pointer;
      color: #ff9336;
    }
    .right-icon {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-left: 20px;
    }
  }
}
</style>

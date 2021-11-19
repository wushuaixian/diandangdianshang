<!--
 * @Author: your name
 * @Date: 2021-07-09 23:11:43
 * @LastEditTime: 2021-07-25 02:34:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/systemManagement/personalCenter/receivingAddress/index.vue
-->
<template>
  <div>
    <a-card>
      <header-title class="header-title">
        <span>设置收货地址</span>
      </header-title>
      <div class="title-btn">
        <a-button type="primary" @click="addNewAddress">添加新地址</a-button>
      </div>
      <AddressList ref="AddressList"></AddressList>
      <addNewAddress
        ref="addNewAddress"
        :isEdit="isEdit"
        :visible.sync="visible"
        @updateList="$refs.AddressList.init()"
      ></addNewAddress>
    </a-card>
  </div>
</template>
<script>
import AddressList from '@/components/AddressList'
import addNewAddress from '@/components/addNewAddress'
export default {
  components: {
    AddressList,
    addNewAddress
  },
  data() {
    return {
      visible: false,
      isEdit: 1 // 1 添加地址   2 编辑地址
    }
  },
  methods: {
    addNewAddress() {
      // this.$refs.addNewAddress.init()
      this.visible = true
    }
  }
}
</script>
<style scoped lang="less">
.title-btn {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
}
</style>

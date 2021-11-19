<!--
 * @Author: your name
 * @Date: 2021-06-25 18:52:27
 * @LastEditTime: 2021-07-13 18:36:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/systemManagement/organization/list/index.vue
-->
<template>
  <div class="organizatin">
    <Left
      v-model="info"
      class="left"
      :is-change="isChange"
      @changeSelectedKeys="changeSelectedKeys"
      @changeTab="changeInfo"
      @changeDepartmentType="changeDepartmentType"
    />
    <Right
      class="right"
      :info="info"
      :departmentType="departmentType"
      :is-change="isChange"
      @change="handlechange"
      @changeInfo="changeInfo"
    />
  </div>
</template>

<script>
import Left from './left'
import Right from './right'
export default {
  components: { Left, Right },
  data() {
    return {
      info: null,
      isChange: 0,
      leftSelectedKeys: [],
      loading: true,
      departmentType: '0'
    }
  },
  methods: {
    handlechange(val) {
      this.info = null
      this.isChange = val
    },
    changeInfo(info) {
      this.info = null
      setTimeout(() => {
        this.$set(this, 'info', info)
      }, 300)
    },
    changeSelectedKeys(value) {
      this.leftSelectedKeys = value
    },
    changeDepartmentType(departmentType) {
      this.departmentType = departmentType
    }
  }
}
</script>

<style lang="less" scoped>
.organizatin {
  display: flex;
  max-width: 100%;
  .base-info {
    flex: 1;
  }
  .left {
    // flex: 1;
    width: 25%;
  }
  .right {
    flex: 3.8;
    width: 75%;
  }
}
</style>

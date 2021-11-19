<template>
  <div>
    <!-- 搜索框-->
    <listAutomatic @search="search"></listAutomatic>
    <!-- 订单列表 搜索框  end-->
    <!-- <a-card class="card">
      <a-tabs :default-active-key="null" @change="callback"> </a-tabs>
    </a-card> -->
  </div>
</template>
<script>
// 子向父
import listAutomatic from './components/listAutomatic'
import { orderStatus } from '@/config/orderStatus'
export default {
  components: { listAutomatic },
  data() {
    return {
      orderStatus,
      queryParams: {}
    }
  },
  methods: {
    callback(e) {
      this.active = e
    },
    search(params) {
      // this.queryParams = params
      // console.log(this.$refs['orderListTable' + this.active])
    }
  }
}
</script>
<style scoped lang="less">
.card {
  margin-top: 20px;
}
.btn {
  margin-right: 20px;
}
</style>

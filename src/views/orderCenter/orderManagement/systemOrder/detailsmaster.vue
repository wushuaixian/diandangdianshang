<template>
  <OrderDetail :disableds.sync="disableds" />
</template>
<script>
import OrderDetail from '@/views/orderCenter/orderManagement/buyerOrder/orderDetail/index'
export default {
  components: {
    OrderDetail
  },
  data() {
    return {
      disableds: true
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
</style>

<!--
 * @Author: your name
 * @Date: 2021-07-23 10:29:46
 * @LastEditTime: 2021-08-01 15:03:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/Suppliers/package/log.vue
-->
<template>
  <section class="authention-log">
    <s-table ref="table" name="logTable" rowKey="id" :columns="columns" :data="init" class="table">
      <template v-slot:createTime="item"> {{ item | moment('YYYY-MM-DD HH:mm:ss') }} </template>
      <!-- <template v-slot:action="item">
        <a-button @click="GoDetail(item)" type="link" block> 查看 </a-button>
      </template> -->
      <template v-slot:paymentStatus="item">
        <div v-if="item === '0'">待支付</div>
        <div v-else-if="item === '1'">已经支付</div>
      </template>
      <template slot="action" slot-scope="text">
        <span class="see" @click="see(text.orderNo)">查看</span>
      </template>
    </s-table>
    <SetMeal v-if="visible" :visible="visible" @close="visible = false" :type="type" />
  </section>
</template>

<script>
import { getPackageOrderList } from '@/api/supplier'
import SetMeal from './setMeal'
import template from '@/views/contract/purchasers/template.vue'
const columns = [
  { title: '订单流水号', dataIndex: 'orderNo' },
  { title: '时间', dataIndex: 'createTime', scopedSlots: { customRender: 'createTime' } },
  { title: '金额(元)', dataIndex: 'packageDiscountPrice' },
  { title: '付款状态', dataIndex: 'paymentStatus', scopedSlots: { customRender: 'paymentStatus' } },
  { key: 'action', scopedSlots: { customRender: 'action' } }
]
export default {
  components: { template, SetMeal },
  data() {
    return {
      columns,
      visible: false,
      type: 4
    }
  },
  methods: {
    async init(params) {
      return getPackageOrderList()
    },
    GoDetail(orderNo) {
      window.open('/user/cashier/' + orderNo, '_blank')
    },
    async see(orderNo) {
      // if (val === '中小型企业套餐') {
      //   this.type = 2
      // } else if (val === '大型企业套餐') {
      //   this.type = 3
      // } else if (val === '行业头部企业战略合作套餐') {
      //   this.type = 4
      // }
      this.type = orderNo
      this.visible = true
    }
  }
}
</script>

<style lang="less" scoped>
.authention-log {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}
.see {
  color: #ff6b00;
  cursor: pointer;
}
</style>

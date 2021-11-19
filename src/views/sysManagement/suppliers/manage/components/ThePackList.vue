<!--
 * @Author: your name
 * @Date: 2021-07-29 20:13:34
 * @LastEditTime: 2021-08-01 14:44:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/sysManagement/suppliers/manage/components/ThePackList.vue
-->
<template>
  <div class="the-pack-list">
    <header-title>
      <span>认证套餐</span>
    </header-title>
    <s-table ref="table" name="SuppliersPacklogTable" rowKey="id" :columns="columns" :data="init" class="table">
      <template v-slot:createTime="item"> {{ item | moment('YYYY-MM-DD HH:mm:ss') }} </template>
      <!-- <template v-slot:action="item">
        <a-button @click="GoDetail(item)" type="link" block> 查看 </a-button>
      </template> -->
      <template v-slot:paymentStatus="item">
        <div v-if="item === '0'">待支付</div>
        <div v-else-if="item === '1'">已经支付</div>
      </template>
      <template slot="action" slot-scope="text">
        <a class="see" @click="see(text.orderNo)">查看</a>
      </template>
    </s-table>
    <SetMeal v-if="visible" :visible="visible" @close="visible = false" :type="type" />
  </div>
</template>

<script>
import { getPackageOrderList } from '@/api/supplier'
import SetMeal from '@/views/Suppliers/package/setMeal'
const columns = [
  { title: '订单流水号', dataIndex: 'orderNo' },
  { title: '时间', dataIndex: 'createTime', scopedSlots: { customRender: 'createTime' } },
  { title: '金额(元)', dataIndex: 'packageDiscountPrice' },
  { title: '付款状态', dataIndex: 'paymentStatus', scopedSlots: { customRender: 'paymentStatus' } },
  { key: 'action', scopedSlots: { customRender: 'action' } }
]
export default {
  components: {
    SetMeal
  },
  data() {
    return {
      columns,
      visible: false,
      type: ''
    }
  },
  methods: {
    async init() {
      const { id: merchantId } = this.$route.params
      return getPackageOrderList({ merchantId })
    },
    GoDetail(orderNo) {
      window.open('/user/cashier/' + orderNo, '_blank')
    },
    see(val) {
      this.visible = true
      this.type = val
    }
  }
}
</script>

<style lang="less" scoped>
</style>

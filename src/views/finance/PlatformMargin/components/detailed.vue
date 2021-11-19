<template>
  <div>
    <a-modal v-model="visible" width="1280px" title="平台保证金明细" @ok="handleOk">
      <div>
        <s-table
          v-if="visible"
          :columns="columns"
          :data="performanceDetial"
          ref="tables"
          name="detailedTables1"
          rowKey="bidProjectNo"
          :scroll="{ x: 1500 }"
        >
          <template slot="payTime" slot-scope="prop">{{ prop.payTime | moment('YYYY-MM-DD HH:mm:ss') }}</template>
          <template slot="payAmount" slot-scope="text">
            <span>{{ text.payAmount ? text.payAmount : 0 | formatCurrency(2, true) }}</span>
          </template>
        </s-table>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { performanceDetial } from '@/api/PlatformMarginList'
export default {
  data() {
    return {
      visible: false,
      obj: {},
      merchantId: '',
      columns: [
        { title: '时间', width: 170, key: 'payTime', scopedSlots: { customRender: 'payTime' } },
        { title: '收款单位', width: 170, dataIndex: 'payeeMerchantName', key: 'payeeMerchantName' },
        { title: '付款人', width: 170, dataIndex: 'payerName', key: 'payerName' },
        { title: '投标项目编号', width: 170, dataIndex: 'bidProjectNo', key: 'bidProjectNo' },
        { title: '投标项目名称', dataIndex: 'bidProjectName', width: 150, key: 'bidProjectName' },
        // { title: '金额(元)', scopedSlots: { customRender: 'payAmount' }, width: 150, key: 'payAmount' },
        { title: '金额(元)', dataIndex: 'payAmountStr', key: 'payAmountStr' },
        { title: '保证金类型', dataIndex: 'depositType', width: 150, key: 'depositType' }
        // {
        //   title: '单据状态',
        //   width: 120,
        //   key: 'billStatus',
        //   scopedSlots: { customRender: 'billStatus' }
        // },
      ]
    }
  },
  methods: {
    // 获取列表
    async performanceDetial(pagination) {
      const { merchantId } = this
      const data = {
        ...pagination,
        merchantId
      }
      return performanceDetial({ ...data })
    },
    init(data) {
      this.merchantId = data.merchantId
      console.log(data)
      this.visible = true
    },
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      this.visible = false
    }
  }
}
</script>
<style lang='less' scoped>
</style>

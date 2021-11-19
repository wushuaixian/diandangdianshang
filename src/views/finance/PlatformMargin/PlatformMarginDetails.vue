<template>
  <div>
    <a-card :bordered="false">
      <h2>平台保证金明细</h2>
    </a-card>
    <a-card :bordered="false" style="margin-top: 24px">
      <div class="buttonAraay">
        <a-button class="button1" @click="exportFile">导出</a-button>
        <a-button class="button1" @click="viewTasksVisible = true">查看任务</a-button>
      </div>
      <s-table
        name="PlatformMarginDetailsTable"
        :columns="columns"
        :data="performanceDetial"
        ref="table"
        rowKey="payname"
        :scroll="{ x: 1500 }"
      >
        <template v-slot:payTime="props">{{ props.payTime | moment('YYYY-MM-DD HH:mm:ss') }}</template>
        <template v-slot:payAmount="Amount">{{ Amount.payAmount | formatCurrency(2, true) }}</template>
      </s-table>
    </a-card>
    <SystemctlTips :visible="systemctlTipsVisible" @close="systemctlTipsVisible = false" :code="exportCode" />
    <ViewTasks
      :visible="viewTasksVisible"
      @close="viewTasksVisible = false"
      taskType="platformDepositDetailExcelExport"
    />
  </div>
</template>

<script>
import SystemctlTips from '@/components/exportFile/systemctlTips'
import ViewTasks from '@/components/exportFile/viewTasks'
import { performanceDetial } from '@/api/PlatformMarginList'
import { exportId, bondDetailExport } from '@/api/fince'
export default {
  components: {
    SystemctlTips,
    ViewTasks
  },
  data() {
    return {
      jsonTxt: {},
      systemctlTipsVisible: false,
      viewTasksVisible: false,
      exportCode: 0,
      columns: [
        {
          title: '时间',
          scopedSlots: { customRender: 'payTime' },
          width: 200,
          key: 'payTime'
        },
        { title: '收款单位', width: 200, dataIndex: 'payeeMerchantName', key: 'payeeMerchantName' },
        { title: '付款人', width: 200, dataIndex: 'payerName', key: 'payerName' },
        { title: '项目编号', width: 200, dataIndex: 'bidProjectNo', key: 'bidProjectNo' },
        { title: '项目名称', width: 200, dataIndex: 'bidProjectName', key: 'bidProjectName' },
        // { title: '金额(元)', width: 200, scopedSlots: { customRender: 'payAmount' }, key: 'payAmount' },
        { title: '金额(元)', width: 200, dataIndex: 'payAmountStr', key: 'payAmountStr' },
        { title: '保证金类型', width: 200, dataIndex: 'depositType', key: 'depositType' }
      ]
    }
  },
  methods: {
    async performanceDetial(pagination) {
      const data = await performanceDetial({ ...pagination })
      return data
    },
    exportFile() {
      const that = this
      delete this.jsonTxt.itemsPerPage
      delete this.jsonTxt.currentPage
      const jsonTxt = JSON.stringify(this.jsonTxt)
      bondDetailExport({
        templateCode: 'platformDepositDetailExcelExport',
        jsonTxt,
        exportType: 'exportInvoiceInfoList',
        fileName: '平台保证金明细列表'
      }).then((res) => {
        if (res.code === '0') {
          exportId({ taskType: 'platformDepositDetailExcelExport' }).then((res) => {
            if (res.code === '0') {
              that.systemctlTipsVisible = true
              that.exportCode = res.data
            }
          })
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.buttonAraay {
  margin-bottom: 10px;
  .button1 {
    width: 100px;
    margin-right: 10px;
  }
}
</style>

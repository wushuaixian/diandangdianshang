<!--
 * @Author: your name
 * @Date: 2021-07-16 17:05:05
 * @LastEditTime: 2021-08-18 00:40:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/orderCenter/orderManagement/supplierOrder/orderList.vue
-->
<template>
  <div>
    <!-- 订单列表 搜索框  start-->
    <listSearch @search="search"></listSearch>
    <!-- 订单列表 搜索框  end-->
    <a-card class="card">
      <a-tabs default-active-key="" @change="callback">
        <a-tab-pane v-for="item of statusList" :key="item.value" :tab="`${item.label}(${item.count || 0})`">
        </a-tab-pane>
      </a-tabs>
      <!-- <a-tabs default-active-key="" @change="callback">
        <a-tab-pane key="" :tab="`全部`" force-render></a-tab-pane>
        <a-tab-pane v-for="(item, key) in statusList" :key="key" :tab="`${item}(${count[key]})`"></a-tab-pane>
      </a-tabs> -->
      <!-- <a-tabs default-active-key="" @change="callback">
        <a-tab-pane key="" tab="全部" />
        <a-tab-pane key="1011" tab="待提交" />
        <a-tab-pane key="1030" tab="待确认" />
        <a-tab-pane key="1050" tab="待审核" />
        <a-tab-pane key="1062" tab="待发货" />
        <a-tab-pane key="9000" tab="已取消" />
        <a-tab-pane key="" tab="已发货" />
        <a-tab-pane key="" tab="已签收" />
        <a-tab-pane key="" tab="已完成" />
      </a-tabs> -->
      <!-- <ExportFile
        :mode="ExportOmsWeb"
        :params="{
          templateCode: 'quyerOrderLineListPageExport',
          fileName: '订单列表',
          jsonTxt,
          exportType: 'exportInvoiceInfoList'
        }"
      /> -->
      <ExportFile style="margin-left: 10px" :mode="ExportOmsWeb" :paramsList="exportParams" />
      <s-table
        ref="orderListTable"
        name="orderListTableName"
        rowKey="id"
        :scroll="{ x: 2000 }"
        :data="getList"
        :columns="columns"
      >
        <template #orderCreateTime="text">
          <span>{{ text.orderCreateTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
        <template #orderCode="text">
          <span @click="details(text)" class="color">
            {{ text.orderCode }}
          </span>
        </template>
        <template #priceAmountWith="text">
          <span v-if="text.priceAmountWith">{{ text.priceAmountWith | formatCurrency(2, true) }}</span>
        </template>
        <template #orderAmount="text">
          <span v-if="text.orderAmount">{{ text.orderAmount | formatCurrency(2, true) }}</span>
        </template>
      </s-table>
    </a-card>
  </div>
</template>
<script>
import ExportFile from '@/components/exportFile'
import listSearch from './components/listSearch'
import { systemctlOrderList } from '@/api/systemctlOrder'
import { orderStatus, orderBtn } from '@/config/orderStatus'
import { exportData, exportItemData, getBuyerOrderStateCount } from '@/api/orderCenter'
import { ExportOmsWeb } from '@/api/fince.js'
export default {
  components: { listSearch, ExportFile },
  data() {
    return {
      statusList: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '待提交',
          value: '1011',
          count: 0
        },
        {
          label: '待确认',
          value: '1030',
          count: 0
        },
        {
          label: '待审核',
          value: '1050',
          count: 0
        },
        {
          label: '待发货',
          value: '1062',
          count: 0
        },
        {
          label: '已取消',
          value: '9000',
          count: 0
        }
      ],
      active: '',
      systemctlTipsVisible: false,
      ViewTasks: false,
      exportCode: 0,
      orderStatus,
      orderBtn,
      ExportOmsWeb,
      queryParams: {},
      viewTasksVisible: false,
      taskType: 'soExport',
      selectRowKeys: [],
      jsonTxt: {},
      rowSelection: {
        onChange: (selectRowKeys, selectRows) => {
          this.selectRowKeys = selectRowKeys
        }
      },
      exportParams: [
        {
          name: '导出订单',
          params: {
            templateCode: 'quyerOrderListPageExport',
            jsonTxt: {},
            exportType: 'exportQuyerOrderListPage',
            fileName: '平台订单导出',
            taskType: 'exportQuyerOrderListPage'
          }
        },
        {
          name: '导出订单行',
          params: {
            templateCode: 'quyerOrderLineListPageExport',
            jsonTxt: {},
            exportType: 'exportQuyerOrderLineListPage',
            fileName: '平台订单行导出',
            taskType: 'exportQuyerOrderLineListPage '
          }
        }
      ],
      columns: [
        {
          title: '订单编号',
          key: 'orderCode',
          scopedSlots: { customRender: 'orderCode' }
        },
        {
          title: '订单来源',
          dataIndex: 'purchaseOrderSourceStr',
          key: 'purchaseOrderSourceStr'
        },
        {
          title: '订单状态',
          dataIndex: 'orderStatusString',
          key: 'orderStatusString'
        },
        {
          title: '订单时间',
          key: 'orderCreateTime',
          scopedSlots: { customRender: 'orderCreateTime' }
        },
        {
          title: '订单数量',
          dataIndex: 'productItemNum',
          key: 'productItemNum'
        },
        {
          title: '未税总价(元)',
          scopedSlots: { customRender: 'priceAmountWith' },
          key: 'priceAmountWith'
        },
        {
          title: '含税总价(元)',
          scopedSlots: { customRender: 'orderAmount' },
          key: 'orderAmount'
        },
        {
          title: '采购商',
          dataIndex: 'buyerMerchantName',
          key: 'buyerMerchantName'
        },
        {
          title: '采购员',
          dataIndex: 'buyerUserName',
          key: 'buyerUserName'
        },
        {
          title: '下单人',
          dataIndex: 'userName',
          key: 'userName'
        },
        {
          title: '供应商名称',
          dataIndex: 'merchantName',
          key: 'merchantName'
        },
        {
          title: '合同编号',
          dataIndex: 'contractCode',
          key: 'contractCode'
        },
        {
          title: '合同名称',
          dataIndex: 'contractName',
          key: 'contractName'
        },
        {
          title: '项目编号',
          dataIndex: 'projectCode',
          key: 'projectCode'
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          key: 'projectName'
        }
      ]
    }
  },
  methods: {
    callback(e) {
      this.active = e
      this.$refs.orderListTable.refresh(true)
    },
    async BindCount(formData) {
      const res = await getBuyerOrderStateCount(formData)
      if (res.code === '0') {
        const list = res.data.map((x) => {
          const [label] = Object.keys(x)
          return {
            label,
            value: x[label]
          }
        })
        const count = res.data.length > 0 ? list.map((x) => x.value).reduce((n, m) => n + m) : 0
        this.statusList = this.statusList.map((x) => ({
          ...x,
          count: x.value !== '' ? list.find((c) => c.label === x.value)?.value || 0 : count
        }))
        // for (let i = 0; i < res.data.length; i++) {
        //   for (const key in res.data[i]) {
        //     this.count[key] = res.data[i][key]
        //   }
        // }
      }
    },
    search(params) {
      this.queryParams = params
      this.$refs.orderListTable.refresh(true)
    },
    async getList(params) {
      const data = {
        ...params,
        orderStatus: this.active,
        ...this.queryParams
      }
      if (typeof data.buyerMerchantId === 'object') {
        data.buyerMerchantId = ''
      }
      if (typeof data.merchantId === 'object') {
        data.merchantId = ''
      }
      this.jsonTxt = { ...data }
      this.exportParams[0].params.jsonTxt = { ...data }
      this.BindCount({ ...data })
      return systemctlOrderList({ ...data })
    },
    details(text) {
      this.$router.push({ name: 'SysOrderOrderListDetails', query: { orderCode: text.orderCode } })
    },
    async getSave(item) {
      this.$refs.batchConfirmationModal.init([item.orderCode])
    },
    async exportantOrder(fn, i) {
      const { queryParams, active } = this
      const result = await exportData({
        filters: { ...queryParams, ...{ orderStatus: active } },
        joinFields: ['errorRemark'],
        selectFields: fn.exoprtFile
      })
      const vm = this
      if (result.code === '0') {
        this.$confirm({
          title: '系统提示',
          content: `导出任务创建成功,任务编码: ${result.data}`,
          onOk() {
            // vm.viewTasksVisible = true
            vm.$refs.viewTask.init()
          },
          onCancel() {}
        })
      }
    },
    async exportItemDataFn(fn, i) {
      const { queryParams, active } = this
      const result = await exportItemData({
        filters: { ...queryParams, ...{ orderStatus: active } },
        joinFields: ['errorRemark'],
        selectFields: fn.exoprtFile
      })
      const vm = this
      if (result.code === '0') {
        this.$confirm({
          title: '系统提示',
          content: `导出任务创建成功,任务编码: ${result.data}`,
          onOk() {
            // vm.viewTasksVisible = true
            vm.$refs.viewTask.init()
          },
          onCancel() {}
        })
      }
    },
    // 批量售后
    async batchAudit() {
      this.$refs.batchConfirmationModal.init(this.selectRowKeys)
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
  margin-bottom: 20px;
}
.color {
  color: #ff6b00;
  cursor: pointer;
}
.buttonAraay {
  margin-bottom: 10px;
  .button1 {
    width: 100px;
    margin-right: 10px;
  }
}
</style>

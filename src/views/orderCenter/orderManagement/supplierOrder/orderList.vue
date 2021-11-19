<!--
 * @Author: your name
 * @Date: 2021-07-16 17:05:05
 * @LastEditTime: 2021-08-13 17:46:56
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
      <a-tabs :default-active-key="null" @change="callback">
        <a-tab-pane
          :tab="`${item.orderStatusText}${item.orderStatus ? `(${orderStatusNum[item.orderStatus]})` || 0 : ''}`"
          v-for="item in orderStatus"
          :key="item.orderStatus"
        >
          <!-- btn  start -->
          <a-button
            v-for="(i, index) in orderBtn.filter((record) => {
              return record.status.includes(item.orderStatus)
            })"
            :key="index"
            class="btn"
            :type="i.type"
            @click="clickFunction(i, item)"
          >
            {{ i.text }}
          </a-button>
          <ExportFile style="margin-left: 10px" :mode="ExportOmsWeb" :paramsList="exportBtn" />

          <!-- btn  end -->
        </a-tab-pane>
      </a-tabs>
      <!-- 表格  start -->
      <s-table
        ref="orderListTable"
        name="orderListTableName"
        rowKey="orderCode"
        :scroll="{ x: 1000 }"
        :data="getList"
        :columns="columns"
        :row-selection="rowSelection"
      >
        <template v-slot:orderCreateTime="orderCreateTime">
          <span>{{ orderCreateTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
        <template v-slot:active="active, item">
          <a v-if="item.orderStatus === 1030" @click="getStatus(item)">确认</a>
          <a v-if="item.orderStatus === 1040" @click="getSave(item)">审核</a>
        </template>
      </s-table>
      <!-- 表格  end -->
    </a-card>
    <batchConfirmationModal
      ref="batchConfirmationModal"
      @ok="$refs.orderListTable.refresh(true)"
    ></batchConfirmationModal>
    <a-modal v-model="visible" title="提示">
      <div>订单确认</div>
      <div slot="footer">
        <a-button @click="visible = false">取消</a-button>
        <a-button type="primary" @click="updateStatusFn(info, false)">订单驳回</a-button>
        <a-button type="primary" @click="updateStatusFn(info, true)">订单确认</a-button>
      </div>
    </a-modal>
    <viewTask ref="viewTask"></viewTask>
  </div>
</template>
<script>
import listSearch from './components/listSearch'
import ExportFile from '@/components/exportFile'
import { ExportOmsWeb } from '@/api/fince'
import batchConfirmationModal from './components/orderDetailComponents/batchConfirmationModal'
import viewTask from './components/viewTask/index'
import { orderStatus, orderBtn } from '@/config/orderStatus'
import {
  listSoPage,
  exportData,
  exportItemData,
  updateStatus,
  batchUpdateOrderStatus,
  getBuyerOrderStateCount
} from '@/api/orderCenter'
export default {
  components: { listSearch, batchConfirmationModal, viewTask, ExportFile },
  data() {
    return {
      ExportOmsWeb,
      orderStatus,
      orderBtn,
      info: {},
      queryParams: {},
      visible: false,
      viewTasksVisible: false,
      taskType: 'soExport',
      orderStatusNum: {},
      selectRowKeys: [],
      allNum: 0,
      exportBtn: [
        {
          name: '导出订单',
          params: {
            templateCode: 'quyerOrderListPageExport',
            jsonTxt: {},
            exportType: 'exportQuyerOrderListPage',
            fileName: '供应商订单导出',
            taskType: 'exportQuyerOrderListPage'
          }
        },
        {
          name: '导出订单行',
          params: {
            templateCode: 'quyerOrderLineListPageExport',
            jsonTxt: {},
            exportType: 'exportQuyerOrderLineListPage',
            fileName: '供应商和订单行导出',
            taskType: 'exportQuyerOrderLineListPage '
          }
        }
      ],
      rowSelection: {
        onChange: (selectRowKeys, selectRows) => {
          this.selectRowKeys = selectRowKeys
        }
      },
      columns: [
        {
          title: '订单编号',
          dataIndex: 'orderCode',
          key: 'orderCode',
          width: 200,
          customRender: (text, item) => {
            const { orderCode } = item
            return (
              <router-link to={{ name: 'SupplierOrderOrderDetailSourcing', query: { orderCode } }}>
                {orderCode}
              </router-link>
            )
          }
        },
        {
          title: '订单来源',
          dataIndex: 'purchaseOrderSourceStr',
          key: 'purchaseOrderSourceStr',
          width: 200
        },
        {
          title: '订单状态',
          dataIndex: 'orderStatusString',
          key: 'orderStatusString',
          width: 200
        },

        {
          title: '订单时间',
          dataIndex: 'orderCreateTime',
          key: 'orderCreateTime',
          width: 200,
          scopedSlots: { customRender: 'orderCreateTime' }
        },
        {
          title: '订单数量',
          dataIndex: 'productItemNum',
          key: 'productItemNum',
          width: 200
        },
        {
          title: '未税总价(元)',
          dataIndex: 'priceAmountWith',
          key: 'priceAmountWith',
          width: 200
        },
        {
          title: '含税总价(元)',
          dataIndex: 'orderAmount',
          key: 'orderAmount',
          width: 200
        },
        {
          title: '采购商',
          dataIndex: 'buyerMerchantName',
          key: 'buyerMerchantName',
          width: 300
        },
        {
          title: '创建人',
          dataIndex: 'createUsername',
          key: 'createUsername',
          width: 200
        },
        {
          title: '合同编号',
          dataIndex: 'contractCode',
          key: 'contractCode',
          width: 200
        },
        {
          title: '合同名称',
          dataIndex: 'contractName',
          key: 'contractName',
          width: 200
        },
        {
          title: '项目编号',
          dataIndex: 'projectCode',
          key: 'projectCode',
          width: 200
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          key: 'projectName',
          width: 200
        },
        {
          title: '操作',
          fixed: 'right',
          // dataIndex: 'active',
          key: 'active',
          width: 100,
          scopedSlots: { customRender: 'active' }
        }
      ]
    }
  },
  methods: {
    callback(e) {
      this.active = e
      this.$refs.orderListTable.refresh(true)
    },
    getStatus(item) {
      this.visible = true
      this.info = item
    },
    search(params) {
      this.queryParams = params
      this.$refs.orderListTable.refresh(true)
      this.exportBtn = this.exportBtn.map((item) => {
        item.params.jsonTxt = params
        return item
      })
    },
    async getList(params) {
      this.exportBtn = this.exportBtn.map((item) => {
        item.params.jsonTxt.orderStatus = this.active
        return item
      })
      const { queryParams, active } = this
      const result = await listSoPage({
        ...queryParams,
        orderStatus: active,
        ...params
      })
      const res = await getBuyerOrderStateCount({
        ...queryParams
      })
      console.log(this.orderStatus)
      const obj = {}
      res.data.forEach((item) => {
        obj[Object.keys(item)[0]] = Object.values(item)[0]
      })
      this.allNum = res.data.reduce((cur, pro) => {
        cur += Object.values(pro)[0]
        return cur
      }, 0)
      this.orderStatusNum = obj
      // this.orderStatusNum = res?.data
      return result
    },
    async getSave(item) {
      this.$refs.batchConfirmationModal.init([item.orderCode])
    },
    async updateStatusFn({ orderCode }, bool) {
      const vm = this
      if (bool) {
        const result = await updateStatus({
          orderStatus: 1031,
          orderCode
        })
        if (result.code === '0') {
          vm.$message.success('订单确认成功')
          vm.$refs.orderListTable.refresh(true)
        }
      } else {
        const result = await updateStatus({
          orderStatus: 1032,
          orderCode
        })
        if (result.code === '0') {
          vm.$message.success('订单驳回成功')
          vm.$refs.orderListTable.refresh(true)
        }
      }
      this.visible = false
      // const vm = this
      // this.$confirm({
      //   title: '确认订单',
      //   okText: '确认订单',
      //   cancelText: '订单驳回',
      //   // content: `导出任务创建成功,任务编码: ${result.data}`,
      //   async onOk() {
      //     const result = await updateStatus({
      //       orderStatus: 1031,
      //       orderCode
      //     })
      //     if (result.code === '0') {
      //       vm.$message.success('订单确认成功')
      //       vm.$refs.orderListTable.refresh(true)
      //     }
      //   },
      //   async onCancel() {
      //     const result = await updateStatus({
      //       orderStatus: 1032,
      //       orderCode
      //     })
      //     if (result.code === '0') {
      //       vm.$message.success('订单驳回成功')
      //       vm.$refs.orderListTable.refresh(true)
      //     }
      //   }
      // })
    },
    batchConfirmation(fn, i) {
      console.log(fn, i)
      const { selectRowKeys } = this
      if (selectRowKeys.length === 0) {
        this.$message.warning('请选择列表数据')
        return
      }
      const vm = this
      this.$confirm({
        title: '确认订单',
        okText: '确认订单',
        cancelText: '订单驳回',
        // content: `导出任务创建成功,任务编码: ${result.data}`,
        async onOk() {
          const result = await batchUpdateOrderStatus({
            status: '1031',
            batchId: selectRowKeys.join(',')
          })
          if (result.code === '0') {
            vm.$message.success('订单确认成功')
            vm.$refs.orderListTable.refresh(true)
          }
        },
        async onCancel() {
          const result = await batchUpdateOrderStatus({
            status: '1032',
            batchId: selectRowKeys.join(',')
          })
          if (result.code === '0') {
            vm.$message.success('订单驳回成功')
            vm.$refs.orderListTable.refresh(true)
          }
        }
      })
    },
    clickFunction(fn, i) {
      this[fn.function](fn, i)
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
    // 查看任务
    viewTasks() {
      this.$refs.viewTask.init()
    },
    // 批量售后
    async batchAudit() {
      const { selectRowKeys } = this
      if (selectRowKeys.length === 0) {
        this.$message.warning('请选择订单')
        return
      }
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
/deep/ .ant-tabs-tabpane {
  margin-bottom: 20px;
}
</style>

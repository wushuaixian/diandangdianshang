<template>
  <div class="orderList">
    <search-header ref="searchHeader" :form="queryParam" />
    <div class="box">
      <div>
        <a-tabs default-active-key="" v-model="queryParam.orderStatus" @change="search">
          <a-tab-pane key="" :tab="`全部`" force-render></a-tab-pane>
          <a-tab-pane v-for="(item, key) in statusList" :key="key" :tab="`${item}(${count[key]})`"></a-tab-pane>
        </a-tabs>
      </div>
      <a-button type="primary" @click="$router.push({ name: 'orderManagementAddBuyerOrderIndex' })">
        创建采购订单
      </a-button>
      <ExportFile style="margin-left: 10px" :mode="ExportOmsWeb" :paramsList="exportParams" />
      <s-table style="margin-top: 10px" rowKey="id" ref="table" :columns="columns" :data="init" :scroll="{ x: 2000 }">
        <template slot="orderCode" slot-scope="props">
          <a @click="GoDetailRead(props)">{{ props.orderCode }}</a>
        </template>
        <a-button type="link" style="min-width: 0; padding: 0 4px" @click="$message.info('暂未开放')">
          调整交期
        </a-button>
        <template slot="opera" slot-scope="props">
          <span>
            <a-popconfirm
              v-if="[1011].includes(Number(props.orderStatus))"
              :getPopupContainer="
                (triggerNode) =>
                  triggerNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                    .parentNode.parentNode
              "
              ok-text="提交"
              cancel-text="取消"
              @confirm="submit(props)"
            >
              <template slot="title"><div style="width: 160px">确定要提交吗？</div></template>
              <a-button type="link" style="min-width: 0; padding: 0 4px">提交</a-button>
            </a-popconfirm>
            <!-- v-if="[1011, 1030, 1041, 1063, 1032].includes(Number(props.orderStatus))" -->
            <a-popconfirm
              v-if="![1050, 1062, 9000].includes(Number(props.orderStatus))"
              :getPopupContainer="
                (triggerNode) =>
                  triggerNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                    .parentNode.parentNode
              "
              ok-text="确定"
              cancel-text="取消"
              @confirm="cancel(props)"
            >
              <template slot="title"><div style="width: 160px">确定要取消吗？</div></template>
              <a-button type="link" style="min-width: 0; padding: 0 4px">取消</a-button>
            </a-popconfirm>
            <!-- <a-popconfirm
              v-if="[].includes(Number(props.orderStatus))"
              :getPopupContainer="
                (triggerNode) =>
                  triggerNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                    .parentNode.parentNode
              "
              ok-text="提交"
              cancel-text="取消"
              @confirm="submit(props)"
            >
              <template slot="title"><div style="width: 160px">确定要提交吗？</div></template>
              <a-button type="link" style="min-width: 0; padding: 0 4px">重新提交</a-button>
            </a-popconfirm> -->

            <!-- v-if="[1011, 1030, 1041, 1063, 1032].includes(Number(props.orderStatus))" -->
            <a-button
              v-if="[1011, 1041, 1063].includes(Number(props.orderStatus))"
              type="link"
              style="min-width: 0; padding: 0 4px"
              @click="edit(props)"
            >
              编辑
            </a-button>
            <!-- <a-button
              v-if="[1050].includes(Number(props.orderStatus))"
              type="link"
              style="min-width: 0; padding: 0 4px"
              @click="adjustment(props)"
            >
              调整交期
            </a-button> -->
          </span>
        </template>
      </s-table>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/orderCenter'
import SearchHeader from './header.vue'
import ExportFile from '@/components/exportFile'
import { ExportOmsWeb } from '@/api/fince'
import moment from 'moment'
const columns = [
  { title: '订单来源', key: 'purchaseOrderSourceStr', dataIndex: 'purchaseOrderSourceStr' },
  { title: '订单状态', key: 'orderStatusString', dataIndex: 'orderStatusString' },
  { title: '订单编号', key: 'orderCode', scopedSlots: { customRender: 'orderCode' } },
  { title: '订单时间', key: 'orderCreateTime', dataIndex: 'orderCreateTime' },
  { title: '订单数量', key: 'productItemNum', dataIndex: 'productItemNum' },
  { title: '未税总价', key: 'priceAmountWith', dataIndex: 'priceAmountWith' },
  { title: '含税总价', key: 'orderAmount', dataIndex: 'orderAmount' },
  { title: '采购商', key: 'buyerMerchantName', dataIndex: 'buyerMerchantName' },
  { title: '创建人', key: 'createUsername', dataIndex: 'createUsername' },
  { title: '供应商名称', key: 'merchantName', dataIndex: 'merchantName' },
  {
    title: '合同名称',
    key: 'contractName',
    dataIndex: 'contractName',
    customRender: (text, item) => {
      if (item.purchaseOrderSource === 4) {
        return item.contractName
      } else {
        return ''
      }
    }
  },
  {
    title: '合同编码',
    key: 'contractCode',
    dataIndex: 'contractCode',
    customRender: (text, item) => {
      if (item.purchaseOrderSource === 4) {
        return item.contractCode
      } else {
        return ''
      }
    }
  },
  {
    title: '项目名称',
    key: 'projectName',
    dataIndex: 'projectName',
    customRender: (text, item) => {
      if (item.purchaseOrderSource === 3) {
        return item.projectName
      } else {
        return ''
      }
    }
  },
  {
    title: '项目编码',
    key: 'projectCode',
    dataIndex: 'projectCode',
    customRender: (text, item) => {
      if (item.purchaseOrderSource === 3) {
        return item.projectCode
      } else {
        return ''
      }
    }
  },
  { title: '操作', fixed: 'right', width: 150, key: 'opera', scopedSlots: { customRender: 'opera' } }
]
export default {
  components: { SearchHeader, ExportFile },
  data() {
    return {
      ExportOmsWeb,
      statusList: {
        1030: '（供方）待确认',
        1041: '（供方）已驳回',
        1050: '待审核',
        1062: '审核通过',
        1063: '审核驳回',
        9000: '已取消',
        1011: '待提交'
      },
      columns,
      count: { 1030: 0, 1041: 0, 1050: 0, 1062: 0, 1063: 0, 9000: 0, 1011: 0, total: 0 },
      queryParam: {
        orderStatus: '',
        orderCode: '',
        merchantId: undefined,
        purchaseOrderSource: '',
        materialName: '',
        standard: '',
        orderCreateTime: null,
        contractCode: '',
        contractName: '',
        buyerUserName: '',
        projectCode: '',
        projectName: ''
      },
      exportParams: [
        {
          name: '导出订单',
          params: {
            templateCode: 'quyerOrderListPageExport',
            jsonTxt: {},
            exportType: 'exportQuyerOrderListPage',
            fileName: '采购订单导出',
            taskType: 'exportQuyerOrderListPage'
          }
        },
        {
          name: '导出订单行',
          params: {
            templateCode: 'quyerOrderLineListPageExport',
            jsonTxt: {},
            exportType: 'exportQuyerOrderLineListPage',
            fileName: '采购订单行导出',
            taskType: 'exportQuyerOrderLineListPage '
          }
        }
      ]
    }
  },
  methods: {
    selIndex() {},
    async init(params) {
      const formData = {
        ...params,
        ...this.queryParam,
        startOrderCreateTime:
          this.queryParam?.orderCreateTime?.length > 0 && this.queryParam?.orderCreateTime[0]
            ? moment(this.queryParam.orderCreateTime[0]).format('yyyy-MM-DD') + ' 00:00:00'
            : null,
        endOrderCreateTime:
          this.queryParam?.orderCreateTime?.length > 0 && this.queryParam?.orderCreateTime[0]
            ? moment(this.queryParam.orderCreateTime[1]).format('yyyy-MM-DD') + ' 23:59:59'
            : null
      }
      this.exportParams[0].params.jsonTxt = formData
      this.exportParams[1].params.jsonTxt = formData
      this.BindCount({ ...formData, orderStatus: '' })
      return api.getBuyerOrderList(formData)
    },
    BindCount(formData) {
      api.getBuyerOrderStateCount(formData).then((res) => {
        if (res.code === '0') {
          for (let i = 0; i < res.data.length; i++) {
            for (const key in res.data[i]) {
              this.count[key] = res.data[i][key]
            }
          }
        }
      })
    },
    search() {
      this.$refs.table.refresh(true)
    },
    clear() {
      this.$refs.searchHeader.$refs.basicforms.resetFields()
      this.search()
    },
    cancel(item) {
      api
        .setCancelBuyerOrder({ id: item.id, orderCode: item.orderCode, orderCanceOperateType: 0, cancelSource: 0 })
        .then((res) => {
          if (res.code === '0') {
            this.$message.success('取消成功')
            this.$refs.table.refresh(false)
          }
        })
    },
    submit(item) {
      api.setSubmitBuyerOrder({ orderCode: item.orderCode, orderStatus: 1030 }).then((res) => {
        if (res.code === '0') {
          this.$message.success('提交审核成功')
          this.$refs.table.refresh(false)
        }
      })
    },
    adjustment(item) {
      this.$router.push({
        name: 'orderManagementBuyerOrderDetail',
        query: { orderCode: item.orderCode, type: 'readAdjustment' }
      })
    },
    edit(item) {
      this.$router.push({ name: 'orderManagementBuyerOrderDetail', query: { orderCode: item.orderCode } })
    },
    GoDetailRead(item) {
      this.$router.push({ name: 'orderManagementBuyerOrderDetail', query: { orderCode: item.orderCode, type: 'read' } })
    }
  }
}
</script>
<style lang="less" scoped>
.orderList {
  .box {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    padding: 24px;
    margin: 24px 0;
  }
}
</style>

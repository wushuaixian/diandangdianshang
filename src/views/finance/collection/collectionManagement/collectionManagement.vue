<template>
  <div class="appeal-manage-list">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper-custom">
        <a-form-model
          layout="inline"
          ref="ruleForm"
          :model="queryParam"
          v-bind="{
            labelCol: { span: 5 },
            wrapperCol: { span: 16 }
          }"
        >
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="收款单号" prop="receiptBillCode">
                <a-input placeholder="请输入收款单号" class="input" v-model="queryParam.receiptBillCode" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="汇款识别码" prop="receiptSerial">
                <a-input placeholder="请输入汇款识别码" class="input" v-model="queryParam.receiptSerial" />
              </a-form-model-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24">
              <a-form-model-item label="单据状态" prop="billStatus">
                <a-select
                  class="input"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  v-model="queryParam.billStatus"
                  :options="state"
                  default-value="0"
                ></a-select>
              </a-form-model-item>
            </a-col>-->
            <a-col :md="8" :sm="24">
              <a-form-model-item label="交易类型" prop="sceneType">
                <a-select
                  class="input"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  v-model="queryParam.sceneType"
                  :options="sceneType1"
                  placeholder="请选择交易类型"
                  default-value="0"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="支付方式" prop="paymentMethod">
                <a-select
                  class="input"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  v-model="queryParam.paymentMethod"
                  :options="paymentMethod"
                  default-value="0"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="付款单位" prop="merchantName">
                <a-select
                  class="input"
                  v-model="queryParam.merchantName"
                  show-search
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  @search="handleSearch"
                  placeholder="请输入付款单位"
                  :allowClear="true"
                  :getPopupContainer="
                    (triggerNode) => {
                      return triggerNode.parentNode || document.body
                    }
                  "
                >
                  <a-select-option v-for="item in searchMerchantLis" :key="item.value" :value="item.settleObjName">{{
                    item.settleObjName
                  }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="创建时间" prop="createTime">
                <a-range-picker class="input" style="width: 100%" v-model="queryParam.createTime" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="订单编号" prop="orderCode">
                <a-input placeholder="请输入订单编号" class="input" v-model="queryParam.orderCode" />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :sm="24" class="button">
              <a-button @click="handleReset">重置</a-button>
              <a-button type="primary" @click="search">查询</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>

    <a-card>
      <div>
        <a-tabs :active-key="activeKey" @change="callback">
          <a-tab-pane
            key=""
            :tab="`全部(${$$(billStatusCount.find((v) => v.billStatus == 0)).number || 0})`"
          ></a-tab-pane>
          <a-tab-pane
            key="1"
            :tab="`收款中(${$$(billStatusCount.find((v) => v.billStatus == 1)).number || 0})`"
            force-render
          ></a-tab-pane>
          <a-tab-pane
            key="2"
            :tab="`待确认(${$$(billStatusCount.find((v) => v.billStatus == 2)).number || 0})`"
            force-render
          ></a-tab-pane>
          <a-tab-pane
            key="3"
            :tab="`已完成(${$$(billStatusCount.find((v) => v.billStatus == 3)).number || 0})`"
            force-render
          ></a-tab-pane>
          <a-tab-pane
            key="4"
            :tab="`已关闭(${$$(billStatusCount.find((v) => v.billStatus == 4)).number || 0})`"
            force-render
          ></a-tab-pane>
        </a-tabs>
      </div>
      <div class="buttonAraay">
        <a-button class="button1" @click="exportFile">导出</a-button>
        <a-button class="button1" @click="viewTasksVisible = true">查看任务</a-button>
      </div>
      <s-table
        name="collectionManagementTable"
        style="margin-top: 10px"
        rowKey="id"
        ref="table"
        :columns="columns"
        :data="getReceipt"
        :scroll="{ x: 2600 }"
      >
        <template v-slot:receiptBillCode="props">
          <div class="enterpriseName" @click="jumpDetails(props)">{{ props.receiptBillCode }}</div>
        </template>
        <template v-slot:billStatus="text">
          <span v-show="text.billStatus == 1">收款中</span>
          <span v-show="text.billStatus == 2">待确认</span>
          <span v-show="text.billStatus == 3">已完成</span>
          <span v-show="text.billStatus == 4">已关闭</span>
        </template>
        <template v-slot:paymentMethod="text">
          <span v-show="text.paymentMethod == 1">银联</span>
          <span v-show="text.paymentMethod == 2">账户</span>
          <span v-show="text.paymentMethod == 3">微信</span>
          <span v-show="text.paymentMethod == 4">支付宝</span>
          <span v-show="text.paymentMethod == 5">线下打款</span>
          <span v-show="text.paymentMethod == 6">保证金划扣</span>
        </template>
        <template v-slot:sceneType="text">
          <span v-show="text.sceneType == 1">套餐费</span>
          <span v-show="text.sceneType == 11">寻源保证金</span>
          <span v-show="text.sceneType == 12">标书费</span>
          <span v-show="text.sceneType == 13">平台保证金</span>
        </template>
        <template #paymentState="text">
          <span>
            <span v-show="text.paymentState == 1">未支付</span>
            <span v-show="text.paymentState == 2">已支付</span>
          </span>
        </template>
        <template v-slot:createTime="props">{{ props.createTime | moment('YYYY-MM-DD HH:mm:ss') }}</template>
        <template slot="feeAmt" slot-scope="text"> {{ text.feeAmt | formatCurrency(2, true) }} </template>
        <template v-slot:action="text">
          <a
            v-if="checkIsFactoryInspection(text)"
            @click="factoryInspection(text)"
            class="bluetext"
            style="color: #1890ff"
          >
            确认收款
          </a>
          <!-- <span
            v-if="text.billStatus == 3"
            @click="factoryInspectionID(text)"
            class="bluetext"
            style="color: #1890FF;"
          >申请开票</span>-->
        </template>
      </s-table>
    </a-card>
    <Received ref="received" @ok="$refs.table.refresh()" />
    <!-- <Void  /> -->
    <SystemctlTips :visible="systemctlTipsVisible" @close="systemctlTipsVisible = false" :code="exportCode" />
    <ViewTasks :visible="viewTasksVisible" @close="viewTasksVisible = false" taskType="operationReceiptManageExport" />
  </div>
</template>

<script>
import SystemctlTips from '@/components/exportFile/systemctlTips'
import ViewTasks from '@/components/exportFile/viewTasks'
import { getReceipt } from '@/api/receipt'
import { feeBillManageImplExport, exportId } from '@/api/fince'
import { Received } from './components'
import { queryMerchantLikeName } from '@/api/custom'
import _ from 'loadsh'
export default {
  components: { Received, SystemctlTips, ViewTasks },
  data() {
    return {
      viewTasksVisible: false,
      systemctlTipsVisible: false,
      exportCode: 0,
      searchMerchantLis: [], // 搜索下拉框值
      colorList: ['orange', 'blue', 'red'],
      activeKey: '',
      jsonTxt: {},
      feeBillManageImplExport,
      sceneType1: [
        {
          label: '全部',
          value: '0'
        },
        {
          label: '套餐费',
          value: '1'
        },
        {
          label: '寻源保证金',
          value: '11'
        },
        {
          label: '标书费',
          value: '12'
        },
        {
          label: '平台保证金',
          value: '13'
        }
      ],
      state: [
        {
          label: '全部',
          value: '0'
        },
        {
          label: '收款中',
          value: '1'
        },
        {
          label: '待确认',
          value: '2'
        },
        {
          label: '已完成',
          value: '3'
        },
        {
          label: '已关闭',
          value: '4'
        }
      ],
      paymentMethod: [
        {
          label: '全部',
          value: '0'
        },
        {
          label: '银联',
          value: '1'
        },
        {
          label: '账户',
          value: '2'
        },
        {
          label: '微信',
          value: '3'
        },
        {
          label: '支付宝',
          value: '4'
        },
        {
          label: '线下打款',
          value: '5'
        },
        {
          label: '保证金划扣',
          value: '6'
        }
      ],
      Company: [],
      transaction: [],
      columns: [
        { title: '收款单号', key: 'receiptBillCode', scopedSlots: { customRender: 'receiptBillCode' } },
        {
          title: '付款单号',
          key: 'paymentBillCode',
          dataIndex: 'paymentBillCode'
        },
        {
          title: '订单编号',
          key: 'orderCode',
          dataIndex: 'orderCode'
        },
        { title: '收款金额(元)', key: 'feeAmt', scopedSlots: { customRender: 'feeAmt' }, width: 150 },
        { title: '付款单位', key: 'merchantName', dataIndex: 'merchantName', width: 260 },
        { title: '单据状态', key: 'billStatus', scopedSlots: { customRender: 'billStatus' }, width: 150 },
        { title: '支付流水号', key: 'settlementCode', dataIndex: 'settlementCode', width: 200 },
        { title: '支付方式', key: 'paymentMethod', scopedSlots: { customRender: 'paymentMethod' }, width: 150 },
        { title: '支付状态', key: 'paymentState', scopedSlots: { customRender: 'paymentState' }, width: 150 },
        { title: '交易类型', key: 'sceneType', scopedSlots: { customRender: 'sceneType' }, width: 150 },
        { title: '汇款识别码', key: 'receiptSerial', dataIndex: 'receiptSerial', width: 200 },
        { title: '创建时间', key: 'createTime', scopedSlots: { customRender: 'createTime' }, width: 200 },
        { title: '备注', key: 'remark', dataIndex: 'remark' },
        {
          title: '操作',
          fixed: 'right',
          width: 120,
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      queryParam: {
        time: null,
        paymentBillCode: null,
        // PayeeName: null,
        sceneType: '0',
        billStatus: '',
        paymentMethod: '0',
        beginTime: '',
        endTime: '',
        merchantName: [],
        createTime: null,
        receiptBillCode: '',
        receiptSerial: '',
        orderCode: ''
      },
      advanced: false,
      // list: [],
      total: '',
      billStatusCount: []
      // billStatus: ''
    }
  },
  mounted() {
    this.queryMerchantLikeName()
  },
  methods: {
    exportFile() {
      const that = this
      this.jsonTxt.itemsPerPage = 1000
      this.jsonTxt.currentPage = 1
      const jsonTxt = JSON.stringify(this.jsonTxt)
      feeBillManageImplExport({
        templateCode: 'operationReceiptManageExport',
        jsonTxt,
        exportType: 'exportInvoiceInfoList',
        fileName: '收款管理列表'
      }).then((res) => {
        if (res.code === '0') {
          exportId({ taskType: 'operationReceiptManageExport' }).then((res) => {
            if (res.code === '0') {
              that.systemctlTipsVisible = true
              that.exportCode = res.data
            }
          })
        }
      })
    },
    callback(key) {
      // console.log(key)
      this.queryParam.billStatus = key
      this.$refs.table.refresh(true)
      this.search()
    },
    // 获取列表
    async getReceipt(pagination) {
      const { queryParam } = this
      const data = {
        ...pagination,
        ...queryParam
      }
      if (data.createTime) {
        const [beginTime, endTime] = data.createTime
        data.beginTime = beginTime
        data.endTime = endTime
        // console.log(data.createTime)
      }
      if (typeof data.merchantName === 'object') {
        data.merchantName = ''
      }
      if (this.$hasOpeerate()) {
        data.merchantStatus = 0
      }
      this.jsonTxt = { ...data }
      const data2 = getReceipt({ ...data })
      data2.then((res) => {
        if (res.code === '0') {
          if (res.data.billStatusCount) {
            this.billStatusCount = res.data.billStatusCount
          } else {
            this.billStatusCount = []
          }
          this.total = res.data.total
          res.data.listObj.forEach((item) => {
            item.feeAmt = item.feeAmt.toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
          })
        }
      })
      return data2
    },
    async queryMerchantLikeName() {
      const data2 = await queryMerchantLikeName()
      this.searchMerchantLis = data2.data
      return data2
    },
    handleSearch(settleObjName) {
      if (!settleObjName.trim()) return
      _.debounce(async () => {
        const res = await queryMerchantLikeName({ settleObjName })
        if (res.code === '0') {
          // console.log(res.data)
          this.searchMerchantLis = res?.data
        }
      }, 1000)()
    },
    handleReset() {
      this.searchMerchantLis = []
      this.queryParam.merchantName = ''
      this.$refs.ruleForm.resetFields()
      this.search()
      this.queryMerchantLikeName()
    },
    // 查询
    search() {
      this.activeKey = this.queryParam.billStatus
      this.$refs.table.refresh(true)
    },
    jumpDetails(value) {
      // console.log(value)
      this.$router.push({
        name: 'SysCollectionDetail',
        params: {
          id: value.id
        }
      })
    },
    // 申请开票
    factoryInspectionID(value) {
      this.$router.push({
        name: 'supplieInvoiceHome',
        params: {
          id: value.paymentBillCode
        }
      })
    },
    // 确认收款
    factoryInspection(value) {
      this.$refs['received'].init(value)
    },
    // 是否可确认收款
    checkIsFactoryInspection(text) {
      return (
        (text.paymentMethod === 5 && text.receiptSerial !== '' && text.billStatus === 1) ||
        (text.paymentMethod === 5 && text.billStatus === 1) ||
        (text.paymentMethod === 5 && text.receiptSerial !== '' && text.billStatus === 2)
      )
    }
  }
}
</script>

<style lang="less" scoped>
.appeal-manage-list {
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .button {
    text-align: center;
  }
  .enterpriseName {
    color: #ff6b00;
    cursor: pointer;
  }
  .input {
    margin-left: 10px;
  }
}
.buttonAraay {
  margin-bottom: 10px;
  .button1 {
    width: 100px;
    margin-right: 10px;
  }
}
</style>

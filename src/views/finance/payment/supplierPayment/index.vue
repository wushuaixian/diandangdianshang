
<template>
  <div class="appeal-manage-list">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-row>
                <a-col :span="8">
                  <a-form-model-item style="margin-right: 10px" prop="oddNumbers">
                    <a-select
                      :key="keys"
                      @change="handleChange"
                      allowClear
                      v-model="queryParam.oddNumbers"
                      :options="oddNumbers"
                      placeholder="请选择"
                    ></a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="16">
                  <a-form-model-item label>
                    <a-input v-model="queryParam[queryParam.oddNumbers]" placeholder="请输入单号" />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="单据来源" prop="createType">
                <a-select
                  :key="keys"
                  v-model="queryParam.createType"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  :options="bill"
                  placeholder="请选择"
                  style="width: 210px"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="创建时间" prop="time">
                <a-range-picker style="width: 210px" v-model="queryParam.time" />
              </a-form-model-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24">
              <a-form-model-item style="margin-left: 40px" label="单据状态" prop="state">
                <a-select
                  :key="keys"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  @change="billStatuss"
                  :options="state"
                  placeholder="请选择"
                  style="width: 210px"
                ></a-select>
              </a-form-model-item>
            </a-col>-->
            <a-col :md="8" :sm="24">
              <a-form-model-item label="交易类型" prop="sceneType">
                <a-select
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  :key="keys"
                  v-model="queryParam.sceneType"
                  :options="transaction"
                  placeholder="请选择"
                  style="width: 210px"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="支付状态" prop="paymentState">
                <a-select
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  :key="keys"
                  v-model="queryParam.paymentState"
                  :options="payment"
                  placeholder="请选择"
                  style="width: 210px"
                ></a-select>
              </a-form-model-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-model-item label="支付方式" prop="paymentMethod">
                <a-select
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  :key="keys"
                  v-model="queryParam.paymentMethod"
                  :options="mode"
                  placeholder="请选择"
                  style="width: 210px"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24">
              <a-form-model-item label="收款单位" prop="Company">
                <a-select
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  :key="keys"
                  @change="paymentMethods"
                  :options="Company"
                  placeholder="请选择"
                  style="width: 210px"
                ></a-select>
              </a-form-model-item>
            </a-col>-->

            <a-col :md="8" :sm="24">
              <a-form-model-item label="收款单位" prop="settleObjName">
                <a-select
                  style="width: 210px"
                  class="input"
                  v-model="queryParam.settleObjName"
                  show-search
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  @search="handleSearch"
                  placeholder="请输入收款单位"
                  :allowClear="true"
                  :getPopupContainer="
                    (triggerNode) => {
                      return triggerNode.parentNode || document.body
                    }
                  "
                >
                  <a-select-option v-for="item in searchMerchantLis" :key="item.value" :value="item.settleObjName">
                    {{ item.settleObjName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item style="margin-left: 14px" label="创建人" prop="createUsername">
                <a-input v-model="queryParam.createUsername" style="width: 210px" placeholder="请输入创建人" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="订单编号" prop="orderCode">
                <a-input v-model="queryParam.orderCode" style="width: 210px" placeholder="请输入订单编号" />
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
        <a-tabs default-active-key @change="callback">
          <a-tab-pane key :tab="`全部(${billStatusCount.length > 0 ? billStatusCount[0].number : 0})`"></a-tab-pane>
          <a-tab-pane
            key="1"
            :tab="`待审核(${billStatusCount.length > 0 ? billStatusCount[1].number : 0})`"
            force-render
          ></a-tab-pane>
          <a-tab-pane
            key="2"
            :tab="`审核不通过(${billStatusCount.length > 0 ? billStatusCount[2].number : 0})`"
            force-render
          ></a-tab-pane>
          <a-tab-pane
            key="6"
            :tab="`付款中(${billStatusCount.length > 0 ? billStatusCount[6].number : 0})`"
          ></a-tab-pane>
          <a-tab-pane
            key="7"
            :tab="`待确认(${billStatusCount.length > 0 ? billStatusCount[7].number : 0})`"
          ></a-tab-pane>
          <a-tab-pane
            key="8"
            :tab="`已完成(${billStatusCount.length > 0 ? billStatusCount[8].number : 0})`"
          ></a-tab-pane>
          <a-tab-pane
            key="9"
            :tab="`已关闭(${billStatusCount.length > 0 ? billStatusCount[9].number : 0})`"
          ></a-tab-pane>
        </a-tabs>
      </div>
      <div class="buttonAraay">
        <a-button
          v-if="$hasOpeerate()"
          @click="merge"
          style="margin-right: 10px"
          :disabled="selectedRowKeys.length <= 0"
        >
          合并付款
        </a-button>
        <a-button class="button1" @click="exportFile">导出</a-button>
        <a-button class="button1" @click="viewTasksVisible = true">查看任务</a-button>
      </div>
      <s-table
        name="suppliePaymentTable"
        style="margin-top: 10px"
        :row-selection="{
          onChange: onSelectChange,
          selectedRowKeys: selectedRowKeys,
          getCheckboxProps: getCheckboxProps
        }"
        rowKey="id"
        ref="table"
        :columns="columns"
        :data="Payment"
        :scroll="{ x: 3000 }"
      >
        <template slot="paymentBillCode" slot-scope="record">
          <a @click="code(record)">{{ record.paymentBillCode }}</a>
        </template>
        <template slot="feeAmt" slot-scope="record">
          <span>{{ record.feeAmt | formatCurrency(2, true) }}</span>
        </template>
        <template slot="cene" slot-scope="sceneType">
          <span v-show="sceneType === 14">寻源保证金退还</span>
          <span v-show="sceneType === 1">套餐费</span>
          <span v-show="sceneType === 12">标书费</span>
          <span v-show="sceneType === 13">平台保证金</span>
          <span v-show="sceneType === 11">寻源保证金</span>
          <span v-show="sceneType === 16">罚款</span>
          <span v-show="sceneType === 15">平台保证金退还</span>
        </template>

        <template slot="bill" slot-scope="billStatus">
          <span v-show="billStatus === 1">待审核</span>
          <span v-show="billStatus === 2">审核驳回</span>
          <span v-show="billStatus === 6">付款中</span>
          <span v-show="billStatus === 7">待确认</span>
          <span v-show="billStatus === 8">已完成</span>
          <span v-show="billStatus === 9">已关闭</span>
        </template>
        <template slot="payment" slot-scope="paymentMethod">
          <span v-show="paymentMethod === 1">网银支付</span>
          <span v-show="paymentMethod === 4">支付宝</span>
          <span v-show="paymentMethod === 3">微信</span>
          <span v-show="paymentMethod === 2">余额</span>
          <span v-show="paymentMethod === 5">线下转账</span>
          <span v-show="paymentMethod === 6">保证金划扣</span>
        </template>
        <template slot="state" slot-scope="paymentState">
          <span v-show="paymentState === 1">未支付</span>
          <span v-show="paymentState === 2">已支付</span>
        </template>
        <template slot="action" slot-scope="text">
          <!-- <a v-show="text.billStatus === 1" @click="examine">审核</a> -->
          <a v-show="text.billStatus === 6 && !text.paymentSerial" @click="Cashier(text)">付款</a>
          <a v-show="text.billStatus === 6 && text.paymentSerial" @click="code(text)">上传凭证</a>
        </template>
        <template slot="time" slot-scope="createTime">
          <span>{{ createTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </s-table>
    </a-card>
    <Examine ref="examine" />
    <GoActivation :visible="goActivationVisible" @Deactivation="Deactivation" @close="goActivationVisible = false" />
    <GoBankCard :visible="goBankCardVisible" @close="goBankCardVisible = false" />
    <Popup
      :visible="popupVisible"
      :statusNum="statusNum"
      @close="popupVisible = false"
      :getPhone="getPhone"
      @resetStatus="resetStatus"
      stop="stop"
    />
    <SingContract :visible="singContractVisible" @close="closeSingContract" :url="url" />
    <SystemctlTips :visible="systemctlTipsVisible" @close="systemctlTipsVisible = false" :code="exportCode" />
    <ViewTasks :visible="viewTasksVisible" @close="viewTasksVisible = false" taskType="ddbMerchantManageExport" />
  </div>
</template>

<script>
import SystemctlTips from '@/components/exportFile/systemctlTips'
import ViewTasks from '@/components/exportFile/viewTasks'
import Popup from '@/views/finance/suppliers/paymentManagement/Popup'
import SingContract from '@/views/finance/suppliers/paymentManagement/signContract'
import GoBankCard from '@/views/Suppliers/package/goBankCard'
import GoActivation from '@/views/Suppliers/package/goActivation'
import Examine from '../paymentDetails/components/examine'
import {
  accountStatus,
  queryFincePhone,
  signAContract,
  paymentManagementStatus,
  feeBillManageImplExport,
  mergePayment,
  exportId
} from '@/api/fince.js'
import { Payment } from '@/api/invoice'
import { queryMerchantLikeName } from '@/api/custom'
import _ from 'loadsh'
export default {
  components: {
    Examine,
    GoBankCard,
    GoActivation,
    Popup,
    SingContract,
    SystemctlTips,
    ViewTasks
  },
  data() {
    return {
      systemctlTipsVisible: false,
      viewTasksVisible: false,
      popupVisible: false,
      statusNum: 1,
      getPhone: '',
      singContractVisible: false,
      CallbackStatus: null,
      status: true,
      url: '',
      searchMerchantLis: [], // 搜索下拉框值
      goBankCardVisible: false,
      goActivationVisible: false,
      isRecharge: false,
      exportCode: 0,
      jsonTxt: {},
      oddNumbers: [
        {
          label: '付款单号',
          value: 'paymentBillCode'
        },
        {
          label: '应付单号',
          value: 'feeBillCode'
        }
      ],
      bill: [
        {
          label: '手工',
          value: '0'
        },
        {
          label: '自动',
          value: '1'
        }
      ],
      state: [
        {
          label: '待审核',
          value: '1'
        },
        {
          label: '付款中',
          value: '6'
        },
        {
          label: '待确认',
          value: '7'
        },
        {
          label: '已完成',
          value: '8'
        },
        {
          label: '已关闭',
          value: '9'
        }
      ],
      transaction: [
        {
          label: '寻源保证金退还',
          value: '14'
        },
        {
          label: '平台保证金退还',
          value: '15'
        },
        {
          label: '套餐费',
          value: '1'
        },
        {
          label: '标书费',
          value: '12'
        },
        {
          label: '平台保证金',
          value: '13'
        },
        {
          label: '寻源保证金',
          value: '11'
        },
        {
          label: '罚款',
          value: '16'
        }
      ],
      payment: [
        {
          label: '已支付',
          value: '2'
        },
        {
          label: '未支付',
          value: '1'
        }
      ],
      mode: [
        {
          label: '网银支付',
          value: '1'
        },
        {
          label: '余额',
          value: '2'
        },
        {
          label: '余额、网银支付组合支付',
          value: '12'
        },
        {
          label: '支付宝',
          value: '4'
        },
        {
          label: '微信',
          value: '3'
        },
        {
          label: '线下转账',
          value: '5'
        },
        {
          label: '保证金划扣',
          value: '6'
        }
      ],
      Company: [
        {
          label: '网关支付',
          value: '0'
        },
        {
          label: '支付宝',
          value: '1'
        },
        {
          label: '微信',
          value: '2'
        },
        {
          label: '余额',
          value: '3'
        },
        {
          label: '线下转账',
          value: '4'
        }
      ],
      options: [
        {
          label: '待处理',
          value: '0'
        },
        {
          label: '已处理',
          value: '1'
        },
        {
          label: '驳回',
          value: '2'
        }
      ],
      selectedRowKeys: [],
      columns: [
        {
          title: '付款单号',
          align: 'center',
          key: 'paymentBillCode',
          scopedSlots: { customRender: 'paymentBillCode' }
        },
        {
          title: '订单编号',
          align: 'center',
          dataIndex: 'paymentCode'
        },
        {
          title: '交易类型',
          align: 'center',
          dataIndex: 'sceneType',
          scopedSlots: { customRender: 'cene' }
        },
        { title: '摘要', ellipsis: true, dataIndex: 'summary' },
        { title: '付款金额(元)', key: 'feeAmt', scopedSlots: { customRender: 'feeAmt' } },
        {
          title: '收款单位',
          ellipsis: true,
          align: 'center',
          dataIndex: 'settleObjName'
        },
        {
          title: '单据状态',
          ellipsis: true,
          dataIndex: 'billStatus',
          key: 'billStatus',
          scopedSlots: { customRender: 'bill' }
        },
        { title: '应付单号', width: 155, align: 'center', dataIndex: 'feeBillCode' },
        {
          title: '支付方式',
          align: 'center',
          key: 'paymentMethod',
          dataIndex: 'paymentMethod',
          scopedSlots: { customRender: 'payment' }
        },
        {
          title: '支付状态',
          align: 'center',
          key: 'paymentState',
          dataIndex: 'paymentState',
          scopedSlots: { customRender: 'state' }
        },
        { title: '支付流水号', align: 'center', dataIndex: 'settlementCode' },
        { title: '创建人', dataIndex: 'createUsername' },
        {
          title: '创建时间',
          key: 'createTime',
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'time' }
        },

        { title: '备注', key: 'remark' },
        {
          title: '操作',
          key: 'operation',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      queryParam: {
        paymentBillCode: null,
        createType: [],
        time: null,
        billStatus: null,
        sceneType: [],
        paymentState: [],
        paymentMethod: [],
        createUsername: null,
        merchantStatus: this.$hasOpeerate() ? '0' : null,
        settleObjName: [],
        oddNumbers: [],
        orderCode: null
      },
      advanced: false,
      list: [],
      billStatusCount: [],
      total: '',
      keys: 1,
      listObj: []
    }
  },
  mounted() {
    this.queryMerchantLikeName()
    if (this.$route.params.id) {
      this.$set(this.queryParam, 'id', this.$route.params.id)
      this.search()
    }
    accountStatus().then((res) => {
      if (res.code === '0') {
        const { password, phone, protocol } = res.data
        this.isRecharge = password && phone && protocol
      }
    })
  },
  methods: {
    // 点击付款跳转收银台
    Cashier(text) {
      if (!this.isRecharge) {
        // this.Deactivation()
        this.goActivationVisible = true
        // this.$router.push({
        //   name: 'FinanceSuppliersdeactivation'
        // })
      } else {
        // if (this.$hasOpeerate()) {
        //   name = 'SysFinancePaymentCashier'
        // } else {
        //   name = 'FinancePaymentCashier'
        // }
        const name = 'FinancePaymentCashier'

        this.$router.push({
          name,
          params: {
            id: text.sceneType,
            orderCode: text.paymentCode,
            paymentBalance: text.feeAmt,
            payerType: 2,
            paymentBillCode: text.paymentBillCode,
            mergePaymentType: 0
          }
        })
      }
    },
    getCheckboxProps(record) {
      return {
        props: {
          disabled: !(record.billStatus === 6 && !record.paymentSerial && record.sceneType === 15)
        }
      }
    },
    async queryMerchantLikeName() {
      const data2 = await queryMerchantLikeName()
      this.searchMerchantLis = data2.data
      return data2
    },
    merge() {
      mergePayment(this.selectedRowKeys).then((res) => {
        if (res.code === '0') {
          let feeAmt = 0
          for (let i = 0; i < this.selectedRowKeys.length; i++) {
            feeAmt += this.listObj.find((item) => item.id === this.selectedRowKeys[i]).feeAmt
          }
          const name = 'FinancePaymentCashier'
          this.$router.push({
            name,
            params: {
              id: 15,
              orderCode: res.data,
              paymentBalance: feeAmt,
              payerType: 2,
              paymentBillCode: 0,
              mergePaymentType: 15
            }
          })
        }
      })
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
      this.queryParam.paymentBillCode = null
      this.queryParam.feeBillCode = null
      this.searchMerchantLis = []
      this.queryParam.merchantName = ''
      this.$refs.ruleForm.resetFields()
      this.search()
      this.queryMerchantLikeName()
    },
    code(text) {
      this.$router.push({
        name: !this.$hasOpeerate() ? 'SuppliersPaymentManageDetail' : 'SysPaymentManageDetail',
        params: {
          id: text.id
        }
      })
    },
    // 点击切换
    callback(key) {
      this.queryParam.billStatus = key
      this.$refs.table.refresh(true)
    },
    exportFile() {
      const that = this
      this.jsonTxt.itemsPerPage = 1000
      this.jsonTxt.currentPage = 1
      const jsonTxt = JSON.stringify(this.jsonTxt)
      feeBillManageImplExport({
        templateCode: 'ddbMerchantManageExport',
        jsonTxt,
        exportType: 'exportInvoiceInfoList',
        fileName: '付款管理列表'
      }).then((res) => {
        if (res.code === '0') {
          exportId({ taskType: 'ddbMerchantManageExport' }).then((res) => {
            if (res.code === '0') {
              that.systemctlTipsVisible = true
              that.exportCode = res.data
            }
          })
        }
      })
    },
    examine() {
      this.$refs.examine.visible = true
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleChange(value) {
      const { value: key } = this.oddNumbers.find((x) => x.value !== value)
      Reflect.has(this.queryParam, key) && Reflect.deleteProperty(this.queryParam, key)
    },
    // 获取列表 receiptCreate
    async Payment(pagination) {
      const { queryParam } = this
      const data = {
        ...pagination,
        ...queryParam
      }
      if (data.time) {
        const [beginTime, endTime] = data.time
        data.beginTime = beginTime
        data.endTime = endTime
      }
      if (typeof data.sceneType === 'object') {
        data.sceneType = null
      }
      if (typeof data.oddNumbers === 'object') {
        data.oddNumbers = null
      }
      if (typeof data.paymentState === 'object') {
        data.paymentState = null
      }
      if (typeof data.paymentMethod === 'object') {
        data.paymentMethod = null
      }
      if (typeof data.createType === 'object') {
        data.createType = null
      }
      if (typeof data.settleObjName === 'object') {
        data.settleObjName = ''
      }
      this.jsonTxt = { ...data }
      const res = Payment({ ...data })
      res.then((res) => {
        if (res.code === '0') {
          this.listObj = res.data.listObj
          const newData = JSON.parse(JSON.stringify(res))
          this.total = newData.data.total
          this.billStatusCount = newData.data.billStatusCount
          newData.data.listObj.forEach((item) => {
            item.feeAmt = item.feeAmt.toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
          })
        }
      })
      return res
    },
    // handleReset() {
    //   this.keys++
    //   this.queryParam = {
    //     paymentBillCode: null,
    //     createType: null,
    //     time: null,
    //     billStatus: null,
    //     sceneType: null,
    //     paymentState: null,
    //     paymentMethod: null,
    //     createUsername: null
    //   }
    //   this.$refs.ruleForm.resetFields()
    // },
    billStatuss(v) {
      this.queryParam.billStatus = v
    },
    paymentMethods(v) {
      this.queryParam.paymentMethod = v
    },
    // 查询
    search() {
      this.$refs.table.refresh(true)
    },
    // 去激活传入
    async Deactivation() {
      clearInterval(this.CallbackStatus)
      await accountStatus().then((res) => {
        if (!res.data.protocol) {
          signAContract({
            jumpUrl: 'http://www.baidu.com',
            ut: this.getcookie('ut')
          }).then((res) => {
            if (res.code === '0') {
              this.url = res.data
              this.singContractVisible = true
              this.CallbackStatus = setInterval(() => {
                accountStatus().then((res) => {
                  if (res.data.protocol) {
                    this.singContractVisible = false
                    clearInterval(this.CallbackStatus)
                    return this.Deactivation()
                  }
                })
              }, 2000)
            }
          })
        } else if (!res.data.phone) {
          paymentManagementStatus().then((res) => {
            if (res.code === '0') {
              if (res.data.phoneType === 3) {
                this.statusNum = 3
                this.popupVisible = true
              } else if (res.data.phoneType === 4) {
                this.$message.info('重新绑定手机号审核中！')
              } else if (res.data.phoneType === 5) {
                this.statusNum = 11
                this.popupVisible = true
              } else {
                this.statusNum = 1
                this.popupVisible = true
              }
            }
          })
        } else if (!res.data.password) {
          queryFincePhone().then((res) => {
            if (res.code === '0') {
              this.getPhone = res.data + ''
            }
          })
          this.statusNum = 2
          this.popupVisible = true
        } else {
          this.isRecharge = true
          this.popupVisible = false
        }
      })
    },
    getcookie(objname) {
      var arrstr = document.cookie.split('; ')
      for (var i = 0; i < arrstr.length; i++) {
        var temp = arrstr[i].split('=')
        if (temp[0] === objname) return unescape(temp[1])
      }
    },
    resetStatus(val) {
      if (val === 0) {
        this.Deactivation()
      }
    },
    closeSingContract() {
      this.singContractVisible = false
      clearInterval(this.CallbackStatus)
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
}
.buttonAraay {
  margin-bottom: 10px;
  .button1 {
    width: 100px;
    margin-right: 10px;
  }
}
</style>

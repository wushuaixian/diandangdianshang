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
              <a-form-model-item label="应付单号：" prop="feeBillCode">
                <a-input placeholder="请输入应付单号" class="input" v-model="queryParam.feeBillCode" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="订单编号：" prop="orderCode">
                <a-input placeholder="请输入订单编号" class="input" v-model="queryParam.orderCode" />
              </a-form-model-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-model-item label="创建时间：" prop="time">
                <a-range-picker class="input" style="margin-left: 10px" v-model="queryParam.time" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="收款单位" prop="settleObjName">
                <a-select
                  class="input"
                  placeholder="请输入收款单位"
                  v-model="queryParam.settleObjName"
                  show-search
                  :show-arrow="false"
                  :filter-option="false"
                  :allowClear="true"
                  @search="handleSearch"
                  :getPopupContainer="
                    (triggerNode) => {
                      return triggerNode.parentNode || document.body
                    }
                  "
                >
                  <a-select-option
                    v-for="item in searchMerchantLis"
                    :key="item.settleObjName"
                    :value="item.settleObjName"
                  >
                    {{ item.settleObjName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>

            <!-- <a-col :md="8" :sm="24">
              <a-form-model-item label="单据状态" prop="billStatus">
                <a-select
                  class="input"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  v-model="queryParam.billStatus"
                  :options="option1"
                  default-value="0"
                  @change="handleChange"
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
                  :options="option2"
                  default-value="0"
                ></a-select>
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
            :tab="`待审核(${$$(billStatusCount.find((v) => v.billStatus == 1)).number || 0})`"
          ></a-tab-pane>
          <a-tab-pane
            key="2"
            :tab="`审核不通过(${$$(billStatusCount.find((v) => v.billStatus == 2)).number || 0})`"
          ></a-tab-pane>
          <a-tab-pane
            key="3"
            :tab="`待申请付款(${$$(billStatusCount.find((v) => v.billStatus == 3)).number || 0})`"
          ></a-tab-pane>
          <a-tab-pane
            key="4"
            :tab="`付款审批不通过(${$$(billStatusCount.find((v) => v.billStatus == 4)).number || 0})`"
          ></a-tab-pane>
          <a-tab-pane
            key="5"
            :tab="`已申请待审批(${$$(billStatusCount.find((v) => v.billStatus == 5)).number || 0})`"
          ></a-tab-pane>

          <a-tab-pane
            key="6"
            :tab="`付款中(${$$(billStatusCount.find((v) => v.billStatus == 6)).number || 0})`"
          ></a-tab-pane>
          <a-tab-pane
            key="7"
            :tab="`待确认(${$$(billStatusCount.find((v) => v.billStatus == 7)).number || 0})`"
          ></a-tab-pane>
          <a-tab-pane
            key="8"
            :tab="`已完成(${$$(billStatusCount.find((v) => v.billStatus == 8)).number || 0})`"
          ></a-tab-pane>
          <a-tab-pane
            key="9"
            :tab="`已关闭(${$$(billStatusCount.find((v) => v.billStatus == 9)).number || 0})`"
          ></a-tab-pane>
        </a-tabs>
      </div>
      <div class="buttonAraay">
        <a-button class="button1" @click="exportFile">导出</a-button>
        <a-button class="button1" @click="viewTasksVisible = true">查看任务</a-button>
      </div>
      <s-table
        name="customTable"
        :columns="columns"
        :data="getList"
        ref="table"
        rowKey="feeBillCode"
        :scroll="{ x: 1500 }"
      >
        <!-- :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
        <template v-slot:feeBillCode="props">
          <a @click="jumpDetails(props)">{{ props.feeBillCode }}</a>
        </template>
        <template v-slot:billStatus="text">
          <span v-show="text.billStatus === 1">待审核</span>
          <span v-show="text.billStatus === 3">待申请付款</span>
          <span v-show="text.billStatus === 2">审核不通过</span>
          <span v-show="text.billStatus === 4">付款审批不通过</span>
          <span v-show="text.billStatus === 5">已申请待审批</span>
          <span v-show="text.billStatus === 6">付款中</span>
          <span v-show="text.billStatus === 7">待确认</span>
          <span v-show="text.billStatus === 8">已完成</span>
          <span v-show="text.billStatus === 9">已关闭</span>
        </template>
        <template slot="feeAmt" slot-scope="text">
          <span>{{ text.feeAmt ? text.feeAmt : 0 | formatCurrency(2, true) }}</span>
        </template>
        <template slot="amountPaid" slot-scope="text">
          <span>{{ text.amountPaid ? text.amountPaid : 0 | formatCurrency(2, true) }}</span>
        </template>
        <template v-slot:createTime="props">{{ props.createTime | moment('YYYY-MM-DD HH:mm:ss') }}</template>
        <template v-slot:sceneType="text">
          <span v-show="text.sceneType == 1">套餐费</span>
          <span v-show="text.sceneType == 11">寻源保证金缴纳</span>
          <span v-show="text.sceneType == 12">标书费</span>
          <span v-show="text.sceneType == 13">平台保证金缴纳</span>
          <span v-show="text.sceneType == 14">寻源保证金退还</span>
          <span v-show="text.sceneType == 15">平台保证金退还</span>
          <span v-show="text.sceneType == 16">罚款</span>
        </template>
        <template v-slot:action="text">
          <div>
            <span v-if="text.billStatus == 2">
              <span class="bluetext" @click="relaunch(text)">重新发起</span>
              <span @click="toVoid(text)" class="bluetext" style="margin-left: 10px">作废</span>
            </span>
            <span v-if="text.billStatus == 3 ? true : false" class="bluetext" style="color: #ff6b00">
              <span @click="ApplicationPayment(text)">申请付款</span>
              <span @click="toVoid(text)" v-if="!(text.sceneType == 16)" style="margin-left: 16px; color: #1890ff">
                作废
              </span>
            </span>
            <span v-if="text.billStatus == 4" class="bluetext">
              <span @click="ApplicationPayment(text)">申请付款</span>
              <span
                v-if="text.sceneType !== 16 && text.sceneType !== 12"
                @click="toVoid(text)"
                class="bluetext"
                style="margin-left: 10px"
              >
                作废</span
              >
            </span>
            <span
              v-if="text.billStatus == 5 ? true : false"
              @click="factoryInspection1(text)"
              class="bluetext"
              style="color: #1890ff"
            >
              查看应付单
            </span>
            <span
              v-if="text.billStatus == 6 ? true : false"
              @click="factoryInspection1(text)"
              class="bluetext"
              style="color: #1890ff"
            >
              查看应付单</span
            >
            <span
              v-if="text.billStatus == 7 ? true : false"
              @click="factoryInspection1(text)"
              class="bluetext"
              style="color: #1890ff"
            >
              查看应付单</span
            >
            <span
              v-if="text.billStatus == 8 ? true : false"
              @click="factoryInspection1(text)"
              class="bluetext"
              style="color: #1890ff"
            >
              查看应付单</span
            >
          </div>
        </template>
      </s-table>
      <Audit ref="audit" @getList="search" />
      <Totaling ref="totaling" @search="search" />
    </a-card>
    <!-- <ExaminePopup :popupStatus.sync="popupStatus" @submitExamine="submitExamine" /> -->
    <GoBankCard :visible="goBankCardVisible" @close="goBankCardVisible = false" />
    <RelaunchPopup :visible="relaunchPopupVisible" @okRelaunch="okRelaunch" @close="relaunchPopupVisible = false" />
    <SystemctlTips :visible="systemctlTipsVisible" @close="systemctlTipsVisible = false" :code="exportCode" />
    <ViewTasks :visible="viewTasksVisible" @close="viewTasksVisible = false" taskType="feeBillManageImplExport" />
  </div>
</template>

<script>
import SystemctlTips from '@/components/exportFile/systemctlTips'
import ViewTasks from '@/components/exportFile/viewTasks'
import { checkFinanceInfo, feeBillManageImplExport, PayableRelaunch, exportId } from '@/api/fince.js'
import { getList, updataBillStatus, queryMerchantLikeName } from '@/api/custom'
import GoBankCard from '@/views/finance/suppliers/homePage/components/goBankCard'
import { Audit, Totaling } from './components'
import ExaminePopup from '@/components/Popup/ExaminePopup.vue'
import RelaunchPopup from './components/relaunchPopup'
import _ from 'loadsh'
export default {
  components: { Audit, Totaling, ExaminePopup, GoBankCard, RelaunchPopup, SystemctlTips, ViewTasks },
  data() {
    return {
      systemctlTipsVisible: false,
      viewTasksVisible: false,
      relaunchPopupVisible: false,
      jsonTxt: {},
      goBankCardVisible: false,
      activeKey: '',
      exportCode: 0,
      popupStatus: false,
      colorList: ['orange', 'blue', 'red'],
      billStatusCount: [],
      id: '',
      relaunchId: '',
      total: 0,
      searchMerchantLis: [], // 搜索下拉框值
      chargeData: [],
      feeBillManageImplExport,
      options: [
        {
          label: '保证金',
          value: '0'
        },
        {
          label: '套餐费',
          value: '1'
        },
        {
          label: '标书费',
          value: '2'
        }
      ],
      option1: [
        {
          label: '全部',
          value: '0'
        },
        {
          label: '待审核',
          value: '1'
        },
        {
          label: '审核不通过',
          value: '2'
        },
        {
          label: '待申请付款',
          value: '3'
        },

        {
          label: '付款审批不通过',
          value: '4'
        },
        {
          label: '已申请待审批',
          value: '5'
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
      option2: [
        {
          label: '全部',
          value: '0'
        },
        {
          label: '套餐费',
          value: '1'
        },
        {
          label: '寻源保证金缴纳',
          value: '11'
        },
        {
          label: '标书费',
          value: '12'
        },
        {
          label: '平台保证金缴纳',
          value: '13'
        },
        {
          label: '寻源保证金退还',
          value: '14'
        },
        {
          label: '平台保证金退还',
          value: '15'
        },
        {
          label: '罚款',
          value: '16'
        }
      ],

      queryParam: {
        billStatus: '',
        sceneType: '0',
        beginTime: '',
        endTime: '',
        feeBillCode: '',
        settleObjName: [],
        merchantStatus: this.$hasOpeerate() ? '0' : null
      },
      advanced: false,
      list: [],

      columns: [
        {
          title: '应付单号',
          key: 'feeBillCode',
          scopedSlots: { customRender: 'feeBillCode' },
          width: 150
        },
        {
          title: '交易类型',
          key: 'sceneType',
          scopedSlots: { customRender: 'sceneType' },
          width: 180
        },
        { title: '摘要', width: 170, dataIndex: 'summary', key: 'summary' },
        { title: '应付金额(元)', width: 170, scopedSlots: { customRender: 'feeAmt' }, key: 'feeAmt' },
        { title: '已付金额(元)', width: 170, scopedSlots: { customRender: 'amountPaid' }, key: 'amountPaid' },
        { title: '收款单位', dataIndex: 'settleObjName', width: 260, key: 'settleObjName' },
        { title: '订单编号', width: 200, dataIndex: 'orderCode', key: 'orderCode' },

        {
          title: '单据状态',
          width: 120,
          scopedSlots: { customRender: 'billStatus' },
          key: 'billStatus'
        },

        {
          title: '创建时间',
          width: 180,
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        { title: '备注', width: 180, dataIndex: 'remark', key: 'remark' },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 150,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },

  mounted() {
    checkFinanceInfo().then((res) => {
      if (res.code !== '0' && !this.$hasOpeerate()) {
        this.goBankCardVisible = true
      }
    })
    console.log(this.$route.params)
    this.queryMerchantLikeName()
    if (this.$route.params.feeBillCode) {
      this.$set(this.queryParam, 'feeBillCode', this.$route.params.feeBillCode)
      this.search()
    }
  },
  methods: {
    // 获取列表
    async getList(pagination) {
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
      if (typeof data.settleObjName === 'object') {
        data.settleObjName = ''
      }
      this.jsonTxt = { ...data }
      const data2 = getList({ ...data })
      data2.then((res) => {
        if (res.code === '0') {
          console.log(data)
          console.log(this.total)
          if (res.data.billStatusCount != null) {
            this.billStatusCount = res.data.billStatusCount
          } else if (res.data.billStatusCount == null) {
            this.billStatusCount = []
          }
          res.data.listObj.forEach((item) => {
            item.feeAmt = item.feeAmt.toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
          })
        }
      })
      return data2
    },
    async queryMerchantLikeName() {
      const data2 = await queryMerchantLikeName()
      // console.log(data2.data.listObj)
      this.searchMerchantLis = data2.data
      return data2
    },
    // 重新发起
    relaunch(text) {
      this.relaunchPopupVisible = true
      this.relaunchId = text.id
    },
    okRelaunch() {
      PayableRelaunch({ id: this.relaunchId }).then((res) => {
        if (res.code === '0') {
          this.$message.success('重新提交成功')
          this.relaunchPopupVisible = false
          this.search()
        }
      })
    },
    exportFile() {
      const that = this
      this.jsonTxt.itemsPerPage = 1000
      this.jsonTxt.currentPage = 1
      const jsonTxt = JSON.stringify(this.jsonTxt)
      feeBillManageImplExport({
        templateCode: 'feeBillManageImplExport',
        jsonTxt,
        exportType: 'exportInvoiceInfoList',
        fileName: '应付管理列表'
      }).then((res) => {
        if (res.code === '0') {
          exportId({ taskType: 'feeBillManageImplExport' }).then((res) => {
            if (res.code === '0') {
              that.systemctlTipsVisible = true
              that.exportCode = res.data
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
      this.searchMerchantLis = []
      this.queryParam.settleObjName = []
      this.$refs.ruleForm.resetFields()
      this.search()
    },
    // 查询
    search() {
      this.activeKey = this.queryParam.billStatus
      this.$refs.table.refresh(true)
    },
    callback(key) {
      // console.log(key)
      this.queryParam.billStatus = key
      this.search()
      // this.$refs.table.refresh(true)
    },
    // authStatus(value) {
    //   this.authStatusValue = value
    //   console.log(value)
    // },
    onChange(date, dateString) {
      this.queryParam.beginTime = date[0]['_d']
      this.queryParam.endTime = date[1]['_d']
    },
    onchangePage() {},
    factoryInspection() {
      this.popupStatus = true
    },
    factoryInspection1(value) {
      this.$router.push({
        name: !this.$hasOpeerate() ? 'SupplierPayableManageDetail' : 'SysSupplierPayableManageDetail',
        //        name: 'SupplierPayableManageDetail',
        params: {
          id: value.id
        }
      })
    },

    // 申请支付
    ApplicationPayment(id) {
      this.$refs['totaling'].init(id)
    },
    // 作废
    toVoid(id) {
      this.id = id.id
      this.getList()
      this.$refs['audit'].init(id)
      // this.updataBillStatus()
    },
    async updataBillStatus() {
      const { id } = this
      await updataBillStatus({ id: id, billStatus: 9 })
    },
    jumpDetails(value) {
      this.$router.push({
        name: !this.$hasOpeerate() ? 'SupplierPayableManageDetail' : 'SysSupplierPayableManageDetail',
        params: {
          id: value.id
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.appeal-manage-list {
  width: 100%;
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .button {
    text-align: center;
  }
  .bluetext {
    color: #1890ff;
    &:hover {
      cursor: pointer;
    }
  }
  .enterpriseName {
    color: #ff6b00;
    cursor: pointer;
  }
  .ant-tabs-nav-wrap {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #262626;
  }
  .input {
    margin-left: 10px;
  }
}
.exportButton {
  margin-bottom: 10px;
}
.buttonAraay {
  margin-bottom: 10px;
  .button1 {
    width: 100px;
    margin-right: 10px;
  }
}
</style>

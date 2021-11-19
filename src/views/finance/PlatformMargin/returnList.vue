<template>
  <div class="penaltyManagement">
    <a-card :bordered="false" class="top">
      <div>
        <a-form-model layout="inline" ref="form" :model="queryParam" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row :gutter="48">
            <a-col :md="8">
              <a-form-model-item label="申请单位" prop="merchantName">
                <a-select
                  v-if="!isRelaunch"
                  class="inp"
                  v-model="queryParam.merchantName"
                  show-search
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  @search="handleSearch"
                  placeholder="请输入申请单位"
                  :allowClear="true"
                  :getPopupContainer="
                    (triggerNode) => {
                      return triggerNode.parentNode || document.body
                    }
                  "
                >
                  <a-select-option v-for="item in comList" :key="item.merchantId" :value="item.merchantName">
                    {{ item.merchantName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- <a-col :md="8">
              <a-form-model-item label="退还状态" prop="billStatus">
                <a-select class="inp" v-model="queryParam.billStatus">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">已申请</a-select-option>
                  <a-select-option value="2">已执行</a-select-option>
                  <a-select-option value="3">已完成</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col> -->
            <a-col :md="8">
              <a-form-model-item label="应付单编号" style="margin-left: -6px" prop="feeBillCode">
                <a-input v-model="queryParam.feeBillCode" placeholder="请输入应付单编号" class="inp" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="申请日期" prop="createTime">
                <a-range-picker v-model="queryParam.createTime" class="inp" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="执行日期" prop="excuteTime">
                <a-range-picker v-model="queryParam.excuteTime" class="inp" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="支付日期" prop="paymentTime">
                <a-range-picker v-model="queryParam.paymentTime" class="inp" />
              </a-form-model-item>
            </a-col>
            <a-col :md="24">
              <div class="search">
                <a-button style="margin-left: 8px" @click="Reset">重置</a-button>
                <a-button type="primary" style="margin-left: 20px" @click="search">查询</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card>
      <a-tabs default-active-key="" @change="callback">
        <a-tab-pane key="" :tab="'全部(' + number[0] + ')'"></a-tab-pane>
        <a-tab-pane :key="1" :tab="'已申请(' + number[1] + ')'"></a-tab-pane>
        <a-tab-pane :key="2" :tab="'已执行(' + number[2] + ')'"></a-tab-pane>
        <a-tab-pane :key="3" :tab="'已完成(' + number[3] + ')'"></a-tab-pane>
      </a-tabs>
      <div class="buttonArray">
        <a-button @click="batchImplement" :disabled="ids.length <= 0" style="margin-right: 10px">批量执行</a-button>
        <a-button class="button1" @click="exportFile">导出</a-button>
        <a-button class="button1" @click="viewTasksVisible = true">查看任务</a-button>
        <!-- <a-button class="button" type="primary">销户退还</a-button> -->
      </div>
      <s-table
        rowKey="id"
        name="homePageTable"
        ref="table"
        :scroll="{ x: 2000 }"
        :columns="columns"
        :row-selection="rowSelection"
        :key="skey"
        :data="init"
      >
        <template slot-scope="text" slot="createTime">
          {{ text.createTime | moment('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template slot-scope="text" slot="executeTime">
          {{ text.executeTime | moment('YYYY-MM-DD HH:mm:ss') }}
        </template>

        <template slot="billStatus" slot-scope="text">
          <span v-show="text.billStatus === 1">已申请</span>
          <span v-show="text.billStatus === 2">已执行</span>
          <span v-show="text.billStatus === 3">已完成</span>
        </template>
        <template slot="balance" slot-scope="text">
          <span v-show="text.balance !== null && text.balance !== ''">
            {{ text.balance | formatCurrency(2, true) }}</span
          >
        </template>
        <template slot="feeAmt" slot-scope="text">
          <span v-show="text.feeAmt !== null && text.feeAmt !== ''"> {{ text.feeAmt | formatCurrency(2, true) }}</span>
        </template>
        <template slot="action" slot-scope="text">
          <span v-show="text.billStatus === 1" class="executionDeduction" @click="enforcementRefund(text)">
            执行退还
          </span>
        </template>
        <template slot="paymentTime" slot-scope="text">
          {{ text.paymentTime | moment('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </s-table>
    </a-card>
    <EnforcementRefund
      :visible="enforcementRefundVisible"
      :params="params"
      @enforcementRefund="enforcementRefundConfirm"
      @close="enforcementRefundVisible = false"
    />
    <BatchEnforcementRefund
      :visible="batchEnforcementRefundVisible"
      @close="batchEnforcementRefundVisible = false"
      @enforcementRefund="enforcementRefundConfirm"
    />
    <SystemctlTips :visible="systemctlTipsVisible" @close="systemctlTipsVisible = false" :code="exportCode" />
    <ViewTasks
      :visible="viewTasksVisible"
      @close="viewTasksVisible = false"
      taskType="exportExcelForMarginRefundCode"
    />
  </div>
</template>
<script>
import SystemctlTips from '@/components/exportFile/systemctlTips'
import ViewTasks from '@/components/exportFile/viewTasks'
import EnforcementRefund from './components/enforcementRefund'
import BatchEnforcementRefund from './components/batchEnforcementRefund'
import { queryCompanyName, queryMarginRefund, updateMarginRefund, feeBillManageImplExport, exportId } from '@/api/fince'
import _ from 'loadsh'
export default {
  components: {
    EnforcementRefund,
    BatchEnforcementRefund,
    SystemctlTips,
    ViewTasks
  },
  created() {
    queryCompanyName({ likeName: '' }).then((res) => {
      if (res.code === '0') {
        this.comList = new Set(res.data)
        console.log(this.comList)
      }
    })
  },
  data() {
    return {
      systemctlTipsVisible: false,
      viewTasksVisible: false,
      exportCode: 0,
      jsonTxt: {},
      examineType: 1,
      feeBillManageImplExport,
      enforcementRefundVisible: false,
      batchEnforcementRefundVisible: false,
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      params: {},
      ids: [],
      id: 0,
      skey: 1,
      number: {
        0: 0,
        1: 0,
        2: 0,
        3: 0
      },
      queryParam: {
        merchantName: [],
        billStatus: '',
        feeBillCode: '',
        createTime: null,
        excuteTime: null,
        paymentTime: null
      },
      isRelaunch: false,
      comList: [],
      columns: [
        {
          title: '申请日期',
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '申请单位',
          key: 'merchantName',
          dataIndex: 'merchantName'
        },
        {
          title: '金额(元)',
          key: 'feeAmt',
          scopedSlots: { customRender: 'feeAmt' }
        },
        {
          title: '当前余额',
          key: 'balance',
          scopedSlots: { customRender: 'balance' }
        },
        {
          title: '状态',
          key: 'billStatus',
          scopedSlots: { customRender: 'billStatus' }
        },
        {
          title: '应付单号',
          key: 'feeBillCode',
          dataIndex: 'feeBillCode'
        },
        {
          title: '付款日期',
          key: 'paymentTime',
          scopedSlots: { customRender: 'paymentTime' }
        },
        {
          title: '付款单号',
          key: 'paymentBillCode',
          dataIndex: 'paymentBillCode'
        },
        {
          title: '执行日期',
          key: 'executeTime',
          scopedSlots: { customRender: 'executeTime' }
        },

        {
          key: 'action',
          scopedSlots: { customRender: 'action' },
          fixed: 'right',
          width: '100'
        }
      ]
    }
  },
  computed: {
    rowSelection() {
      const that = this
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          that.ids = selectedRowKeys
        },
        getCheckboxProps: (record) => {
          return {
            props: {
              disabled: record.billStatus !== 1
            }
          }
        }
      }
    }
  },
  methods: {
    exportFile() {
      const that = this
      this.jsonTxt.itemsPerPage = 1000
      this.jsonTxt.currentPage = 1
      const jsonTxt = JSON.stringify(this.jsonTxt)
      feeBillManageImplExport({
        templateCode: 'exportExcelForMarginRefundCode',
        jsonTxt,
        exportType: 'exportInvoiceInfoList',
        fileName: '付款记录列表'
      }).then((res) => {
        if (res.code === '0') {
          exportId({ taskType: 'exportExcelForMarginRefundCode' }).then((res) => {
            if (res.code === '0') {
              that.systemctlTipsVisible = true
              that.exportCode = res.data
            }
          })
        }
      })
    },
    async init(params) {
      const data = {
        ...params,
        ...this.queryParam
      }
      if (typeof data.merchantName === 'object') {
        data.merchantName = ''
      }
      if (data.createTime) {
        const [beginTime, endTime] = data.createTime
        data.createBeginTime = beginTime
        data.createEndTime = endTime
      }
      if (data.excuteTime) {
        const [beginTime, endTime] = data.excuteTime
        data.executeBeginTime = beginTime
        data.executeEndTime = endTime
      }
      if (data.paymentTime) {
        const [beginTime, endTime] = data.paymentTime
        data.paymentBeginTime = beginTime
        data.paymentEndTime = endTime
      }
      this.jsonTxt = { ...data }
      const res = queryMarginRefund({ ...data })
      res.then((res) => {
        if (res.code === '0') {
          this.number[0] = res.data.billStatusCount.find((item) => item.billStatus === 0).number
          this.number[1] = res.data.billStatusCount.find((item) => item.billStatus === 1).number
          this.number[2] = res.data.billStatusCount.find((item) => item.billStatus === 2).number
          this.number[3] = res.data.billStatusCount.find((item) => item.billStatus === 3).number
        }
      })
      return res
    },
    batchImplement() {
      if (this.ids.length > 0) {
        this.examineType = 2
        this.batchEnforcementRefundVisible = true
      }
    },
    enforcementRefund(params) {
      this.examineType = 1
      this.id = params.id
      this.params = params
      this.enforcementRefundVisible = true
    },
    enforcementRefundConfirm() {
      let ids
      if (this.examineType === 1) {
        ids = [this.id]
        if (this.ids.includes(this.id)) {
          this.ids.splice(
            this.ids.findIndex((item) => item === this.id),
            1
          )
        }
      } else {
        ids = this.ids
      }
      updateMarginRefund(ids).then((res) => {
        if (res.code === '0') {
          this.enforcementRefundVisible = false
          this.batchEnforcementRefundVisible = false
          this.$message.success('执行退款成功')
          this.ids = []
          this.search()
        }
      })
    },
    Reset() {
      this.$refs.form.resetFields()
    },
    search() {
      this.skey++
      // this.$refs.table.refresh(true)
    },
    callback(v) {
      this.queryParam.billStatus = v
      this.search()
    },
    handleSearch(settleObjName) {
      if (!settleObjName.trim()) return
      _.debounce(async () => {
        const res = await queryCompanyName({ likeName: settleObjName })
        if (res.code === '0') {
          this.comList = res?.data
        }
      }, 1000)()
    }
  }
}
</script>
<style lang="less" scoped>
.penaltyManagement {
  .top {
    margin-bottom: 20px;
  }
}
.inp {
  width: 200px;
}
.button {
  width: 88px;
  margin-left: 10px;
}
.search {
  margin-top: 20px;
  text-align: center;
}
.executionDeduction {
  cursor: pointer;
  color: #ff6b00;
}
.buttonArray {
  margin-bottom: 10px;
  .button1 {
    width: 100px;
    margin-right: 10px;
  }
}
</style>

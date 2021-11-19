<template>
  <div class="penaltyManagement">
    <a-card :bordered="false" class="top">
      <div>
        <a-form-model
          layout="inline"
          ref="form"
          :model="queryParam"
          v-bind="{
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
          }"
        >
          <a-row :gutter="48">
            <a-col :md="8">
              <a-form-model-item label="罚款单号" prop="forfeitBillCode">
                <a-input placeholder="请输入单号" v-model="queryParam.forfeitBillCode" class="inp" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="订单编号" prop="orderCode">
                <a-input placeholder="请输入订单编号" v-model="queryParam.orderCode" class="inp" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="创建日期" prop="createTime">
                <a-range-picker class="inp" v-model="queryParam.createTime" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="发起单位" prop="merchantName">
                <a-select
                  v-if="!isRelaunch"
                  class="inp"
                  v-model="queryParam.merchantName"
                  show-search
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  @search="handleSearch"
                  placeholder="请输入发起单位"
                  :allowClear="true"
                  :getPopupContainer="
                    (triggerNode) => {
                      return triggerNode.parentNode || document.body
                    }
                  "
                >
                  <a-select-option v-for="(item, index) in comList" :key="index" :value="item">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="付款单位" prop="payerObjName">
                <a-select
                  v-if="!isRelaunch"
                  class="inp"
                  v-model="queryParam.payerObjName"
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
                  <a-select-option v-for="(item, index) in comList" :key="index" :value="item">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="支付日期" prop="time">
                <a-range-picker v-model="queryParam.time" class="inp" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="罚款类型" prop="forfeitType">
                <a-select class="inp" v-model="queryParam.forfeitType">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">平台违约罚款</a-select-option>
                  <a-select-option value="2">订单违约罚款</a-select-option>
                  <a-select-option value="3">其他罚款</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- <a-col :md="8">
              <a-form-model-item label="罚款状态" prop="category">
                <a-select class="inp">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">待确认</a-select-option>
                  <a-select-option value="2">已拒绝</a-select-option>
                  <a-select-option value="3">已完成</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col> -->
            <a-col :md="8">
              <a-form-model-item label="罚款方式" prop="forfeitWay">
                <a-select class="inp" v-model="queryParam.forfeitWay">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">主动缴纳</a-select-option>
                  <a-select-option value="2">保证金划扣</a-select-option>
                </a-select>
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
        <a-tab-pane :key="1" :tab="'待确认(' + number[1] + ')'" force-render></a-tab-pane>
        <a-tab-pane :key="2" :tab="'已拒绝(' + number[2] + ')'"></a-tab-pane>
        <a-tab-pane :key="3" :tab="'待支付(' + number[3] + ')'"></a-tab-pane>
        <a-tab-pane :key="4" :tab="'已完成(' + number[4] + ')'"></a-tab-pane>
        <a-tab-pane :key="6" tab="待仲裁(0)"></a-tab-pane>
      </a-tabs>
      <a-button class="button" type="primary" @click="exportFile">导出</a-button>
      <a-button class="button" type="primary" @click="viewTasksVisible = true">查看任务</a-button>
      <s-table rowKey="id" name="homePageTable" ref="table" :scroll="{ x: 2000 }" :columns="columns" :data="init">
        <template slot="feeAmt" slot-scope="text">
          <span v-show="text.feeAmt !== null && text.feeAmt !== ''"> {{ text.feeAmt | formatCurrency(2, true) }}</span>
        </template>
        <template slot="billStatus" slot-scope="text">
          <span v-show="text.billStatus">{{ fineStatus.find((item) => item.value === text.billStatus).label }}</span>
        </template>
        <template slot-scope="text" slot="createTime">
          {{ text.createTime | moment('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template slot="forfeitWay" slot-scope="text">
          <span v-show="text.forfeitWay === 1">主动缴纳</span>
          <span v-show="text.forfeitWay === 2">保证金划扣</span>
        </template>
        <template slot-scope="text" slot="payingTime">
          {{ text.payingTime | moment('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template slot-scope="text" slot="forfeitBillCode">
          <span class="forfeitBillCodeColor" @click="FineDetail(text)">{{ text.forfeitBillCode }}</span>
        </template>
        <template slot-scope="text" slot="forfeitType">
          <span v-show="text.forfeitType === 1">平台违约罚款</span>
          <span v-show="text.forfeitType === 2">订单违约罚款</span>
          <span v-show="text.forfeitType === 3">其他罚款</span>
        </template>
        <template #description="text">
          <span class="description" :title="text.description"> {{ text.description }}</span>
        </template>
      </s-table>
    </a-card>
    <FineDetails
      :visible="fineDetailsVisible"
      @close="fineDetailsVisible = false"
      @search="search"
      :params="fineDetailParams"
    />
    <SystemctlTips :visible="systemctlTipsVisible" @close="systemctlTipsVisible = false" :code="exportCode" />
    <ViewTasks :visible="viewTasksVisible" @close="viewTasksVisible = false" taskType="forfeitInfoExport" />
  </div>
</template>
<script>
import { penaltyManagementList, queryCompanyName, exportInvoice, exportId } from '@/api/fince'
import SystemctlTips from '@/components/exportFile/systemctlTips'
import ViewTasks from '@/components/exportFile/viewTasks'
import { fineStatus } from '@/config/constant'
import _ from 'loadsh'
import FineDetails from './components/fineDetails'
export default {
  components: {
    FineDetails,
    SystemctlTips,
    ViewTasks
  },
  data() {
    return {
      fineDetailsVisible: false,
      systemctlTipsVisible: false,
      viewTasksVisible: false,
      CreateTicketVisible: false,
      isRelaunch: false,
      exportCode: 0,
      jsonTxt: {},
      comList: [],
      number: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0
      },
      fineDetailParams: {},
      queryParam: {
        forfeitBillCode: '',
        orderCode: '',
        createTime: null,
        merchantName: [],
        payerObjName: [],
        forfeitType: '',
        time: null,
        forfeitWay: '',
        billStatus: ''
      },
      fineStatus,
      columns: [
        {
          title: '罚款单号',
          key: 'forfeitBillCode',
          width: 200,
          scopedSlots: { customRender: 'forfeitBillCode' }
        },
        {
          title: '罚款类型',
          key: 'forfeitType',
          scopedSlots: { customRender: 'forfeitType' }
        },
        {
          title: '付款单位',
          key: 'payerObjName',
          dataIndex: 'payerObjName'
        },
        {
          title: '发起单位',
          key: 'merchantName',
          dataIndex: 'merchantName'
        },
        {
          title: '金额 (元)',
          key: 'feeAmt',
          scopedSlots: { customRender: 'feeAmt' }
        },
        {
          title: '状态',
          key: 'billStatus',
          scopedSlots: { customRender: 'billStatus' }
        },
        {
          title: '罚款说明',
          key: 'description',
          scopedSlots: { customRender: 'description' }
        },
        {
          title: '创建日期',
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '罚款方式',
          key: 'forfeitWay',
          scopedSlots: { customRender: 'forfeitWay' }
        },
        {
          title: '应付单号',
          key: 'feeBillCode',
          dataIndex: 'feeBillCode'
        },
        {
          title: '订单编号',
          key: 'orderCode',
          dataIndex: 'orderCode'
        },
        {
          title: '收款时间',
          key: 'payingTime',
          scopedSlots: { customRender: 'payingTime' }
        },
        {
          key: 'action',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  created() {
    queryCompanyName({ likeName: '' }).then((res) => {
      if (res.code === '0') {
        const list = []
        for (let i = 0; i < res.data.length; i++) {
          list.push(res.data[i].merchantName)
        }
        this.comList = new Set(list)
      }
    })
  },
  methods: {
    async init(params) {
      const data = {
        ...params,
        ...this.queryParam,
        type: 1
      }
      if (data.time) {
        const [beginTime, endTime] = data.time
        data.payingTimeFrom = beginTime
        data.payingTimeTo = endTime
      }
      if (data.createTime) {
        const [beginTime, endTime] = data.createTime
        data.createTimeFrom = beginTime
        data.createTimeTo = endTime
      }
      if (typeof data.merchantName === 'object') {
        data.merchantName = ''
      }
      if (typeof data.payerObjName === 'object') {
        data.payerObjName = ''
      }
      this.jsonTxt = { ...data }
      const res = penaltyManagementList({ ...data })
      res.then((res) => {
        if (res.code === '0') {
          this.number[0] = res.data.billStatusCount[0].count
          this.number[1] = res.data.billStatusCount[1].count
          this.number[2] = res.data.billStatusCount[2].count
          this.number[3] = res.data.billStatusCount[3].count
          this.number[4] = res.data.billStatusCount[4].count
        }
      })
      return res
    },
    handleSearch(settleObjName) {
      if (!settleObjName.trim()) return
      _.debounce(async () => {
        const res = await queryCompanyName({ likeName: settleObjName })
        if (res.code === '0') {
          const list = []
          for (let i = 0; i < res.data.length; i++) {
            list.push(res.data[i].merchantName)
          }
          this.comList = new Set(list)
        }
      }, 1000)()
    },
    exportFile() {
      const that = this
      delete this.jsonTxt.itemsPerPage
      delete this.jsonTxt.currentPage
      const jsonTxt = JSON.stringify(this.jsonTxt)
      exportInvoice({
        templateCode: 'forfeitInfoExport',
        jsonTxt,
        exportType: 'exportForfeitInfoList',
        fileName: '罚款信息导出列表'
      }).then((res) => {
        if (res.code === '0') {
          exportId({ taskType: 'forfeitInfoExport' }).then((res) => {
            if (res.code === '0') {
              that.systemctlTipsVisible = true
              that.exportCode = res.data
            }
          })
        }
      })
    },
    Reset() {
      this.$refs.form.resetFields()
      this.search()
    },
    FineDetail(params) {
      this.fineDetailParams = params
      this.fineDetailsVisible = true
    },
    search() {
      this.$refs.table.refresh(true)
    },
    callback(v) {
      this.queryParam.billStatus = v
      this.search()
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
  width: 210px;
}
.button {
  width: 120px;
  margin-bottom: 10px;
}
.search {
  margin-top: 20px;
  text-align: center;
}
.forfeitBillCodeColor {
  cursor: pointer;
  color: #ff6b00;
}
.description {
  width: 200px;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap; /*文本不换行显示*/
  text-overflow: ellipsis; /*文本溢出部分用点表示*/
}
</style>

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
                <a-input
                  placeholder="请输入罚款单号"
                  v-model="queryParam.forfeitBillCode"
                  class="inp"
                  prop="forfeitBillCode"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="订单编号" prop="orderCode">
                <a-input placeholder="请输入订单编号" v-model="queryParam.orderCode" class="inp" prop="orderCode" />
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
                  :notFoundContent="' '"
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
                  <a-select-option v-for="item in comList" :key="item.merchantId" :value="item.merchantName">
                    {{ item.merchantName }}
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
              <a-form-model-item label="罚款状态" prop="billStatus">
                <a-select class="inp" v-model="queryParam.billStatus">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">待确认</a-select-option>
                  <a-select-option value="2">已拒绝</a-select-option>
                  <a-select-option value="3">待支付</a-select-option>
                  <a-select-option value="4">已完成</a-select-option>
                  <a-select-option value="5">重新发起</a-select-option>
                  <a-select-option value="6">待仲裁</a-select-option>
                  <a-select-option value="7">已仲裁</a-select-option>
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
        <a-tab-pane key="" :tab="'全部(' + number.total + ')'"></a-tab-pane>
        <a-tab-pane :key="1" :tab="'待确认(' + number[1] + ')'" force-render></a-tab-pane>
        <a-tab-pane :key="2" :tab="'已拒绝(' + number[2] + ')'"></a-tab-pane>
        <a-tab-pane :key="3" :tab="'待支付(' + number[3] + ')'"></a-tab-pane>
        <!-- <a-tab-pane :key="6" tab="待仲裁"></a-tab-pane>
        <a-tab-pane :key="7" tab="已仲裁"></a-tab-pane> -->
        <a-tab-pane :key="4" :tab="'已完成(' + number[4] + ')'"></a-tab-pane>
      </a-tabs>
      <div class="buttonArarry">
        <a-button @click="CreateTicketVisible = true">创建罚款单</a-button>
        <a-button class="button" @click="batchApproval" :disabled="idListBatch.length <= 0">批量审核</a-button>
        <a-button class="button" @click="exportFile">导出</a-button>
        <a-button class="button" @click="viewTasksVisible = true">查看任务</a-button>
      </div>
      <s-table
        rowKey="id"
        name="homePageTable"
        :row-selection="rowSelection"
        :scroll="{ x: 2000 }"
        ref="table"
        :key="skey"
        :columns="columns"
        :data="init"
      >
        <template slot="forfeitType" slot-scope="text">
          <span v-show="text.forfeitType === 1">平台违规罚款</span>
          <span v-show="text.forfeitType === 2">订单违规罚款</span>
          <span v-show="text.forfeitType === 3">其他</span>
        </template>
        <template slot="feeAmt" slot-scope="text">
          <span v-show="text.feeAmt !== null && text.feeAmt !== ''">
            <!-- <span>{{ text.initiator ? '+' : '-' }}</span> -->
            {{ text.feeAmt | formatCurrency(2, true) }}</span
          >
        </template>
        <template slot="billStatus" slot-scope="text">
          <span v-show="text.billStatus">{{ fineStatus.find((item) => item.value === text.billStatus).label }}</span>
        </template>
        <template slot-scope="text" slot="createTime">
          {{ text.createTime | moment('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template slot-scope="text" slot="forfeitBillCode">
          <span class="cursor" @click="FineDetail(text)">{{ text.forfeitBillCode }}</span>
        </template>
        <template slot-scope="text" slot="payingTime">
          {{ text.payingTime | moment('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template slot="forfeitWay" slot-scope="text">
          <span v-show="text.forfeitWay === 1">主动缴纳</span>
          <span v-show="text.forfeitWay === 2">保证金划扣</span>
        </template>
        <template #description="text">
          <span class="description" :title="text.description"> {{ text.description }}</span>
        </template>
        <template slot-scope="text" slot="action">
          <span class="cursor" @click="relaunch(text)" v-show="text.billStatus === 2 && text.initiator === 1">
            重新发起
          </span>
          <span
            class="cursor"
            style="marign-left: 10px"
            @click="fineExamine(text.id)"
            v-show="text.billStatus === 1 && text.initiator === 0"
          >
            审核
          </span>
        </template>
      </s-table>
    </a-card>
    <CreateTicket
      :params="params"
      :isRelaunch="isRelaunch"
      :visible="CreateTicketVisible"
      @search="search"
      @close="
        CreateTicketVisible = false
        isRelaunch = false
      "
    />
    <FineDetails
      @examine="detailsfineExamine"
      :visible="fineDetailsVisible"
      @close="fineDetailsVisible = false"
      :params="fineDetailParams"
    />
    <FineExamine :popupStatus="fineExamineVisible" @close="fineExamineVisible = false" @submitExamine="submitExamine" />
    <SystemctlTips :visible="systemctlTipsVisible" @close="systemctlTipsVisible = false" :code="exportCode" />
    <ViewTasks :visible="viewTasksVisible" @close="viewTasksVisible = false" taskType="forfeitInfoExport" />
  </div>
</template>
<script>
import FineExamine from './components/fineExamine'
import CreateTicket from './components/createTicket'
import { fineStatus } from '@/config/constant'
import SystemctlTips from '@/components/exportFile/systemctlTips'
import ViewTasks from '@/components/exportFile/viewTasks'
import FineDetails from '@/views/finance/operators/penaltyManagementPurchasers/components/fineDetails'
import { penaltyManagementList, queryCompanyName, fineExamine, exportInvoice, exportId } from '@/api/fince'
import _ from 'loadsh'
export default {
  components: {
    CreateTicket,
    FineDetails,
    FineExamine,
    SystemctlTips,
    ViewTasks
  },
  data() {
    return {
      comList: [],
      CreateTicketVisible: false,
      systemctlTipsVisible: false,
      viewTasksVisible: false,
      fineDetailsVisible: false,
      fineExamineVisible: false,
      fineDetailParams: {},
      isRelaunch: false,
      jsonTxt: {},
      skey: 1,
      fineStatus,
      exportCode: 0,
      params: {},
      queryParam: {
        forfeitBillCode: '',
        orderCode: '',
        createTime: null,
        merchantName: [],
        payerObjName: [],
        time: null,
        billStatus: '',
        forfeitType: '',
        forfeitWay: ''
      },
      examineType: 1,
      idList: [],
      idListBatch: [],
      number: {
        total: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0
      },
      state: {
        selectedRowKeys: []
      },
      columns: [
        {
          title: '罚款单号',
          width: 250,
          key: 'forfeitBillCode',
          scopedSlots: { customRender: 'forfeitBillCode' }
        },
        {
          title: '罚款类型',
          width: 250,
          key: 'forfeitType',
          scopedSlots: { customRender: 'forfeitType' }
        },
        {
          title: '付款单位',
          width: 250,
          key: 'payerObjName',
          dataIndex: 'payerObjName'
        },
        {
          title: '发起单位',
          width: 250,
          key: 'merchantName',
          dataIndex: 'merchantName'
        },
        {
          title: '金额(元)',
          width: 250,
          key: 'feeAmt',
          scopedSlots: { customRender: 'feeAmt' }
        },
        {
          title: '状态',
          width: 250,
          key: 'billStatus',
          scopedSlots: { customRender: 'billStatus' }
        },
        {
          title: '罚款说明',
          width: 250,
          key: 'description',
          scopedSlots: { customRender: 'description' }
        },
        {
          title: '订单编号',
          width: 250,
          key: 'orderCode',
          dataIndex: 'orderCode'
        },
        {
          title: '创建日期',
          width: 250,
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '罚款方式',
          width: 250,
          key: 'forfeitWay',
          scopedSlots: { customRender: 'forfeitWay' }
        },
        {
          title: '收款时间',
          width: 250,
          key: 'payingTime',
          scopedSlots: { customRender: 'payingTime' }
        },
        {
          key: 'action',
          fixed: 'right',
          width: 120,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  computed: {
    rowSelection() {
      const that = this
      const { selectedRowKeys } = that.state
      return {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          that.state.selectedRowKeys = selectedRowKeys
          that.idListBatch = selectedRowKeys
        },
        getCheckboxProps: (record) => {
          return {
            props: {
              // text.billStatus === 1 && text.initiator === 0
              disabled: !(record.billStatus === 1 && record.initiator === 0)
            }
          }
        }
      }
    }
  },
  mounted() {
    // const arr = [
    //   { title: 'haha', key: '1', childrenList: [{ title: 'xixi', key: 2 }] },
    //   { title: 'haha', key: '1', childrenList: [{ title: 'xixi', key: 2 }] },
    //   { title: 'haha', key: '1', childrenList: [{ title: 'xixi', key: 2 }] }
    // ]
    // const arr2 = []
    // this.arr3(arr, arr2)
    // console.log(arr2)
    queryCompanyName({ likeName: '' }).then((res) => {
      if (res.code === '0') {
        this.comList = new Set(res.data)
      }
    })
  },
  methods: {
    // arr3(arr, arr2) {
    //   for (let i = 0; i < arr.length; i++) {
    //     arr2[i] = { key: arr[i].key, title: arr[i].title }
    //     if (arr[i].childrenList) {
    //       arr2[i].children = []
    //       this.arr3(arr[i].childrenList, arr2[i].children)
    //     }
    //   }
    // },
    async init(params) {
      const data = {
        ...params,
        ...this.queryParam
      }
      if (data.time) {
        const [beginTime, endTime] = data.time
        console.log(data.time)
        data.payingTimeFrom = beginTime
        data.payingTimeTo = endTime
      }
      console.log(data.createTime)
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
          this.number.total = res.data.billStatusCount[0].count
          this.number[1] = res.data.billStatusCount[1].count
          this.number[2] = res.data.billStatusCount[2].count
          this.number[3] = res.data.billStatusCount[3].count
          this.number[4] = res.data.billStatusCount[4].count
          this.jsonTxt.entityId =
            res.data.listObj[0]?.initiator === 0 ? res.data.listObj[0]?.payerObjId : res.data.listObj[0]?.merchantId
        }
      })
      return res
    },
    // 批量审批
    batchApproval() {
      this.examineType = 2
      if (this.idList.length < 0) {
        this.$message.info('请选择')
      } else {
        this.fineExamineVisible = true
      }
    },
    fineExamine(id) {
      this.examineType = 1
      this.idList = [id]
      this.fineExamineVisible = true
    },
    // 审核 1通过 0驳回
    submitExamine(status, remark) {
      let idList = []
      if (this.examineType === 1) {
        idList = this.idList
        if (status === 1 && this.idListBatch.length > 0 && this.idListBatch.includes(this.idList[0])) {
          this.idListBatch.splice(
            this.idListBatch.findIndex((item) => item === this.idListBatch[0]),
            1
          )
        }
      } else {
        idList = this.idListBatch
      }
      fineExamine({ ids: idList, auditResult: status, remark }).then((res) => {
        if (res.code === '0') {
          this.idList = []
          this.skey++
          if (this.examineType === 2) {
            this.idListBatch = []
          }
        }
      })
    },
    detailsfineExamine(id) {
      this.fineDetailsVisible = false
      this.fineExamine(id)
    },
    FineDetail(params) {
      this.fineDetailParams = params
      this.fineDetailsVisible = true
    },
    handleSearch(settleObjName) {
      if (!settleObjName.trim()) return
      _.debounce(async () => {
        const res = await queryCompanyName({ likeName: settleObjName })
        if (res.code === '0') {
          this.comList = res?.data
        }
      }, 1000)()
    },
    Reset() {
      this.$refs.form.resetFields()
      this.search()
    },
    search() {
      this.$refs.table.refresh(true)
    },
    callback(v) {
      this.queryParam.billStatus = v
      this.search()
    },
    relaunch(params) {
      this.params = params
      this.isRelaunch = true
      this.CreateTicketVisible = true
    },
    exportFile() {
      const that = this
      this.jsonTxt.itemsPerPage = 1000
      this.jsonTxt.currentPage = 1
      const jsonTxt = JSON.stringify(this.jsonTxt)
      exportInvoice({
        templateCode: 'forfeitInfoExport',
        jsonTxt,
        exportType: 'exportMarginDeductList',
        fileName: '罚款管理导出列表'
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
  width: 120px;
  margin-left: 10px;
}
.search {
  margin-top: 20px;
  text-align: center;
}
.buttonArarry {
  margin-bottom: 10px;
}
.cursor {
  color: #ff6b00;
  cursor: pointer;
}
.description {
  width: 200px;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap; /*文本不换行显示*/
  text-overflow: ellipsis; /*文本溢出部分用点表示*/
}
</style>

<template>
  <div class="appeal-manage-list">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="付款单号" prop="paymentBillCode">
                <a-input v-model="queryParam.paymentBillCode" placeholder="请输入付款单号" style="width: 210px" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="交易类型" prop="bill">
                <a-select
                  :key="keys"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  v-model="queryParam.sceneType"
                  :options="bill"
                  placeholder="请选择"
                  style="width: 210px"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="开票时间" prop="time">
                <a-range-picker @change="onchange" style="width: 210px" v-model="queryParam.time" />
              </a-form-model-item>
            </a-col>
            <a-col v-show="false" :md="8" :sm="24">
              <a-form-model-item style="margin-left: 15px" label="开票状态" prop="state">
                <a-select
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  :key="keys"
                  v-model="queryParam.status"
                  :options="state"
                  placeholder="请选择"
                  style="width: 210px"
                  default-value="0"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="付款单位" prop="settleObjName">
                <a-select
                  style="width: 210px"
                  class="input"
                  v-model="queryParam.buyerName"
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
              <a-form-model-item label="发票代码" prop="complaintStatus">
                <a-input v-model="queryParam.invoiceCode" placeholder="请输入收款代码" style="width: 210px" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="支付方式" prop="state">
                <a-select
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  v-model="queryParam.paymentMethod"
                  :options="state"
                  :key="keys"
                  placeholder="请选择"
                  style="width: 210px"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="发票号码" prop="complaintStatus">
                <a-input v-model="queryParam.invoiceNo" style="width: 210px" placeholder="请输入发票代码" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="订单编号" prop="orderCode">
                <a-input v-model="queryParam.orderCode" style="width: 210px" placeholder="请输入订单编号" />
              </a-form-model-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24">
              <a-form-model-item label="开票状态" prop="bill">
                <a-select
                  :key="keys"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  v-model="queryParam.status"
                  :options="bills"
                  placeholder="请选择"
                  style="width: 210px"
                >
                </a-select>
              </a-form-model-item>
            </a-col>-->
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
          <a-tab-pane key :tab="`全部(${billStatusCount.length > 0 ? billStatusCount[0].count : 0})`"></a-tab-pane>
          <a-tab-pane
            key="1"
            :tab="`待开票(${billStatusCount.length > 0 ? billStatusCount[1].count : 0})`"
            force-render
          ></a-tab-pane>
          <a-tab-pane
            key="2"
            :tab="`已开票(${billStatusCount.length > 0 ? billStatusCount[2].count : 0})`"
          ></a-tab-pane>
          <a-tab-pane
            key="3"
            :tab="`已作废(${billStatusCount.length > 0 ? billStatusCount[3].count : 0})`"
          ></a-tab-pane>
        </a-tabs>
      </div>
      <div class="buttonAraay">
        <a-button class="button1" @click="exportFile">导出</a-button>
        <a-button class="button1" @click="viewTasksVisible = true">查看任务</a-button>
      </div>
      <s-table
        name="operatorsTables"
        style="margin-top: 10px"
        rowKey="id"
        ref="table"
        :row-selection="{ onChange: onSelectChange, selectedRowKeys: selectedRowKeys }"
        :columns="columns"
        :data="getList"
        :scroll="{ x: 2500 }"
      >
        <template slot="invoiceTaskId" slot-scope="text">
          <div @click="oddnumber(text)" style="color: #ff6241">{{ text.invoiceTaskId }}</div>
        </template>
        <template slot="action" slot-scope="record">
          <div>{{ record.currentPage }}</div>
        </template>
        <template slot="status" slot-scope="text">
          <span v-show="text.status === 1">待开票</span>
          <span v-show="text.status === 2">已开票</span>
          <span v-show="text.status === 3">已作废</span>
        </template>
        <template slot="invoiceDate" slot-scope="text">
          <span>{{ text.invoiceDate | moment('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
        <template slot="invoiceAmount" slot-scope="text">
          <span>{{ text.invoiceAmount | formatCurrency(2, true) }}</span>
        </template>
        <template slot="action" slot-scope="text">
          <!-- <a href="">{{ text.invoiceStatus }}</a> -->
          <div>
            <a v-show="text.status === 1 && text.invoiceStatus === 2">
              <div @click="open(text)">开票</div>
            </a>
          </div>
          <div>
            <a v-show="text.status === 1 && text.invoiceStatus === 5 && text.invoiceTaskId">
              <div @click="open(text)">已作废重开</div>
            </a>
          </div>
          <span style="color: #ff6241" v-show="text.status === 2 && $hasOpeerate()">
            <span @click="voids(text)">发票作废</span>
          </span>
        </template>
        <template slot="invoiceType" slot-scope="text">
          <div v-show="text.invoiceType === 1">增值税普通发票</div>
          <div v-show="text.invoiceType === 2">增值税专用发票</div>
        </template>
        <template slot="invoiceFileType" slot-scope="text">
          <div v-show="text.invoiceFileType === 1">电子发票</div>
          <div v-show="text.invoiceFileType === 2">纸质发票</div>
        </template>
      </s-table>
    </a-card>
    <Upload ref="Upload" />
    <Uploads ref="Uploads" />
    <Void ref="void" />
    <SystemctlTips :visible="systemctlTipsVisible" @close="systemctlTipsVisible = false" :code="exportCode" />
    <ViewTasks :visible="viewTasksVisible" @close="viewTasksVisible = false" taskType="invoiceInfoExport" />
  </div>
</template>

<script>
import SystemctlTips from '@/components/exportFile/systemctlTips'
import ViewTasks from '@/components/exportFile/viewTasks'
import { getList } from '@/api/invoice'
import Upload from './components/Upload.vue'
import Uploads from './components/Uploads.vue'
import Void from '@/views/finance/components/void'
import _ from 'loadsh'
import { queryMerchantLikeName } from '@/api/custom'
import { detailedExport, exportId } from '@/api/fince'
export default {
  data() {
    return {
      searchMerchantLis: [],
      colorList: ['orange', 'blue', 'red'],
      selectedRowKeys: [],
      exportCode: 0,
      systemctlTipsVisible: false,
      viewTasksVisible: false,
      bill: [
        {
          label: '全部',
          value: '0'
        },
        {
          label: '套餐费',
          value: '1'
        },
        {
          label: '标书费',
          value: '12'
        }
      ],
      state: [
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
        }
      ],
      transaction: [],
      columns: [
        {
          title: '发票任务ID',
          key: 'invoiceTaskId',
          width: 200,
          scopedSlots: { customRender: 'invoiceTaskId' }
        },
        {
          title: '付款单号',
          key: 'paymentBillCode',
          dataIndex: 'paymentBillCode',
          width: 180
        },
        {
          title: '订单编号',
          width: 180,
          key: 'orderCode',
          align: 'center',
          dataIndex: 'orderCode'
        },
        {
          title: '摘要',
          width: 180,
          key: 'digest',
          align: 'center',
          dataIndex: 'digest'
        },
        {
          title: '发票类型',
          key: 'invoiceType',
          scopedSlots: { customRender: 'invoiceType' }
        },
        {
          title: '发票形式',
          key: 'invoiceFileType',
          scopedSlots: { customRender: 'invoiceFileType' }
        },

        {
          title: '发票金额(元)',
          key: 'invoiceAmount',
          scopedSlots: { customRender: 'invoiceAmount' }
        },
        { title: '发票代码', key: 'invoiceCode', dataIndex: 'invoiceCode' },
        { title: '发票号码', key: 'invoiceNo', dataIndex: 'invoiceNo' },
        {
          title: '开票状态',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        },
        // { title: '收款单位', key: 'payeeName', dataIndex: 'payeeName' },
        // 平台不显示收款单位
        { title: '付款单位', key: 'buyerName', dataIndex: 'buyerName', width: 245, ellipsis: true, align: 'center' },
        {
          title: '开票时间',
          key: 'invoiceDate',
          scopedSlots: { customRender: 'invoiceDate' }
        },
        { title: '备注', key: 'remark', dataIndex: 'remark' },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      queryParam: {
        time: null,
        paymentBillCode: null,
        sceneType: '0',
        paymentMethod: '0',
        invoiceCode: null,
        invoiceNo: null,
        merchantName: null,
        status: '0',
        buyerId: '0',
        buyerName: [],
        orderCode: ''
      },
      advanced: false,
      list: [],
      total: '',
      all: '',
      billStatusCount: [],
      keys: 1
    }
  },
  components: {
    Upload,
    Void,
    Uploads,
    SystemctlTips,
    ViewTasks
  },
  mounted() {
    this.queryMerchantLikeName()
  },
  methods: {
    open(data) {
      this.$refs['Uploads'].init(data)
    },
    Reopen(data) {
      this.$refs['Upload'].init(data)
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
    // uploadsClick() {
    //   this.$refs['Uploads'].init()
    // },
    // uploadClick() {
    //   this.$refs['Upload'].init()
    // },
    // 时间
    onchange(time) {
      this.queryParam.time = time
    },
    // 点击作废
    voids(text) {
      this.$refs.void.visible = true
      this.$refs.void.form.id = text.id
    },
    // 点击单号
    oddnumber(text) {
      this.$router.push({
        name: 'SysoperatorsInvoiceDetails',
        params: {
          id: text.id
        }
      })
    },
    exportFile() {
      const that = this
      delete this.jsonTxt.itemsPerPage
      delete this.jsonTxt.currentPage
      const jsonTxt = JSON.stringify(this.jsonTxt)
      detailedExport({
        templateCode: 'invoiceInfoExport',
        jsonTxt,
        exportType: 'exportInvoiceInfoList',
        fileName: '发票信息导出列表'
      }).then((res) => {
        if (res.code === '0') {
          exportId({ taskType: 'invoiceInfoExport' }).then((res) => {
            if (res.code === '0') {
              that.systemctlTipsVisible = true
              that.exportCode = res.data
            }
          })
        }
      })
    },
    callback(key) {
      this.queryParam.status = Number(key)
      this.$refs.table.refresh(true)
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
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
      if (typeof data.buyerName === 'object') {
        data.buyerName = ''
      }
      this.jsonTxt = { ...data }
      const res = getList({ ...data })
      res.then((res) => {
        if (res.code === '0') {
          this.total = res.data.total
          this.billStatusCount = res.data.billStatusCount
        }
      })
      return res
    },
    handleReset() {
      this.keys++
      this.queryParam = {
        time: null,
        paymentBillCode: null,
        sceneType: '0',
        paymentMethod: '0',
        invoiceCode: null,
        invoiceNo: null,
        merchantName: null,
        status: '0',
        buyerId: '0'
      }
      this.searchMerchantLis = []
      this.queryParam.buyerName = []
      this.$refs.ruleForm.resetFields()
      this.search()
      this.queryMerchantLikeName()
    },
    // buyerName(v) {
    //   this.queryParam.merchantName = v
    // },
    // 查询
    search() {
      this.$refs.table.refresh(true)
    }
    //
  }
}
</script>

<style lang="less" scopeds>
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

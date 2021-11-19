<template>
  <div class="appeal-manage-list">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item style="margin-left: 14px" label="付款单号" prop="complaintStatus">
                <a-input v-model="queryParam.paymentBillCode" style="width: 210px" placeholder="请输入付款单号" />
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
                <a-range-picker format="YYYY-MM-DD" @change="onchange" v-model="queryParam.time" />
              </a-form-model-item>
            </a-col>
            <a-col v-show="false" :md="8" :sm="24">
              <a-form-model-item style="margin-left: 15px" label="开票状态" prop="state">
                <a-select
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  :key="keys"
                  @change="states"
                  :options="state"
                  placeholder="请选择"
                  style="width: 210px"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item style="margin-left: 15px" label="收款单位" prop="settleObjName">
                <a-select
                  style="width: 210px"
                  v-model="queryParam.payeeName"
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
                  <a-select-option v-for="item in searchMerchantLis" :key="item.value" :value="item.settleObjName">{{
                    item.settleObjName
                  }}</a-select-option>
                </a-select>
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
        <!-- <a-button class="button1">发票作废</a-button> -->
        <a-button class="button1" @click="exportFile">导出</a-button>
        <a-button class="button1" @click="viewTasksVisible = true">查看任务</a-button>
      </div>

      <s-table
        name="invoiceTable"
        style="margin-top: 10px"
        :row-selection="{ onChange: onSelectChange, selectedRowKeys: selectedRowKeys }"
        rowKey="id"
        ref="table"
        :columns="columns"
        :data="getList"
        :scroll="{ x: 2100 }"
      >
        <template slot="aodds" slot-scope="record">
          <div @click="oddnumber(record)" style="color: #ff6241">{{ record.invoiceTaskId }}</div>
        </template>
        <template slot="action" slot-scope="record">
          <div>{{ record.currentPage }}</div>
        </template>
        <template slot="odd" slot-scope="text">
          <span>{{ text.paymentBillCode }}</span>
        </template>
        <template slot="state" slot-scope="status">
          <span v-show="status === 1">待开票</span>
          <span v-show="status === 2">已开票</span>
          <span v-show="status === 3">已作废</span>
        </template>
        <template slot="billingTime" slot-scope="invoiceDate">
          <span>{{ invoiceDate | moment('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
        <template slot="invoiceAmount" slot-scope="invoiceAmount">
          <span>{{ invoiceAmount | formatCurrency(2, true) }}</span>
        </template>
        <template slot="action" slot-scope="text, record">
          <!-- <a href="">{{ text.invoiceStatus }}</a> -->
          <a v-show="text.status === 1 && !text.invoiceTaskId">
            <Apply :value="record" />
          </a>
          <span style="color: #ff6241" v-show="text.status === 2">
            <a style="margin-right: 10px" @click="dowlod(text.pdfUrl === null ? text.qrCodeUrl : text.pdfUrl)">
              下载发票
            </a>
            <span @click="voids(text)" v-if="false">作废</span>
          </span>
          <a v-show="text.status === 3 && text.invoiceStatus !== 5">
            <Applys :value="record" />
          </a>
        </template>
        <template slot="type" slot-scope="invoiceType">
          <div v-show="invoiceType === 1">增值税普通发票</div>
          <div v-show="invoiceType === 2">增值税专用发票</div>
        </template>
        <template slot="Electronics" slot-scope="invoiceFileType">
          <div v-show="invoiceFileType === 1">电子发票</div>
          <div v-show="invoiceFileType === 2">纸质发票</div>
        </template>
      </s-table>
    </a-card>
    <Void ref="void" />
    <SystemctlTips :visible="systemctlTipsVisible" @close="systemctlTipsVisible = false" :code="exportCode" />
    <ViewTasks :visible="viewTasksVisible" @close="viewTasksVisible = false" taskType="merchantInvoiceInfoExport" />
  </div>
</template>

<script>
import SystemctlTips from '@/components/exportFile/systemctlTips'
import ViewTasks from '@/components/exportFile/viewTasks'
import { getList } from '@/api/invoice'
import Apply from './components/apply.vue'
import Applys from './components/applys.vue'
import Void from '@/views/finance/components/void'
import { detailedExport, exportId } from '@/api/fince'
import _ from 'loadsh'
import { queryMerchantLikeName } from '@/api/custom'
export default {
  components: {
    Apply,
    Void,
    Applys,
    SystemctlTips,
    ViewTasks
  },
  data() {
    return {
      viewTasksVisible: false,
      systemctlTipsVisible: false,
      searchMerchantLis: [], // 搜索下拉框值
      selectedRowKeys: [],
      jsonTxt: {},
      exportCode: 0,
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
      bills: [
        {
          label: '全部',
          value: '0'
        },
        {
          label: '待开票',
          value: '1'
        },
        {
          label: '已开票',
          value: '2'
        },
        {
          label: '已作废',
          value: '3'
        }
      ],
      state: [
        {
          label: '待开票',
          value: '1'
        },
        {
          label: '已开票',
          value: '2'
        },
        {
          label: '已作废',
          value: '3'
        }
      ],
      Company: [],
      transaction: [],
      columns: [
        {
          title: '发票任务ID',
          align: 'center',
          width: 210,
          key: 'aodds',
          scopedSlots: { customRender: 'aodds' }
        },
        {
          title: '付款单号',
          width: 180,
          key: 'odds',
          align: 'center',
          scopedSlots: { customRender: 'odd' }
        },
        {
          title: '订单编号',
          width: 180,
          key: 'orderCode',
          dataIndex: 'orderCode',
          align: 'center'
        },
        {
          title: '摘要',
          width: 180,
          key: 'digest',
          dataIndex: 'digest',
          align: 'center'
        },
        {
          title: '发票类型',
          align: 'center',
          dataIndex: 'invoiceType',
          width: 130,
          key: 'invoiceType',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '发票形式',
          align: 'center',
          dataIndex: 'invoiceFileType',
          key: 'invoiceFileType',
          width: 130,
          scopedSlots: { customRender: 'Electronics' }
        },
        {
          title: '发票金额(元)',
          align: 'center',
          width: 115,
          key: 'invoiceAmount',
          dataIndex: 'invoiceAmount',
          scopedSlots: { customRender: 'invoiceAmount' }
        },
        { title: '发票代码', width: 155, align: 'center', key: 'invoiceCode', dataIndex: 'invoiceCode' },
        { title: '发票号码', width: 155, align: 'center', key: 'invoiceNo', dataIndex: 'invoiceNo' },
        {
          title: '开票状态',
          width: 130,
          align: 'center',
          dataIndex: 'status',
          key: 'state',
          scopedSlots: { customRender: 'state' }
        },
        // 商家平台不显示付款单位
        { title: '收款单位', width: 245, ellipsis: true, align: 'center', key: 'payeeName', dataIndex: 'payeeName' },
        // { title: '付款单位', width: 245, ellipsis: true, align: 'center', key: 'buyerName', dataIndex: 'buyerName' },
        {
          title: '开票时间',
          width: 230,
          key: 'billingTime',
          align: 'center',
          dataIndex: 'invoiceDate',
          scopedSlots: { customRender: 'billingTime' }
        },
        { title: '备注', width: 150, ellipsis: true, key: 'remark', dataIndex: 'remark' },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 150,
          scopedSlots: { customRender: 'action' }
        }
      ],
      queryParam: {
        time: null,
        paymentBillCode: null,
        payeeName: '',
        sceneType: '0',
        status: '0',
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
  mounted() {
    this.queryMerchantLikeName()
    if (this.$route.params.id !== undefined) {
      this.paymentBillCode = this.$route.params.id
      this.status = 1
    } else {
      this.paymentBillCode = null
    }
  },
  methods: {
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
    exportFile() {
      const that = this
      this.jsonTxt.itemsPerPage = 1000
      this.jsonTxt.currentPage = 1
      const jsonTxt = JSON.stringify(this.jsonTxt)
      detailedExport({
        templateCode: 'merchantInvoiceInfoExport',
        jsonTxt,
        exportType: 'exportInvoiceInfoList',
        fileName: '发票信息导出列表'
      }).then((res) => {
        if (res.code === '0') {
          exportId({ taskType: 'merchantInvoiceInfoExport' }).then((res) => {
            if (res.code === '0') {
              that.systemctlTipsVisible = true
              that.exportCode = res.data
            }
          })
        }
      })
    },
    // 下载
    async dowlod(url) {
      const response = await fetch(url)
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = name
      a.click()
      a.remove()
    },
    // 时间
    onchange(time, a) {
      this.queryParam.time = time
    },
    // 点击作废
    voids(text) {
      this.$refs.void.visible = true
      this.$refs.void.form.id = text.id
    },
    // 点击单号
    oddnumber(text) {
      console.log(text)
      this.$router.push({
        name: 'suppliersInvoiceDetails',
        params: {
          id: text.id
        }
      })
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    callback(key) {
      this.queryParam.status = key
      this.$refs.table.refresh(true)
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
      this.jsonTxt = { ...data }
      const res = await getList({ ...data })
      if (res.code === '0') {
        const newData = JSON.parse(JSON.stringify(res))
        // invoiceAmount
        // toFixed(2)
        if (res.data.listObj.length > 0) {
          this.jsonTxt.buyerId = res.data.listObj[0].buyerId
        }
        // newData.data.listObj.forEach((item) => {
        //   item.invoiceAmount = item.invoiceAmount.toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
        // })
        this.total = newData.data.total
        this.billStatusCount = newData.data.billStatusCount
        return newData
      }
    },
    states(v) {
      this.queryParam.state = v
    },
    // PayeeName(v) {
    //   this.queryParam.PayeeName = v
    // },
    handleReset() {
      this.keys++
      this.searchMerchantLis = []
      this.queryParam.payeeName = ''
      this.queryParam = {
        time: null,
        paymentBillCode: null,
        payeeName: null,
        sceneType: '0',
        status: '0'
      }
      this.search()
      this.queryMerchantLikeName()
    },
    // 查询
    search() {
      this.$refs.table.refresh(true)
    }
    //
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

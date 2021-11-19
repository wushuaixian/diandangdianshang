<template>
  <div class="appeal-manage-list">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="付款单号" prop="receiptBillCode">
                <a-input v-model="queryParam.paymentBillCode" style="width: 210px" placeholder="请输入付款单号" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="交易类型" prop="sceneType">
                <a-select
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
              <a-form-model-item label="付款时间" prop="time">
                <a-range-picker v-model="queryParam.time" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="支付方式" prop="paymentMethod">
                <a-select
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  v-model="queryParam.paymentMethod"
                  :options="state"
                  placeholder="请选择"
                  style="width: 210px"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item style="margin-left: 13px" label="付款人" prop="complaintStatus">
                <a-input v-model="queryParam.userName" style="width: 210px" placeholder="请输入付款人" />
              </a-form-model-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24"> -->
            <!-- <a-form-model-item label="收款单位" prop="state">
                <a-select
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  @change="settleObjName"
                  :options="state"
                  placeholder="请选择"
                  style="width: 210px"
                >
                </a-select>
            </a-form-model-item>-->
            <!-- </a-col> -->
            <a-col :md="8" :sm="24">
              <a-form-model-item label="收款单位" prop="settleObjName">
                <a-select
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
            <a-col :md="24" :sm="24" class="button">
              <a-button @click="handleReset">重置</a-button>
              <a-button type="primary" @click="search">查询</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>

    <a-card>
      <div class="buttonAraay">
        <a-button class="button1" @click="exportFile">导出</a-button>
        <a-button class="button1" @click="viewTasksVisible = true">查看任务</a-button>
      </div>
      <s-table
        name="paymentRecordsTables"
        style="margin-top: 10px"
        rowKey="id"
        ref="table"
        :columns="columns"
        :data="FlowLis"
        :scroll="{ x: 1750 }"
      >
        <template slot="code" slot-scope="text">
          <a @click="code(text)">{{ text.paymentBillCode }}</a>
        </template>
        <template slot="method" slot-scope="paymentMethod">
          <span v-show="paymentMethod === 1">银联</span>
          <span v-show="paymentMethod === 2">账户</span>
          <span v-show="paymentMethod === 3">微信</span>
          <span v-show="paymentMethod === 4">支付宝</span>
          <span v-show="paymentMethod === 5">线下打款</span>
        </template>
        <template slot="status" slot-scope="billStatus">
          <span v-show="billStatus === 1">待审核</span>
          <span v-show="billStatus === 2">审核驳回</span>
          <span v-show="billStatus === 3">待申请付款</span>
          <span v-show="billStatus === 4">已申请待批款</span>
          <span v-show="billStatus === 5">付款申请不通过</span>
          <span v-show="billStatus === 6">付款中</span>
          <span v-show="billStatus === 7">待确认</span>
          <span v-show="billStatus === 8">已完成</span>
          <span v-show="billStatus === 9">已关闭</span>
        </template>
        <template slot="type" slot-scope="sceneType">
          <span v-show="sceneType === 1">套餐费</span>
          <span v-show="sceneType === 11">寻源保证金</span>
          <span v-show="sceneType === 12">标书费</span>
          <span v-show="sceneType === 13">平台保证金</span>
          <span v-show="sceneType === 14">寻源保证金退款</span>
        </template>
        <template slot="odds" slot-scope="text">
          <span>{{ text.feeAmt | formatCurrency(2, true) }}</span>
        </template>
        <template slot="time" slot-scope="createTime">
          <span>{{ createTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </s-table>
    </a-card>
    <SystemctlTips :visible="systemctlTipsVisible" @close="systemctlTipsVisible = false" :code="exportCode" />
    <ViewTasks :visible="viewTasksVisible" @close="viewTasksVisible = false" taskType="paymentNoteFlowLlistExport" />
  </div>
</template>

<script>
import SystemctlTips from '@/components/exportFile/systemctlTips'
import ViewTasks from '@/components/exportFile/viewTasks'
import { FlowLis } from '@/api/invoice'
import { queryMerchantLikeName } from '@/api/custom'
import { feeBillManageImplExport, exportId } from '@/api/fince'
import _ from 'loadsh'
export default {
  components: {
    SystemctlTips,
    ViewTasks
  },
  data() {
    return {
      systemctlTipsVisible: false,
      viewTasksVisible: false,
      exportCode: 0,
      feeBillManageImplExport,
      selectedRowKeys: [],
      jsonTxt: {},
      bill: [
        {
          label: '套餐费',
          value: '1'
        },
        {
          label: '标书费',
          value: '12'
        },
        {
          label: '保证金',
          value: '13'
        }
      ],
      state: [
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
      Company: [],
      transaction: [],
      columns: [
        {
          title: '付款单号',
          key: 'code',
          width: 200,
          scopedSlots: { customRender: 'code' }
        },
        {
          title: '支付流水号',
          width: 120,
          key: 'settlementCode',
          dataIndex: 'settlementCode',
          scopedSlots: { customRender: 'odd' }
        },
        { title: '付款金额(元)', width: 150, key: 'odds', scopedSlots: { customRender: 'odds' } },
        { title: '收款单位', width: 200, key: 'payeeAccountName', dataIndex: 'payeeAccountName' },
        {
          title: '支付方式',
          dataIndex: 'paymentMethod',
          key: 'paymentMethod',
          width: 150,
          scopedSlots: { customRender: 'method' }
        },
        {
          title: '支付状态',
          width: 150,
          dataIndex: 'billStatus',
          key: 'billStatus',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '交易类型',
          width: 150,
          dataIndex: 'sceneType',
          key: 'sceneType',
          scopedSlots: { customRender: 'type' }
        },
        { title: '付款人', width: 150, key: 'updateUsername', dataIndex: 'updateUsername' },
        {
          title: '付款时间',
          width: 200,
          dataIndex: 'createTime',
          key: 'createTime',
          scopedSlots: { customRender: 'time' }
        },
        { title: '备注', width: 150, key: 'remark', dataIndex: 'remark' }
      ],
      searchMerchantLis: [], // 搜索下拉框值
      queryParam: {
        paymentBillCode: null,
        sceneType: [],
        time: null,
        paymentMethod: [],
        userName: null,
        settleObjName: [],
        merchantStatus: this.$hasOpeerate() ? 0 : null
        // merchantName: ''
      },
      advanced: false
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
        templateCode: 'paymentNoteFlowLlistExport',
        jsonTxt,
        exportType: 'exportInvoiceInfoList',
        fileName: '平台保证金退还列表'
      }).then((res) => {
        if (res.code === '0') {
          exportId({ taskType: 'paymentNoteFlowLlistExport' }).then((res) => {
            if (res.code === '0') {
              that.systemctlTipsVisible = true
              that.exportCode = res.data
            }
          })
        }
      })
    },
    code(text) {
      this.$router.push({
        name: 'SysPaymentRecordsDetail',
        query: {
          id: text.id
        }
      })
    },
    // 获取列表
    async FlowLis(pagination) {
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
        data.sceneType = ''
      }
      if (typeof data.paymentMethod === 'object') {
        data.paymentMethod = ''
      }
      if (typeof data.settleObjName === 'object') {
        data.settleObjName = ''
      }
      delete data.time
      this.jsonTxt = { ...data }
      return FlowLis({ ...data })
    },
    // settleObjName(v) {
    //   this.queryParam.settleObjName = v
    // },
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
      this.queryParam.settleObjName = ''
      this.queryParam = {}
      this.$refs.ruleForm.resetFields()
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

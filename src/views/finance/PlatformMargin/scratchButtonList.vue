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
              <a-form-model-item label="单位名称" prop="merchantName">
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
            <a-col :md="8">
              <a-form-model-item label="划扣款项" prop="deductType">
                <a-select class="inp" v-model="queryParam.deductType">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">平台罚款</a-select-option>
                  <a-select-option value="2">成交服务费</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="触发原因" prop="deductReason">
                <a-select class="inp" v-model="queryParam.deductReason">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="时长">时长</a-select-option>
                  <a-select-option value="比例">比例</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- <a-col :md="8">
              <a-form-model-item label="划扣状态" prop="deductStatus">
                <a-select class="inp" v-model="queryParam.deductStatus">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">待划扣</a-select-option>
                  <a-select-option value="2">已完成</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col> -->
            <a-col :md="8">
              <a-form-model-item label="触发日期" prop="start">
                <a-range-picker class="inp" v-model="queryParam.start" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="划扣日期" prop="pay">
                <a-range-picker class="inp" v-model="queryParam.pay" />
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
        <a-tab-pane :key="1" :tab="'待划扣(' + number[1] + ')'" force-render></a-tab-pane>
        <a-tab-pane :key="2" :tab="'已完成(' + number[2] + ')'"></a-tab-pane>
        <a-tab-pane :key="3" :tab="'已取消(' + number[3] + ')'"></a-tab-pane>
      </a-tabs>
      <!-- <a-button type="primary">执行划扣</a-button> -->
      <div class="buttonArray">
        <a-button class="button" @click="exportFile">导出</a-button>
        <a-button class="button" @click="viewTasksVisible = true">查看任务</a-button>
      </div>
      <s-table
        rowKey="companyId"
        name="scratchButtonList"
        ref="table"
        :scroll="{ x: 2000 }"
        :columns="columns"
        :data="init"
      >
        <template slot="deductApplyTime" slot-scope="text">
          <span>{{ text.deductApplyTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
        <template slot="payTime" slot-scope="text">
          <span>{{ text.payTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
        <template slot="action" slot-scope="text">
          <span v-show="text.deductStatus === 1" class="executionDeduction" @click="executionDeduction(text)">
            执行划扣
          </span>
        </template>
        <template slot-scope="text" slot="deductApplyAmount">
          <span>{{ text.deductApplyAmount | formatCurrency(2, true) }}</span>
        </template>
        <template slot-scope="text" slot="deductType">
          <span v-show="text.deductType === 1"> 平台罚款 </span>
          <span v-show="text.deductType === 2"> 成交服务费 </span>
        </template>
        <template slot-scope="text" slot="deductStatus">
          <span v-show="text.deductStatus === 1"> 待划扣 </span>
          <span v-show="text.deductStatus === 2"> 已完成 </span>
          <span v-show="text.deductStatus === 3"> 已取消 </span>
        </template>
      </s-table>
    </a-card>
    <ExecutionDeductionPopup
      :visible="executionDeductionPopupVisible"
      :params="params"
      @search="search"
      @close="executionDeductionPopupVisible = false"
    />
    <SystemctlTips :visible="systemctlTipsVisible" @close="systemctlTipsVisible = false" :code="exportCode" />
    <ViewTasks :visible="viewTasksVisible" @close="viewTasksVisible = false" taskType="marginDeductExport" />
  </div>
</template>
<script>
import ExecutionDeductionPopup from './components/executionDeduction'
import SystemctlTips from '@/components/exportFile/systemctlTips'
import ViewTasks from '@/components/exportFile/viewTasks'
import { bondBuckleList, queryCompanyName, exportInvoice, exportId } from '@/api/fince'
import _ from 'loadsh'
export default {
  components: {
    ExecutionDeductionPopup,
    SystemctlTips,
    ViewTasks
  },
  data() {
    return {
      systemctlTipsVisible: false,
      viewTasksVisible: false,
      exportCode: 0,
      executionDeductionPopupVisible: false,
      isRelaunch: false,
      queryParam: {
        merchantName: [],
        deductType: '',
        deductReason: '',
        deductStatus: '',
        start: null,
        pay: null
      },
      params: {},
      number: {
        0: 0,
        1: 0,
        2: 0,
        3: 0
      },
      comList: [],
      jsonTxt: {},
      columns: [
        {
          title: '付款单位',
          key: 'merchantName',
          dataIndex: 'merchantName'
        },
        {
          title: '划扣款项',
          key: 'deductType',
          scopedSlots: { customRender: 'deductType' }
        },
        {
          title: '金额(元)',
          key: 'deductApplyAmount',
          scopedSlots: { customRender: 'deductApplyAmount' }
        },
        {
          title: '应付单号',
          key: 'feeBillCode',
          dataIndex: 'feeBillCode'
        },
        {
          title: '状态',
          key: 'deductStatus',
          scopedSlots: { customRender: 'deductStatus' }
        },
        {
          title: '触发原因',
          key: 'deductReason',
          dataIndex: 'deductReason'
        },
        {
          title: '触发日期',
          key: 'deductApplyTime',
          scopedSlots: { customRender: 'deductApplyTime' }
        },
        {
          title: '划扣日期',
          key: 'payTime',
          scopedSlots: { customRender: 'payTime' }
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
  created() {
    queryCompanyName({ likeName: '' }).then((res) => {
      if (res.code === '0') {
        this.comList = new Set(res.data)
      }
    })
  },
  methods: {
    async init(params) {
      const data = {
        ...params,
        ...this.queryParam
      }
      if (typeof data.merchantName === 'object') {
        data.merchantName = ''
      }
      if (data.pay) {
        const [beginTime, endTime] = data.pay
        data.payFrom = beginTime
        data.payTo = endTime
      }
      if (data.start) {
        const [beginTime, endTime] = data.start
        data.startFrom = beginTime
        data.startTo = endTime
      }
      this.jsonTxt = { ...data }
      const res = bondBuckleList({ ...data })
      res.then((res) => {
        if (res.code === '0') {
          this.number[0] = res.data.billStatusCount[0].count
          this.number[1] = res.data.billStatusCount[1].count
          this.number[2] = res.data.billStatusCount[2].count
          this.number[3] = res.data.billStatusCount[3].count
        }
      })
      return res
    },
    executionDeduction(text) {
      this.params = { ...text }
      this.executionDeductionPopupVisible = true
    },
    exportFile() {
      const that = this
      delete this.jsonTxt.itemsPerPage
      delete this.jsonTxt.currentPage
      const jsonTxt = JSON.stringify(this.jsonTxt)
      exportInvoice({
        templateCode: 'marginDeductExport',
        jsonTxt,
        exportType: 'exportMarginDeductList',
        fileName: '保证金划扣导出列表'
      }).then((res) => {
        if (res.code === '0') {
          exportId({ taskType: 'marginDeductExport' }).then((res) => {
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
    },
    search() {
      this.$refs.table.refresh(true)
    },
    callback(v) {
      this.queryParam.deductStatus = v
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
  width: 210px;
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
}
</style>

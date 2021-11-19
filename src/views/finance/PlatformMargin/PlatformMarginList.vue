<template>
  <div>
    <a-card :bordered="false">
      <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
        <a-row :gutter="48">
          <a-col :md="24" :sm="24">
            <p style="margin-top: 10px; color: #262626; font-weight: bold">
              <span>平台保证金总额:</span>
              <span>{{ Money }}元</span>
            </p>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="付款单位" prop="merchantName">
              <a-select
                style="width: 210px"
                v-model="queryParam.merchantName"
                show-search
                :allowClear="true"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                @search="handleSearch"
                placeholder="请选择付款单位"
                :getPopupContainer="
                  (triggerNode) => {
                    return triggerNode.parentNode || document.body
                  }
                "
              >
                <a-select-option v-for="item in searchMerchantLis" :key="item.value" :value="item.payname">{{
                  item.payname
                }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col :md="24" :sm="24" class="button" style="text-align: center">
            <a-button @click="handleReset">重置</a-button>
            <a-button type="primary" @click="search">查询</a-button>
          </a-col>
        </a-row>
      </a-form-model>
    </a-card>
    <a-card :bordered="false" style="margin-top: 24px">
      <div class="buttonAraay">
        <a-button class="button1" @click="exportFile">导出</a-button>
        <a-button class="button1" @click="viewTasksVisible = true">查看任务</a-button>
      </div>
      <s-table
        name="PlatformMarginListTable"
        :columns="columns"
        :data="performanceList"
        ref="table"
        rowKey="payname"
        :scroll="{ x: 1500 }"
      >
        <template v-slot:payname="props">
          <a-tooltip placement="top">
            <template slot="title">
              <div>{{ props.payname }}</div>
            </template>
            <div class="enterpriseName">{{ props.payname }}</div>
          </a-tooltip>
        </template>
        <template slot="balance" slot-scope="text">
          <span>{{ text.balance ? text.balance : 0 | formatCurrency(2, true) }}</span>
        </template>
        <template v-slot:action="text">
          <span class="bluetext" style="color: #ff6b00">
            <span @click="ApplicationPayment(text)">明细</span>
          </span>
        </template>
      </s-table>
    </a-card>
    <Detailed ref="detailed" />
    <SystemctlTips :visible="systemctlTipsVisible" @close="systemctlTipsVisible = false" :code="exportCode" />
    <ViewTasks :visible="viewTasksVisible" @close="viewTasksVisible = false" taskType="platformDepositExcelExport" />
  </div>
</template>

<script>
import { performanceList, totalMoney } from '@/api/PlatformMarginList'
import SystemctlTips from '@/components/exportFile/systemctlTips'
import ViewTasks from '@/components/exportFile/viewTasks'
import { exportInvoice, exportId } from '@/api/fince'
import { Detailed } from './components'
import _ from 'loadsh'
export default {
  components: { Detailed, SystemctlTips, ViewTasks },
  data() {
    return {
      exportCode: 0,
      systemctlTipsVisible: false,
      viewTasksVisible: false,
      jsonTxt: {},
      Money: '',
      queryParam: {
        merchantName: []
      },
      options: [
        {
          label: '缴纳保证金',
          value: '1'
        },
        {
          label: '退还保证金',
          value: '2'
        },
        {
          label: '项目占用',
          value: '3'
        },
        {
          label: '平台罚款',
          value: '4'
        },
        {
          label: '成交服务费划扣',
          value: '5'
        }
      ],
      searchMerchantLis: [], // 搜索下拉框值
      columns: [
        {
          title: '付款单位',
          scopedSlots: { customRender: 'payname' },
          width: 260,
          ellipsis: 'true',
          key: 'payname',
          fixed: 'left'
        },
        { title: '平台保证金余额(元)', key: 'balance', width: 500, scopedSlots: { customRender: 'balance' } },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 180,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  created() {
    this.totalMoney()
  },
  methods: {
    handleSearch(merchantName) {
      if (!merchantName.trim()) return
      _.debounce(async () => {
        const res = await performanceList({ merchantName, currentPage: 1, itemsPerPage: 10 })
        if (res.code === '0') {
          this.searchMerchantLis = res?.data?.listObj
        }
      }, 1000)()
    },
    async totalMoney() {
      const data = await totalMoney()
      this.Money = data.data.toLocaleString('en-US')
    },
    async performanceList(pagination) {
      const { queryParam } = this
      const data = {
        ...pagination,
        ...queryParam
      }
      if (typeof data.merchantName === 'object') {
        data.merchantName = ''
      }
      this.jsonTxt = { ...data }
      const data2 = await performanceList({ ...data })
      this.searchMerchantLis = data2.data.listObj
      return data2
    },
    handleReset() {
      this.searchMerchantLis = []
      this.queryParam.merchantName = []
      this.search()
    },
    exportFile() {
      const that = this
      delete this.jsonTxt.itemsPerPage
      delete this.jsonTxt.currentPage
      const jsonTxt = JSON.stringify(this.jsonTxt)
      exportInvoice({
        templateCode: 'platformDepositExcelExport',
        jsonTxt,
        exportType: 'exportInvoiceInfoList',
        fileName: '平台保证金管理列表'
      }).then((res) => {
        if (res.code === '0') {
          exportId({ taskType: 'platformDepositExcelExport' }).then((res) => {
            if (res.code === '0') {
              that.systemctlTipsVisible = true
              that.exportCode = res.data
            }
          })
        }
      })
    },
    search() {
      this.$refs.table.refresh(true)
    },
    ApplicationPayment(id) {
      this.$refs['detailed'].init(id)
    }
  }
}
</script>

<style lang='less' scoped>
.buttonAraay {
  margin-bottom: 10px;
  .button1 {
    width: 100px;
    margin-right: 10px;
  }
}
.enterpriseName {
  width: 220px;
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; //溢出不换行
}
</style>

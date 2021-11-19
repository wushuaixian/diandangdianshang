<template>
  <div class="template-list">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="公司名称" prop="merchantName">
                <a-select
                  show-search
                  v-model="queryParam.merchantName"
                  placeholder="请选择"
                  class="inp"
                  :filter-option="false"
                  :not-found-content="fetching ? undefined : null"
                  @search="fetchUser"
                  @change="handleChange"
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option v-for="d in comList" :key="d">
                    {{ d }}
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
        <a-button class="button" @click="exportFile">导出</a-button>
        <a-button class="button" @click="viewTasksVisible = true">查看任务</a-button>
      </div>
      <s-table
        name="template"
        style="margin-top: 10px"
        rowKey="merchantId"
        ref="table"
        :columns="columns"
        :data="init"
        :scroll="{ x: 600 }"
      >
        <template slot="balance" slot-scope="text">
          {{ text.balance | formatCurrency(2, true) }}
        </template>
        <template slot="frozenBalance" slot-scope="text">
          {{ text.frozenBalance | formatCurrency(2, true) }}
        </template>
        <template slot="action" slot-scope="props">
          <router-link
            :to="{ name: 'sysBusinessBalanceAdministratordetailed', params: { merchantId: props.merchantId, id: 3 } }"
          >
            <span class="detailed">明细</span></router-link
          >
        </template>
      </s-table>
    </a-card>
    <SystemctlTips :visible="systemctlTipsVisible" @close="systemctlTipsVisible = false" :code="exportCode" />
    <ViewTasks
      :visible="viewTasksVisible"
      @close="viewTasksVisible = false"
      taskType="merchantBalanceManageExcelExport"
    />
  </div>
</template>

<script>
import { businessBalanceAdminList, exportInvoice, exportId } from '@/api/fince'
import SystemctlTips from '@/components/exportFile/systemctlTips'
import ViewTasks from '@/components/exportFile/viewTasks'
export default {
  components: {
    SystemctlTips,
    ViewTasks
  },
  created() {},
  computed: {},
  data() {
    return {
      columns: [
        { title: '商家名称', key: 'merchantName', dataIndex: 'merchantName' },
        { title: '现金余额(元)', key: 'balance', scopedSlots: { customRender: 'balance' } },
        { title: '冻结金额', key: 'frozenBalance', scopedSlots: { customRender: 'frozenBalance' } },
        { key: 'action', scopedSlots: { customRender: 'action' } }
      ],
      comList: [],
      supList: [],
      exportCode: 0,
      systemctlTipsVisible: false,
      viewTasksVisible: false,
      fetching: false,
      jsonTxt: {},
      queryParam: {
        merchantName: []
      }
    }
  },
  mounted() {
    businessBalanceAdminList({
      currentPage: 1,
      itemsPerPage: 1000,
      merchantName: ''
    }).then((res) => {
      if (res.code === '0') {
        for (let i = 0; i < res.data.listObj.length; i++) {
          this.comList.push(res.data.listObj[i].merchantName)
        }
        this.comList = new Set([...this.comList])
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
        data.merchantName = data.merchantName.key
      }
      this.jsonTxt = { ...data }
      return businessBalanceAdminList({ ...data })
    },
    exportFile() {
      const that = this
      delete this.jsonTxt.itemsPerPage
      delete this.jsonTxt.currentPage
      const jsonTxt = JSON.stringify(this.jsonTxt)
      exportInvoice({
        templateCode: 'merchantBalanceManageExcelExport',
        jsonTxt,
        exportType: 'exportForfeitInfoList',
        fileName: name
      }).then((res) => {
        if (res.code === '0') {
          exportId({ taskType: 'merchantBalanceManageExcelExport' }).then((res) => {
            if (res.code === '0') {
              that.systemctlTipsVisible = true
              that.exportCode = res.data
            }
          })
        }
      })
    },
    fetchUser(value) {
      this.fetching = true
      this.comList = []
      businessBalanceAdminList({
        currentPage: 1,
        itemsPerPage: 1000,
        merchantName: value
      }).then((res) => {
        if (res.code === '0') {
          for (let i = 0; i < res.data.listObj.length; i++) {
            this.comList.push(res.data.listObj[i].merchantName)
          }
          this.comList = new Set([...this.comList])
          console.log(this.comList)
        }
      })
    },
    handleChange(value) {
      this.fetching = false
      this.comList = []
    },
    handleReset() {
      this.$refs.ruleForm.resetFields()
    },
    search() {
      this.$refs.table.refresh(true)
    }
  }
}
</script>

<style lang="less" scopeds>
.template-list {
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .button {
    text-align: center;
  }
  // 数据列表 搜索条件
  .table-page-search-wrapper {
    .ant-form-inline {
      .ant-form-item {
        .ant-form-item-control {
          height: 100%;
          line-height: 32px;
        }
      }
    }
  }
}
.detailed {
  color: #ff6b00;
  cursor: pointer;
}
.buttonAraay {
  margin-bottom: 10px;
  .button {
    margin-right: 10px;
  }
}
</style>

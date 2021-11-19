<template>
  <div class="appeal-manage-list">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model
          layout="inline"
          ref="ruleForm"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :model="queryParam"
        >
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="公司名称" prop="buyerMerchantIds">
                <a-select
                  class="buyerMerchantName"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  optionFilterProp="children"
                  v-model="queryParam.buyerMerchantIds"
                  mode="multiple"
                  placeholder="请选择"
                >
                  <a-select-option v-for="text in buyerMerchantList" :key="text.id" :value="text.id">{{
                    text.orgName
                  }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="供应商" prop="providerMerchantId">
                <a-select
                  allowClear
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  show-search
                  placeholder="请输入供应商名称查询"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="fetching ? undefined : null"
                  @search="handleSearch"
                  v-model="queryParam.providerMerchantId"
                  @change="
                    (v) => {
                      queryParam.providerMerchantId = v
                    }
                  "
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option v-for="item in supList" :key="item.orgName" :value="item.id">
                    {{ item.orgName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="采购类型" prop="contractType">
                <a-select v-model="queryParam.contractType" :options="options" placeholder="请选择"> </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="寻源方式" prop="searchManner">
                <a-select v-model="queryParam.searchManner" @change="selectType" placeholder="请选择">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="text in dataobj" :key="text.code">{{ text.name }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="采购项目编号" prop="buyerProjectCode">
                <a-input v-model="queryParam.buyerProjectCode" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="采购员" prop="buyerName">
                <a-input v-model="queryParam.buyerName" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="招标方式" prop="biddingType">
                <a-select v-model="queryParam.biddingType" :options="biddingTypeOptions" placeholder="请选择">
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
    <a-button type="primary" class="clickButton" :disabled="isCopy" @click="Createcontract"> 创建合同 </a-button>

    <a-button class="ml10" @click="exportFile">导出</a-button>
    <a-button class="ml10" @click="viewTasksVisible = true">查看任务</a-button>
    <SystemctlTips :visible="systemctlTipsVisible" @close="systemctlTipsVisible = false" :code="exportCode" />
    <ViewTasks :visible="viewTasksVisible" @close="viewTasksVisible = false" taskType="contractSignDataExport" />

    <a-card>
      <s-table
        name="contarctsSignedTable"
        rowKey="id"
        ref="table"
        :columns="columns"
        :data="queryContractPurchaseSign"
        :row-selection="rowSelection"
        v-if="queryParam.buyerMerchantIds.length > 0"
        :scroll="{ x: 2300 }"
      >
        <!--时间插槽-->
        <template slot="createTimeStr" slot-scope="text">
          <span>{{ text.createTimeStr | moment }}</span>
        </template>

        <template slot="url" slot-scope="url">
          <a v-if="url.url" @click="download(url)">下载</a>
        </template>
        <!--寻源项目编号-->
        <template slot="buyerProjectCode" slot-scope="record">
          <a @click="buyerProjectCodeclick(record.id)">{{ record.buyerProjectCode }}</a>
        </template>
        <template slot="paymentType" slot-scope="record">
          <span v-if="record.paymentType === 1"> 电汇 </span>
          <span v-if="record.paymentType === 2"> 承兑 </span>
        </template>
        <!--是否框架采购-->
        <template slot="frameBuyer" slot-scope="record">
          <span v-if="record.frameBuyer === 0"> 否 </span>
          <span v-if="record.frameBuyer === 1"> 是 </span>
        </template>

        <template slot="contractType" slot-scope="record">
          <span v-if="record.contractType === 1"> 长协合同 </span>
          <span v-if="record.contractType === 2"> 零采合同 </span>
        </template>
        <template slot="biddingPrice" slot-scope="record">
          {{ record.contractType !== 1 ? record.biddingPrice : '' }}
        </template>
        <template v-slot:createTimeStr="props">
          <div v-if="props">
            {{ props | moment }}
          </div>
          <div v-else></div>
        </template>
      </s-table>
    </a-card>
  </div>
</template>

<script>
// import { getList } from '@/api/appealManage'
// import ExportFile from '@/components/exportFile/'
import SystemctlTips from '@/components/exportFile/systemctlTips'
import ViewTasks from '@/components/exportFile/viewTasks'
import {
  queryContractPurchaseSign,
  querySearchStatus,
  getCompanyInfo,
  exportAsyncEvent,
  exportId
  // queryContractPurchaseById
} from '@/api/salescontract'
import { searchCom } from '@/api/contract'
let timeout

export default {
  components: { SystemctlTips, ViewTasks },
  data() {
    return {
      exportCode: 0,
      systemctlTipsVisible: false,
      viewTasksVisible: false,
      fetching: false,
      supList: [],
      labelCol: { span: 20 },
      wrapperCol: { span: 17 },
      isCopy: true,
      ids: [],
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '长协合同',
          value: '1'
        },
        {
          label: '零采合同',
          value: '2'
        }
      ],
      biddingTypeOptions: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '公开',
          value: '1'
        },
        {
          label: '邀请',
          value: '2'
        },
        {
          label: '公开+邀请',
          value: '3'
        }
      ],
      columns: [
        {
          title: '序号',
          key: 'index',
          customRender: (text, record, i) => {
            return i + 1
          }
        },
        {
          title: '公司名称',
          dataIndex: 'buyerMerchantName',
          key: 'buyerMerchantName'
        },
        {
          title: '采购项目编号',
          // key: 'buyerProjectCode',
          scopedSlots: { customRender: 'buyerProjectCode' }
        },
        {
          title: '采购项目名称',
          dataIndex: 'buyerProjectName',
          key: 'buyerProjectName'
        },
        {
          title: '供应商',
          dataIndex: 'providerMerchantName',
          key: 'providerMerchantName'
        },
        {
          title: '中标金额(元)',
          key: 'biddingPrice',
          scopedSlots: { customRender: 'biddingPrice' }
        },
        {
          title: '采购类型',
          key: 'contractType',
          scopedSlots: { customRender: 'contractType' }
        },
        {
          title: '招标方式',
          dataIndex: 'biddingTypeStr',
          key: 'biddingTypeStr'
        },
        {
          title: '寻源方式',
          dataIndex: 'searchMannerStr',
          key: 'searchMannerStr'
        },
        {
          title: '是否框架采购',
          width: 140,
          key: 'frameBuyer',
          scopedSlots: { customRender: 'frameBuyer' }
        },
        {
          title: '长协有效期限（月）',
          dataIndex: 'indate',
          width: 160,
          key: 'indate'
        },
        {
          title: '付款方式',
          dataIndex: 'paymentMethodStr',
          key: 'paymentMethodStr'
        },
        {
          title: '账期',
          dataIndex: 'paymentDays',
          key: 'paymentDays'
        },
        {
          title: '分阶段付款',
          dataIndex: 'progressPaymentStr',
          key: 'progressPaymentStr'
        },
        {
          title: '支付方式',
          key: 'paymentType',
          scopedSlots: { customRender: 'paymentType' }
        },
        {
          title: '采购员',
          dataIndex: 'buyerName',
          key: 'buyerName'
        },
        {
          title: '推送时间',
          dataIndex: 'createTimeStr',
          key: 'createTimeStr',
          width: 200
        },
        {
          title: '附件',
          key: 'url',
          scopedSlots: { customRender: 'url' }
        }
      ],
      queryParam: {
        buyerMerchantIds: [],
        providerMerchantId: null,
        contractType: '',
        searchManner: '',
        buyerProjectCode: null,
        buyerName: null,
        biddingType: ''
      },
      advanced: false,
      list: [],
      dataobj: [],
      providerMerchantList: [],
      buyerMerchantList: []
    }
  },
  mounted() {
    this.querySearchStatus()
    this.getCompanyInfo()
    // this.queryContractPurchaseById()
  },
  methods: {
    // 导出
    exportFile() {
      const that = this
      this.jsonTxt.itemsPerPage = 1000
      this.jsonTxt.currentPage = 1
      const jsonTxt = JSON.stringify(this.jsonTxt)
      exportAsyncEvent({
        templateCode: 'contractSignExport',
        jsonTxt,
        exportType: 'contractSignDataExport',
        fileName: '采购待签合同列表导出'
      }).then((res) => {
        if (res.code === '0') {
          exportId({ taskType: 'contractSignDataExport' }).then((res) => {
            if (res.code === '0') {
              that.systemctlTipsVisible = true
              that.exportCode = res.data
            }
          })
        }
      })
    },
    selectType(e) {
      console.log(e)
    },
    async querySearchStatus() {
      const res = await querySearchStatus()
      if (res.code === '0' && res.data) this.dataobj = res.data
    },
    async getCompanyInfo() {
      try {
        const { data } = await getCompanyInfo()
        console.log(data)
        this.providerMerchantList = data.providerMerchantList
        this.buyerMerchantList = data.buyerMerchantList
        this.queryParam.buyerMerchantIds = [data.buyerMerchantList[0]?.id]
      } catch (err) {
        console.log(err)
      }
    },
    // 获取列表
    async queryContractPurchaseSign(pagination) {
      const { queryParam } = this
      const data = {
        ...pagination,
        ...queryParam
      }

      if (this.queryParam.providerMerchantId) {
        data.providerMerchantIds = [Number(this.queryParam.providerMerchantId)]
      } else {
        data.providerMerchantIds = []
      }
      delete data.providerMerchantId
      this.jsonTxt = { ...data, platformId: 7 }

      return queryContractPurchaseSign({ ...data })
      // this.$refs.table.refresh(true)
      // eslint-disable-next-line no-unreachable
      // if (res.code === '0') {
      //   const { data, total } = res.data
      //   this.pagination.total = total
      //   this.list = data
      // }
    },
    handleReset() {
      this.$refs.ruleForm.resetFields()
      this.queryParam.buyerMerchantIds = [this.buyerMerchantList[0]?.id]
      // this.queryParam.contractType = null
      // this.queryParam.searchManner = null
      // this.queryParam.buyerProjectCode = null
      // this.queryParam.buyerName = null
    },
    // 查询
    search() {
      console.log(this.queryParam)
      this.$refs.table.refresh(true)
    },
    Createcontract() {
      console.log(this.ids)
      const str = this.ids.join(',')
      this.$router.push({
        name: 'ContractPurchaseAddcontract',
        query: { ids: str, sourceType: 1 }
      })
    },
    buyerProjectCodeclick(id) {
      this.$router.push({ name: 'ContractdetailedList', query: { id: id } })
    },
    async download(e) {
      const response = await fetch(e.url)
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = e.name
      a.click()
      a.remove()
    },
    handleSearch(value) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      this.fetching = true
      this.supList = []
      timeout = setTimeout(() => {
        searchCom(value).then((ret) => {
          this.fetching = false
          this.supList = ret.data.providerMerchantList
        })
      }, 300)
    }
  },
  computed: {
    // 表格多选选中状态获取选中id
    rowSelection() {
      const that = this
      // const { selectedRowKeys } = that.state
      return {
        // selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          that.ids = selectedRowKeys
          // console.log(selectedRows)
          console.log(selectedRowKeys)
          if (selectedRowKeys.length === 1) {
            // console.log(1)
            that.isCopy = false
          } else {
            that.isCopy = true
          }
          // that.state.selectedRowKeys = selectedRowKeys
          // that.idList = selectedRowKeys
        }
      }
    }
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
  .clickButton {
    margin: 12px;
  }
  .buyerMerchantName {
    overflow-y: scroll;
    height: 32px;
  }
}
.buttonAraay {
  margin-bottom: 10px;
  .button1 {
    width: 100px;
    margin-right: 10px;
  }
}
.ml10 {
  margin-left: 10px;
}
</style>

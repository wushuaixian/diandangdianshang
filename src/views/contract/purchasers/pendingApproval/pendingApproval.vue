<template>
  <div class="pendingApproval">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="公司名称">
                <!-- <a-select
                  mode="multiple"
                  v-model="query.buyerMerchantIds"
                  placeholder="请选择公司名称"
                  optionFilterProp="children"
                >
                  <a-select-option v-for="(value, index) in buyerMerchantList" :key="index" :value="Number(value.id)">
                    {{ value.orgName }}
                  </a-select-option>
                </a-select> -->
                <d-select
                  mode="multiple"
                  :allowClear="false"
                  v-model="query.buyerMerchantIds"
                  :options="buyerMerchantList"
                ></d-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="合同编号">
                <a-input v-model="query.code" placeholder="请输入合同编号" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="合同名称">
                <a-input v-model="query.name" placeholder="请输入合同名称" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item style="margin-left: 15px" label="供应商">
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
                  @change="
                    (v) => {
                      query.providerMerchantId = v
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
            <a-col :md="8">
              <a-form-model-item label="合同金额">
                <a-row>
                  <a-col :md="11">
                    <a-input
                      v-model="query.priceWithStart"
                      oninput="value=value.replace(/[^\d]/g,'')"
                      placeholder="合同金额"
                    />
                  </a-col>
                  <a-col :md="2" style="text-align: center">-</a-col>
                  <a-col :md="11">
                    <a-input
                      v-model="query.priceWithEnd"
                      oninput="value=value.replace(/[^\d]/g,'')"
                      placeholder="合同金额"
                    />
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="合同生效日期">
                <a-range-picker @change="getData" :key="dataKey" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="48"> </a-row>
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="合同类型">
                <a-select
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  :options="type"
                  placeholder="请选择"
                  :key="contractTypeKey"
                  @change="getType"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item style="margin-left: 15px" label="创建人">
                <a-input v-model="query.createUsername" placeholder="请输入创建人" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24"> </a-col>
            <a-col :md="24" :sm="24" class="button">
              <a-button @click="handleReset">重置</a-button>
              <a-button type="primary" @click="search">查询</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <div class="bottom">
      <div>
        <a-tabs default-active-key="1" @change="callback">
          <a-tab-pane :key="0" :tab="'待审批(' + typeNumber[0] + ')'"></a-tab-pane>
          <a-tab-pane :key="1" :tab="'审批通过(' + typeNumber[1] + ')'" force-render></a-tab-pane>
          <a-tab-pane :key="2" :tab="'审批驳回(' + typeNumber[2] + ')'"></a-tab-pane>
        </a-tabs>
      </div>
      <!-- <ExportFile :params="exportParams" /> -->
      <div class="buttonAraay">
        <a-button class="button1" @click="exportFile">导出</a-button>
        <a-button class="button1" @click="viewTasksVisible = true">查看任务</a-button>
      </div>
      <SystemctlTips :visible="systemctlTipsVisible" @close="systemctlTipsVisible = false" :code="exportCode" />
      <ViewTasks
        :visible="viewTasksVisible"
        @close="viewTasksVisible = false"
        taskType="contractPurchaseAuditDataExport"
      />
      <!-- <ExportFile class="ml10" :params="exportParams" /> -->
      <s-table
        name="pendingApprovalTable"
        rowKey="id"
        ref="table"
        :scroll="{ x: 1600 }"
        :columns="columns"
        :data="init"
      >
        <template slot="code" slot-scope="text, item">
          <a @click="GoDetail(item)" :title="text">{{ text }}</a>
        </template>
        <template slot="contractType" slot-scope="text">
          <span v-show="text.contractType == 1">长协合同</span>
          <span v-show="text.contractType == 2">零采合同</span>
        </template>
        <template slot="effectiveTime" slot-scope="text">
          <span>{{ text.effectiveTime | moment }}</span>
        </template>
        <template slot="num" slot-scope="text">
          <span>{{
            (datas !== undefined && datas !== null && datas.length > 0
              ? datas.findIndex((item) => item.id == text.id)
              : '') + 1
          }}</span>
        </template>
        <template slot="expireTime" slot-scope="text">
          <span>{{ text.expireTime | moment }}</span>
        </template>
        <template slot="versionNo" slot-scope="text">
          <span v-show="text.versionNo == 0">否</span>
          <span v-show="text.versionNo !== 0">是</span>
        </template>
        <template slot="options" slot-scope="text">
          <span v-if="!text.useAppdflow" class="approvalButton" @click="contractUpdateStatus(text.id)">审批</span>
          <!-- <span class="approvalButton" style="margin-left: 20px">审批进度</span> -->
        </template>
        <template slot="ext3Info" slot-scope="text">
          <span>{{ text.ext3Info | moment }}</span>
        </template>
      </s-table>
    </div>
    <Popup :popupStatus.sync="popupStatus" @submitExamine="submitExamine" />
  </div>
</template>
<script>
import SystemctlTips from '@/components/exportFile/systemctlTips'
import ViewTasks from '@/components/exportFile/viewTasks'
import {
  queryContractSupplierList,
  contractUpdateStatus,
  contractUpdateStatusNumber,
  exportAsyncEvent,
  exportId
} from '@/api/contractApproval'
import { getComList, searchCom } from '@/api/contract'
import Popup from '@/components/Popup/ExaminePopup.vue'
let timeout
export default {
  components: {
    Popup,
    SystemctlTips,
    ViewTasks
  },
  created() {},
  mounted() {
    this.getComList()
    this.columns = this.columns1
  },
  data() {
    return {
      exportCode: 0,
      jsonTxt: {},
      systemctlTipsVisible: false,
      viewTasksVisible: false,
      fetching: false,
      supList: [],
      buyerMerchantList: [],
      providerMerchantList: [],
      id: '',
      popupStatus: false,
      typeNumber: { 0: 0, 1: 0, 2: 0 },
      options: [],
      labelCol: { span: 20 },
      wrapperCol: { span: 17 },
      datas: [],
      contractTypeKey: 1,
      query: {
        buyerMerchantIds: [],
        providerMerchantId: null,
        code: null,
        priceWithStart: null,
        priceWithEnd: null,
        effectiveTimeStart: null,
        effectiveTimeEnd: null,
        contractType: null
      },
      type: [
        {
          label: '长协合同',
          value: 1
        },
        {
          label: '零采合同',
          value: 2
        }
      ],
      columns: [],
      dataKey: 1,
      auditStatus: 0,
      columns1: [
        {
          title: '序号',
          key: 'num',
          scopedSlots: { customRender: 'num' }
        },
        {
          title: '公司名称',
          key: 'buyerMerchantName',
          dataIndex: 'buyerMerchantName'
        },
        {
          title: '合同编号',
          key: 'code',
          dataIndex: 'code',
          scopedSlots: { customRender: 'code' }
        },
        {
          title: '合同名称',
          key: 'name',
          dataIndex: 'name'
        },
        {
          title: '供应商',
          key: 'providerMerchantName',
          dataIndex: 'providerMerchantName'
        },
        {
          title: '合同类型',
          key: 'contractType',
          scopedSlots: { customRender: 'contractType' }
        },
        {
          title: '合同生效日期',
          key: 'effectiveTime',
          scopedSlots: { customRender: 'effectiveTime' }
        },
        {
          title: '合同截止日期',
          key: 'expireTime',
          scopedSlots: { customRender: 'expireTime' }
        },
        {
          title: '合同创建人',
          key: 'createUsername',
          dataIndex: 'createUsername'
        },
        {
          title: '是否变更',
          key: 'versionNo',
          scopedSlots: { customRender: 'versionNo' }
        },
        {
          key: 'action',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'options' }
        }
      ],
      columns2: [
        {
          title: '序号',
          key: 'num',
          scopedSlots: { customRender: 'num' }
        },
        {
          title: '公司名称',
          key: 'buyerMerchantName',
          dataIndex: 'buyerMerchantName'
        },
        {
          title: '合同编号',
          key: 'code',
          dataIndex: 'code',
          scopedSlots: { customRender: 'code' }
        },
        {
          title: '合同名称',
          key: 'name',
          dataIndex: 'name'
        },
        {
          title: '供应商',
          key: 'providerMerchantName',
          dataIndex: 'providerMerchantName'
        },
        {
          title: '合同类型',
          key: 'contractType',
          scopedSlots: { customRender: 'contractType' }
        },
        {
          title: '合同生效日期',
          key: 'effectiveTime',
          scopedSlots: { customRender: 'effectiveTime' }
        },
        {
          title: '合同截止日期',
          key: 'expireTime',
          scopedSlots: { customRender: 'expireTime' }
        },
        {
          title: '合同创建人',
          key: 'createUsername',
          dataIndex: 'createUsername'
        },
        {
          title: '是否变更',
          key: 'versionNo',
          scopedSlots: { customRender: 'versionNo' }
        },
        {
          title: '审批人',
          key: 'ext1Info',
          dataIndex: 'ext1Info'
        },
        {
          title: '审批时间',
          key: 'ext3Info',
          scopedSlots: { customRender: 'ext3Info' }
        }
      ],
      columns3: [
        {
          title: '序号',
          key: 'num',
          scopedSlots: { customRender: 'num' }
        },
        {
          title: '公司名称',
          key: 'buyerMerchantName',
          dataIndex: 'buyerMerchantName'
        },
        {
          title: '合同编号',
          key: 'code',
          dataIndex: 'code',
          scopedSlots: { customRender: 'code' }
        },
        {
          title: '合同名称',
          key: 'name',
          dataIndex: 'name'
        },
        {
          title: '供应商',
          key: 'providerMerchantName',
          dataIndex: 'providerMerchantName'
        },
        {
          title: '合同类型',
          key: 'contractType',
          scopedSlots: { customRender: 'contractType' }
        },
        {
          title: '合同生效日期',
          key: 'effectiveTime',
          scopedSlots: { customRender: 'effectiveTime' }
        },
        {
          title: '合同截止日期',
          key: 'expireTime',
          scopedSlots: { customRender: 'expireTime' }
        },
        {
          title: '合同创建人',
          key: 'createUsername',
          dataIndex: 'createUsername'
        },
        {
          title: '是否变更',
          key: 'versionNo',
          scopedSlots: { customRender: 'versionNo' }
        },
        {
          title: '审批人',
          key: 'ext1Info',
          dataIndex: 'ext1Info'
        },
        {
          title: '审批时间',
          key: 'ext3Info',
          scopedSlots: { customRender: 'ext3Info' }
        },
        {
          title: '驳回原因',
          key: 'ext6Info',
          dataIndex: 'ext6Info'
        }
      ]
    }
  },
  methods: {
    // 导出
    exportFile() {
      const that = this
      this.jsonTxt.itemsPerPage = 1000
      this.jsonTxt.currentPage = 1
      const jsonTxt = JSON.stringify(this.jsonTxt)
      exportAsyncEvent({
        templateCode: 'contractPurchaseAuditExport',
        jsonTxt,
        exportType: 'contractPurchaseAuditDataExport',
        fileName: '采购合同审批列表导出'
      }).then((res) => {
        if (res.code === '0') {
          exportId({ taskType: 'contractPurchaseAuditDataExport' }).then((res) => {
            if (res.code === '0') {
              that.systemctlTipsVisible = true
              that.exportCode = res.data
            }
          })
        }
      })
    },
    async getComList() {
      const res = await getComList()
      if (res.code === '0') {
        const [item] = res?.data.buyerMerchantList
        console.log([item])
        console.log(res.data.providerMerchantList)
        // this.buyerMerchantList = res.data.buyerMerchantList
        this.providerMerchantList = res.data.providerMerchantList
        this.buyerMerchantList = res?.data.buyerMerchantList.map((x) => {
          return {
            value: x.id,
            label: x.orgName
          }
        })
        console.log(this.buyerMerchantList)
        this.query.buyerMerchantIds = [item?.id]
      }
    },
    async init(params) {
      if (this.query.priceWithStart > this.query.priceWithEnd) {
        const value = this.query.priceWithStart
        this.query.priceWithStart = this.query.priceWithEnd
        this.query.priceWithEnd = value
      }
      const data = {
        ...params,
        ...this.query,
        auditStatus: this.auditStatus
      }
      if (this.query.providerMerchantId) {
        data.providerMerchantIds = [Number(this.query.providerMerchantId)]
      } else {
        data.providerMerchantIds = []
      }
      contractUpdateStatusNumber({ ...data }).then((res) => {
        console.log(res.data)
        this.typeNumber = res.data
      })
      const datas = queryContractSupplierList({ ...data })
      datas.then((res) => {
        this.datas = res.data.listObj
      })
      this.jsonTxt = { ...data, platformId: 7 }

      return datas
    },
    GoDetail(item) {
      this.$router.push({ name: 'ContractPurchaseAddcontract', query: { id: item.id, type: 'read' } })
    },
    handleReset() {
      this.query = {
        buyerMerchantIds: [],
        providerMerchantId: null,
        code: null,
        priceWithStart: null,
        priceWithEnd: null,
        effectiveTimeStart: null,
        effectiveTimeEnd: null,
        contractType: null
      }
      this.getComList()
      this.dataKey++
      this.contractTypeKey++
      this.search()
    },
    search() {
      this.$refs.table.refresh(true)
    },
    callback(v) {
      this.auditStatus = v
      console.log(v)
      if (v === 0) {
        this.columns = this.columns1
      } else if (v === 1) {
        this.columns = this.columns2
      } else if (v === 2) {
        this.columns = this.columns3
      }
      console.log(this.columns)
      this.search()
    },
    getData(val) {
      this.query.effectiveTimeStart = val[0]['_d']
      this.query.effectiveTimeEnd = val[1]['_d']
    },
    getType(v) {
      this.query.contractType = v
    },
    contractUpdateStatus(id) {
      console.log(id + '---------------')
      this.id = id
      this.popupStatus = true
    },
    submitExamine(auditStatus, auditReason) {
      const params = {
        auditStatus: auditStatus + '',
        ext6Info: auditReason + '',
        id: this.id + ''
      }
      contractUpdateStatus(params).then((res) => {
        if (res.code === '0') {
          this.search()
        }
      })
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
  }
}
</script>
<style lang="less" scoped>
.pendingApproval {
  width: 100%;
  .bottom {
    background: #ffffff;
    margin-top: 20px;
    padding: 24px;
  }

  // 数据列表 搜索条件
  /deep/.table-page-search-wrapper {
    .ant-form-inline {
      .ant-form-item {
        .ant-form-item-control {
          // height: 100%;
          line-height: 32px;
        }
      }
    }
  }
}
.button {
  text-align: center;
}
.approvalButton {
  cursor: pointer;
  color: #ff6b00;
}
.buttonAraay {
  margin-bottom: 10px;
  .button1 {
    width: 100px;
    margin-right: 10px;
  }
}
</style>

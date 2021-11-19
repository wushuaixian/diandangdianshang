<template>
  <div class="pendingApproval">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="query" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="公司名称">
                <!-- <a-input v-model="query.providerMerchantIds" placeholder="请输入公司名称" /> -->
                <a-select
                  class="buyerMerchantName"
                  mode="multiple"
                  style="width: 100%"
                  optionFilterProp="children"
                  @change="handleChange"
                  v-model="query.providerMerchantIds"
                >
                  <a-select-option v-for="(text, index) in providerMerchantList" :key="index" :value="Number(text.id)">
                    {{ text.orgName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="合同编号" porp="code">
                <a-input v-model="query.code" placeholder="请输入合同编号" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="合同名称" porp="name">
                <a-input v-model="query.name" placeholder="请输入合同名称" />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item style="margin-left: 15px" label="采购方">
                <a-select
                  allowClear
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  show-search
                  placeholder="请输入采购方名称查询"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="fetching ? undefined : null"
                  @search="handleSearch"
                  @change="
                    (v) => {
                      query.buyerMerchantIds = v ? [v] : []
                    }
                  "
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option v-for="item in supList" :key="item.orgName" :value="item.id">
                    {{ item.orgName }}
                  </a-select-option>
                </a-select>
                <!-- <a-select v-model="query.buyerMerchantIds" @change="onchange" placeholder="请选择采购方">
                  <a-select-option v-for="item in buyerMerchantList" :key="item.orgName" :value="item.id">
                    {{ item.orgName }}
                  </a-select-option>
                </a-select> -->
                <!-- <a-input v-model="query.buyerMerchantName1" placeholder="请输入供应商" /> -->
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="合同金额">
                <div style="display: flex; justify-content: center">
                  <a-input
                    v-model="query.priceWithStart"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    style="width: 8.8vw"
                    placeholder="合同金额"
                  />
                  <a-input
                    v-model="query.priceWithEnd"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    style="width: 8.8vw"
                    placeholder="合同金额"
                  />
                </div>
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="合同生效日期">
                <a-range-picker v-model="query.time" />
              </a-form-model-item>
            </a-col>
            <!-- </a-row> -->
            <!-- <a-row :gutter="48"> </a-row> -->
            <!-- <a-row :gutter="48"> -->
            <a-col :md="8" :sm="24">
              <a-form-model-item label="合同类型">
                <a-select
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  :options="type"
                  placeholder="请选择"
                  v-model="query.contractType"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item style="margin-left: 15px" label="创建人" prop="createUsername">
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
          <a-tab-pane :key="0" tab="待确认"></a-tab-pane>
          <a-tab-pane :key="1" tab="已确认" force-render></a-tab-pane>
          <a-tab-pane :key="2" tab="已驳回"></a-tab-pane>
        </a-tabs>
      </div>
      <div class="buttonAraay">
        <a-button class="button1" @click="exportFile">导出</a-button>
        <a-button class="button1" @click="viewTasksVisible = true">查看任务</a-button>
      </div>
      <SystemctlTips :visible="systemctlTipsVisible" @close="systemctlTipsVisible = false" :code="exportCode" />
      <ViewTasks
        :visible="viewTasksVisible"
        @close="viewTasksVisible = false"
        taskType="contractSupplierAuditDataExport"
      />
      <!-- <ExportFile :params="exportParams" /> -->
      <!-- <Button type="primary" size="{size}" class="export"> 导出 </Button> -->
      <s-table
        v-if="booldata"
        rowKey="id"
        name="pendingTobeconfirmedTable"
        ref="table"
        :scroll="{ x: 1800 }"
        :columns="columns"
        :data="init"
        :key="auditStatus"
      >
        <template slot="contractType" slot-scope="text">
          <span v-show="text.contractType == 1">长协合同</span>
          <span v-show="text.contractType == 2">零采合同</span>
        </template>
        <template slot="effectiveTime" slot-scope="text">
          <span>{{ text.effectiveTime | moment }}</span>
        </template>
        <!--插槽 时间戳-->
        <template slot="expireTime" slot-scope="text">
          <span>{{ text.expireTime | moment }}</span>
        </template>

        <template slot="ext5Info" slot-scope="text">
          <span>{{ text.ext5Info | moment('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
        <template slot="versionNo" slot-scope="text">
          <span v-show="text.versionNo == 0">否</span>
          <span v-show="text.versionNo !== 0">是</span>
          <!-- <span>{{ text.versionNo ? '否' : '是' }}</span> -->
        </template>
        <template slot="options" slot-scope="text">
          <span class="approvalButton" v-if="!text.useAppdflow" @click="contractUpdateStatus(text.id)">确认合同</span>
          <!-- <span class="approvalButton" style="margin-left: 20px">审批进度</span> -->
        </template>
        <template slot="ext3Info" slot-scope="text">
          <span>{{ text.ext3Info | moment }}</span>
        </template>

        <template slot="code" slot-scope="text, record">
          <a @click="Codeclick(record.id)" :title="text">{{ text }}</a>
        </template>
        <template slot="url" slot-scope="url">
          <a v-if="url.url" @click="download(url)">下载</a>
        </template>
        <template slot="amount" slot-scope="text, row">
          <span v-if="row.contractType == 2">{{ row.amount }}</span>
        </template>
      </s-table>
    </div>
    <Popup :popupStatus.sync="popupStatus" @submitExamine="submitExamine" @search="search" />
  </div>
</template>
<script>
// import Popup from '@/components/Popup/ExaminePopup.vue'
import SystemctlTips from '@/components/exportFile/systemctlTips'
import ViewTasks from '@/components/exportFile/viewTasks'
// import ExportFile from '@/components/exportFile/'
// import { feeBillManageImplExport, exportId } from '@/api/fince'

import Popup from './approvalPopup.vue'
import { searchCom } from '@/api/contract'
import {
  queryContractSupplierList,
  getCompanyInfo,
  updateContracts,
  exportAsyncEvent,
  exportId
} from '@/api/salescontract'
let timeout

export default {
  components: {
    Popup,
    // ExportFile,
    SystemctlTips,
    ViewTasks
  },
  data() {
    return {
      exportCode: 0,
      jsonTxt: {},
      systemctlTipsVisible: false,
      viewTasksVisible: false,
      fetching: false,
      supList: [],
      id: '',
      popupStatus: false,
      options: [],
      labelCol: { span: 20 },
      wrapperCol: { span: 17 },
      query: {
        buyerMerchantName: '',
        code: '',
        name: '',
        time: '',
        providerMerchantName: '',
        amountStart: '',
        amountEnd: '',
        effectiveTimeStart: '',
        effectiveTimeEnd: '',
        contractType: '',
        providerMerchantIds: [],
        buyerMerchantIds: [],
        buyerMerchantId: '',
        supplierAuditStatus: 0,
        priceWithStart: '',
        priceWithEnd: ''
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
      columns1: [
        {
          title: '序号',
          key: 'index',
          customRender: (text, record, i) => {
            return i + 1
          }
        },
        {
          title: '公司名称',
          key: 'providerMerchantName',
          dataIndex: 'providerMerchantName'
        },
        {
          title: '合同编号',
          dataIndex: 'code',
          scopedSlots: { customRender: 'code' }
        },
        {
          title: '合同名称',
          key: 'name',
          dataIndex: 'name'
        },
        {
          title: '合同金额(元)',
          key: 'amount',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '采购方',
          key: 'buyerMerchantName',
          dataIndex: 'buyerMerchantName'
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
          title: '操作',
          key: 'options',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'options' }
        }
      ],
      auditStatus: 0,
      columns: [],
      columns2: [
        {
          title: '序号',
          key: 'num',
          dataIndex: 'num'
        },
        {
          title: '公司名称',
          key: 'providerMerchantName',
          dataIndex: 'providerMerchantName'
        },
        {
          title: '合同编号',
          dataIndex: 'code',
          scopedSlots: { customRender: 'code' }
        },
        {
          title: '合同名称',
          key: 'name',
          dataIndex: 'name'
        },
        {
          title: '合同金额(元)',
          key: 'amount',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '采购方',
          key: 'buyerMerchantName',
          dataIndex: 'buyerMerchantName'
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
          title: '确认时间',
          key: 'ext5Info',
          width: 200,
          scopedSlots: { customRender: 'ext5Info' }
        },
        {
          title: '确认人',
          key: 'ext4Info',
          dataIndex: 'ext4Info'
        }
      ],
      columns3: [
        {
          title: '序号',
          key: 'num',
          dataIndex: 'num'
        },
        {
          title: '公司名称',
          key: 'providerMerchantName',
          dataIndex: 'providerMerchantName'
        },
        {
          title: '合同编号',
          dataIndex: 'code',
          scopedSlots: { customRender: 'code' }
        },
        {
          title: '合同名称',
          key: 'name',
          dataIndex: 'name'
        },
        {
          title: '合同金额(元)',
          key: 'amount',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '采购方',
          key: 'buyerMerchantName',
          dataIndex: 'buyerMerchantName'
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
          title: '驳回人',
          key: 'ext4Info',
          dataIndex: 'ext4Info'
        },
        {
          title: '驳回时间',
          key: 'ext5Info',
          scopedSlots: { customRender: 'ext5Info' },
          width: 170
        },
        {
          title: '驳回原因',
          key: 'ext2Info',
          dataIndex: 'ext2Info'
        }
        // {
        //   title: '附件',
        //   key: 'url',
        //   fixed: 'right',
        //   scopedSlots: { customRender: 'url' }
        // }
      ],
      providerMerchantList: [],
      buyerMerchantList: [],
      booldata: false
    }
  },
  mounted() {
    this.columns = this.columns1
    this.getCompanyInfo()
  },
  methods: {
    // 导出
    exportFile() {
      const that = this
      this.jsonTxt.itemsPerPage = 1000
      this.jsonTxt.currentPage = 1
      const jsonTxt = JSON.stringify(this.jsonTxt)
      exportAsyncEvent({
        templateCode: 'contractSupplireAuditExport',
        jsonTxt,
        exportType: 'contractSupplierAuditDataExport',
        fileName: '销售合同确认列表导出'
      }).then((res) => {
        if (res.code === '0') {
          exportId({ taskType: 'contractSupplierAuditDataExport' }).then((res) => {
            if (res.code === '0') {
              that.systemctlTipsVisible = true
              that.exportCode = res.data
            }
          })
        }
      })
    },
    onchange(e) {
      console.log(e)
      this.query.buyerMerchantIds = [e]
    },
    datachange(e) {
      console.log(e)
      this.contractStampPOList = e
    },
    // 公司查询列表
    async getCompanyInfo() {
      try {
        const { data } = await getCompanyInfo()
        console.log(data)
        this.query.providerMerchantIds = [data.providerMerchantList[0].id]
        this.providerMerchantList = data.providerMerchantList
        this.buyerMerchantList = data.buyerMerchantList
        this.booldata = true
      } catch (err) {
        console.log(err)
      }
    },
    async init(params) {
      const data = {
        ...params,
        ...this.query
      }
      if (data.time) {
        const [effectiveTimeEnd, effectiveTimeStart] = data.time
        data.effectiveTimeEnd = effectiveTimeStart ? effectiveTimeStart.format('YYYY-MM-DD') : ''
        data.effectiveTimeStart = effectiveTimeEnd ? effectiveTimeEnd.format('YYYY-MM-DD') : ''
      }
      if (this.query.buyerMerchantId) {
        data.buyerMerchantId = Number(this.query.buyerMerchantId)
      }
      delete data.time
      this.jsonTxt = { ...data }

      return queryContractSupplierList({ ...data })
    },
    handleReset() {
      this.query.code = ''
      this.query.name = ''
      this.query.buyerMerchantIds = []
      this.query.priceWithStart = ''
      this.query.priceWithEnd = ''
      this.query.time = ''
      this.query.createUsername = ''
      this.query.contractType = ''
      this.query.buyerMerchantId = ''
      this.getCompanyInfo()
    },
    search() {
      // this.$refs.table.refresh(true)query.priceWithStart
      // this.$forceUpdate()
      console.log(this.query)
      this.$refs.table.refresh(true)
    },
    callback(v) {
      this.auditStatus = v
      // this.$refs.table.refresh(true)
      console.log(v)
      if (v === 0) {
        this.columns = this.columns1
        this.query.supplierAuditStatus = v
      } else if (v === 1) {
        this.columns = this.columns2
        this.query.supplierAuditStatus = v
      } else if (v === 2) {
        this.columns = this.columns3
        this.query.supplierAuditStatus = v
      }
      console.log(this.columns)
      // this.search()
    },
    // getData(val, time) {
    //   // console.log(val[0]._d, time)
    //   this.query.effectiveTimeStart = val[0]._d
    //   this.query.effectiveTimeEnd = val[1]._d
    // },
    // getType(v) {
    //   this.query.contractType = v
    // },
    contractUpdateStatus(id) {
      console.log(id)
      this.id = id
      this.popupStatus = true
    },
    submitExamine(auditStatus, auditReason, contractStampPOList) {
      console.log(auditReason)
      const params = {
        id: this.id,
        ext2Info: auditReason,
        contractStampPOList: contractStampPOList,
        supplierAuditStatus: auditStatus
      }
      updateContracts(params).then((res) => {
        console.log(res)
        if (res.code === '0') {
          this.search()
        }
      })
    },
    handleChange(value) {
      this.query.providerMerchantIds = value
    },
    Codeclick(id) {
      console.log(id)
      this.$router.push({ name: 'ContractSuppliersShowContract', query: { id: id, type: 'read' } })
    },
    async download(e) {
      // console.log(e)
      window.open(e.url + '?attname=' + e.stampName + '.docx')
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
          this.supList = ret.data.buyerMerchantList
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
}
.button {
  text-align: center;
}
.approvalButton {
  cursor: pointer;
  color: #ff6b00;
}
.export {
  margin-bottom: 15px;
  margin-left: 10px;
}
.buyerMerchantName {
  overflow-y: scroll;
  height: 32px;
}
.buttonAraay {
  margin-bottom: 10px;
  .button1 {
    width: 100px;
    margin-right: 10px;
  }
}
</style>

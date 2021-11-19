<template>
  <div class="mid">
    <a-card type="inner" :bordered="false">
      <div class="header">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8">
              <a-form-item label="公司名称" :labelCol="{ lg: { span: 8 } }">
                <a-select class="Longer" v-model="list.authStatus" placeholder="请选择" default-value="">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="2">待审核</a-select-option>
                  <a-select-option value="3">审核通过</a-select-option>
                  <a-select-option value="4">审核不通过</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8">
              <a-form-item label="申请组织" :labelCol="{ lg: { span: 8 } }">
                <a-input v-model="list.enterpriseName" placeholder="请输入企业名称" />
              </a-form-item>
            </a-col>
            <a-col :md="8">
              <a-form-item label="采购计划编号" :labelCol="{ lg: { span: 8 } }">
                <a-input v-model="list.legalPersonName" placeholder="请输入法定代表人" />
              </a-form-item>
            </a-col>
            <a-col :md="8">
              <a-form-item label="申报人" :labelCol="{ lg: { span: 8 } }">
                <a-input v-model="list.legalPersonName" placeholder="请输入法定代表人" />
              </a-form-item>
            </a-col>
            <a-col :md="8">
              <a-form-item label="是否紧急" :labelCol="{ lg: { span: 8 } }">
                <a-select class="Longer" v-model="list.authStatus" placeholder="请选择" default-value="">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="2">是</a-select-option>
                  <a-select-option value="3">否</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-col class="middle" :md="80">
            <span class="table-page-search-submitButtons">
              <a-button style="margin-left: 8px" @click="Reset">重置</a-button>
              <a-button type="primary" style="margin-left: 20px" @click="search">查询</a-button>
            </span>
          </a-col>
        </a-form>
      </div>
      <div class="contest">
        <div>
          <a-tabs default-active-key="" @change="callback">
            <a-tab-pane key="" tab="全部"> </a-tab-pane>
            <a-tab-pane key="1" tab="审核通过" force-render></a-tab-pane>
            <a-tab-pane key="0" tab="待审核"></a-tab-pane>
            <a-tab-pane key="2" tab="驳回"></a-tab-pane>
          </a-tabs>
        </div>
        <a-button v-if="idList.length > 0" class="margin" type="primary" @click="batchhandleEdit()">
          批量审核
        </a-button>
        <a-button v-else class="margin" type="primary" disabled> 批量审核 </a-button>
        <s-table
          name="approvalTable"
          ref="table"
          rowKey="id"
          :data="init"
          :columns="columns"
          :scroll="{ x: 1500, y: 300 }"
          :row-selection="rowSelection"
        >
          <a slot="enterpriseName" slot-scope="enterpriseName, record" @click="viewEnterprise(record)">{{
            enterpriseName
          }}</a>
          <span slot="action" slot-scope="text, record, index">
            {{ (parameter.page - 1) * parameter.rows + parseInt(index) + 1 }}
          </span>
          <span slot="enterpriseNature" slot-scope="enterpriseNature">
            <span v-if="enterpriseNature === '1'">生产商</span>
            <span v-if="enterpriseNature === '2'">贸易商</span>
          </span>
          <template slot="authStatus" slot-scope="authStatus, text">
            <div v-show="authStatus == 3">
              <div class="green"></div>
              审核通过
            </div>
            <div v-show="authStatus == 2">
              <div class="green orange"></div>
              待审核
            </div>
            <div v-show="authStatus == 4">
              <div class="green red"></div>
              审核不通过
              <a-tooltip placement="top">
                <template slot="title">
                  <span>审核账号:{{ text.auditUserName }} <br /></span>
                  <span>审核时间:{{ text.factoryAuditCreateTime | moment }}<br /></span>
                  <span>拒绝原因:{{ text.auditReason }}</span>
                </template>
                <a-icon type="question-circle" placement="top" />
              </a-tooltip>
            </div>
          </template>
          <span v-if="expectFactoryAuditTime" slot="expectFactoryAuditTime" slot-scope="expectFactoryAuditTime">
            {{ expectFactoryAuditTime | moment }}
          </span>
          <template v-else> </template>
          <span slot="action" slot-scope="text, record">
            <template>
              <a v-if="record.authStatus === '2'" @click="handleEdit(record)">审核</a>
            </template>
          </span>
        </s-table>
      </div>
    </a-card>
    <Popup :popupStatus="popupStatus" @close="closeExaminPopup" @submitExamine="submitExamine" />
  </div>
</template>

<script>
import { supplierAuditList, supplieraudits } from '@/api/supplier'
import Popup from '@/components/Popup/ExaminePopup.vue'
import { submitExamine } from '@/api/accessAudit'

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    scopedSlots: { customRender: 'index' }
  },
  {
    title: '公司名称',
    dataIndex: 'enterpriseName',
    scopedSlots: { customRender: 'enterpriseName' }
  },
  {
    title: '是否紧急',
    dataIndex: 'legalPersonName'
  },
  {
    title: '计划采购编码',
    dataIndex: 'enterpriseNature',
    scopedSlots: { customRender: 'enterpriseNature' }
  },
  {
    title: '申请组织',
    dataIndex: 'authStatus',
    scopedSlots: { customRender: 'authStatus' }
  },
  {
    title: '使用部门',
    dataIndex: 'a',
    scopedSlots: { customRender: 'a' }
  },
  {
    title: '备注',
    dataIndex: 'b',
    scopedSlots: { customRender: 'b' }
  },
  {
    title: '申报人',
    dataIndex: 'c',
    scopedSlots: { customRender: 'c' }
  },
  {
    title: '联系电话',
    dataIndex: 'd',
    scopedSlots: { customRender: 'd' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    // width: '150px',
    // fixed: 'right',
    scopedSlots: { customRender: 'action' }
  },
  {
    title: '审批进度',
    dataIndex: 'action',
    // width: '150px',
    // fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  components: {
    Popup,
    submitExamine
  },
  data() {
    this.columns = columns
    return {
      timedata: [],
      idList: [],
      popupStatus: false,
      data: [],
      columns,
      list: {
        enterpriseName: '',
        legalPersonName: '',
        authStatus: '',
        beginTime: '',
        endTime: ''
      },
      state: {
        selectedRowKeys: []
      }
    }
  },
  mounted() {},
  methods: {
    callback(v) {
      this.query.auditStatus = v
      this.$refs.table.refresh(true)
    },
    // 跳转详情附带id
    viewEnterprise(record) {
      this.$router.push({
        name: 'SuppliersCertificationAuditDetail',
        query: {
          id: record.id
        }
      })
    },
    // 列表请求
    async init(params) {
      const { list } = this
      const data = {
        ...params,
        ...list
      }
      return supplierAuditList({ ...data })
    },
    // 打开单个审核弹框
    handleEdit(record) {
      this.popupStatus = true
      this.idList.push(record.id)
    },
    // 打开批量审核弹框
    batchhandleEdit(record) {
      this.popupStatus = true
    },
    // 关闭审核弹框
    closeExaminPopup() {
      this.popupStatus = false
    },
    // 审核确认接口
    submitExamine(authStatus, auditReason) {
      if (authStatus === 1) {
        authStatus = '3'
      } else if (authStatus === 2) {
        authStatus = '4'
      }
      supplieraudits({ ids: this.idList, authStatus, auditReason }).then((res) => {
        this.idList = []
        this.popupStatus = false
        this.$refs.table.refresh(true)
        this.state.selectedRowKeys = []
      })
    },
    // 查询列表数据
    search() {
      this.$refs.table.refresh(true)
    },
    // 获取查询时间
    onChange(date, dateString) {
      this.list.beginTime = dateString[0]
      this.list.endTime = dateString[1]
    },
    // 重置查询数据
    Reset() {
      this.timedata = []
      this.list = {
        enterpriseName: '',
        legalPersonName: '',
        authStatus: '',
        beginTime: '',
        endTime: ''
      }
    }
  },
  computed: {
    // 表格多选选中状态获取选中id
    rowSelection() {
      const that = this
      const { selectedRowKeys } = that.state
      return {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          that.state.selectedRowKeys = selectedRowKeys
          that.idList = selectedRowKeys
        },
        getCheckboxProps: (record) => {
          return {
            props: {
              disabled: record.authStatus !== '2'
            }
          }
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.mid {
  margin: 0;
  padding: 0;
  width: 100%;
  height: auto;
  .header {
    padding-top: 20px;
    width: 100%;
    height: auto;
    .distance {
      width: auto;
      float: left;
      .input {
        width: 200px;
      }
    }
    .middle {
      display: flex;
      justify-content: center;
      align-content: center;
    }
    .separate {
      margin-left: 10px;
    }
    .Longer {
      width: 174px;
    }
  }
  .contest {
    width: 100%;
    height: auto;
    .margin {
      width: auto;
      margin: 15px;
    }
    .green {
      width: 6px;
      height: 6px;
      background: #52c41a;
      display: inline-block;
      position: relative;
      top: -2px;
      border-radius: 50%;
      margin-right: 6px;
    }
    .orange {
      background: #ff8720;
    }
    .red {
      background: red;
    }
  }
}
.ant-form-item {
  display: flex;
  margin-right: 0;
}
</style>

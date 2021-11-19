<template>
  <div class="certificetion-audit">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="form" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8">
              <a-form-model-item label="企业名称" prop="enterpriseName">
                <a-input v-model="queryParam.enterpriseName" placeholder="请输入企业名称" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="提交时间" prop="time">
                <a-range-picker v-model="queryParam.time" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="法定代表人" prop="legalPersonName">
                <a-input v-model="queryParam.legalPersonName" placeholder="请输入法定代表人" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="审核时间" prop="examinetime">
                <a-range-picker v-model="queryParam.examinetime" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="企业性质" prop="enterpriseNature">
                <a-select allowClear v-model="queryParam.enterpriseNature" class="inp">
                  <a-select-option value=""> 全部 </a-select-option>
                  <a-select-option value="1"> 生产商 </a-select-option>
                  <a-select-option value="2"> 贸易商 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="24">
              <div class="button">
                <a-button style="margin-left: 8px" @click="Reset">重置</a-button>
                <a-button type="primary" style="margin-left: 20px" @click="search">查询</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card>
      <a-tabs v-model="queryParam.authStatus" @change="handleTabsChange">
        <a-tab-pane v-for="item in statusList" :key="item.value" :tab="item.label" />
      </a-tabs>
      <div class="contest">
        <div class="operation-button">
          <a-button :disabled="idList.length <= 0" @click="batchhandleEdit()"> 批量审核 </a-button>
        </div>
        <s-table
          name="certcationAuditTables"
          ref="table"
          rowKey="id"
          :data="init"
          :columns="columns"
          :scroll="{ x: 1000 }"
          :row-selection="rowSelection"
        >
          <a
            class="enterpriseName"
            slot="enterpriseName"
            slot-scope="enterpriseName, record"
            @click="viewEnterprise(record)"
          >
            {{ enterpriseName }}
          </a>
          <template slot="sumAmount" slot-scope="text">
            <div v-if="text.sumAmount">¥{{ text.sumAmount }}</div>
          </template>
          <template v-slot:submitTime="props">
            {{ props | moment('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <template v-slot:confirmAuditTime="props">
            {{ props | moment('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <span slot="action" slot-scope="text, record, index">
            {{ (parameter.page - 1) * parameter.rows + parseInt(index) + 1 }}
          </span>
          <span slot="enterpriseNature" slot-scope="enterpriseNature">
            <span v-if="enterpriseNature === '1'">生产商</span>
            <span v-if="enterpriseNature === '2'">贸易商</span>
          </span>
          <template slot="authStatus" slot-scope="authStatus, text">
            <!-- <div v-show="authStatus === '-1'">
              <div class="green"></div>
              待处理
            </div> -->
            <div v-show="authStatus === '2'">
              <div class="green orange"></div>
              待审核
            </div>
            <div v-show="authStatus === '3'">
              <div class="green"></div>
              审核通过
            </div>
            <div v-show="authStatus === '4'">
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
              <a @click="viewComments(record.id)" style="margin-right: 10px">查看审核意见</a>
              <a v-if="record.authStatus === '2'" @click="handleEdit(record)">审核</a>
            </template>
          </span>
        </s-table>
      </div>
    </a-card>
    <Popup :popupStatus.sync="popupStatus" @submitExamine="submitExamine" />
    <ListPopup
      v-if="viewCommentsStatus"
      :visible.sync="viewCommentsStatus"
      type="供应商认证审核"
      @close="viewCommentsStatus = false"
      :id="id"
    />
  </div>
</template>

<script>
import { supplierAuditList, supplieraudits } from '@/api/supplier'
import ListPopup from './listPopup'
import Popup from '@/components/Popup/ExaminePopup.vue'
import { submitExamine } from '@/api/accessAudit'
import _ from 'loadsh'
const columns = [
  {
    title: '企业名称',
    dataIndex: 'enterpriseName',
    key: 'enterpriseName',
    fixed: 'left',
    width: 220,
    scopedSlots: { customRender: 'enterpriseName' }
  },
  {
    title: '购买套餐',
    key: 'packageName',
    dataIndex: 'packageName',
    width: 200
  },
  {
    title: '套餐金额(元)',
    key: 'sumAmount',
    // dataIndex: 'sumAmount',
    scopedSlots: { customRender: 'sumAmount' },
    width: 200
  },
  {
    title: '法定代表人',
    key: 'legalPersonName',
    width: 220,
    dataIndex: 'legalPersonName'
  },
  {
    title: '企业性质',
    dataIndex: 'enterpriseNature',
    key: 'enterpriseNature',
    width: 220,
    scopedSlots: { customRender: 'enterpriseNature' }
  },
  {
    title: '提交时间',
    dataIndex: 'submitTime',
    key: 'submitTime',
    width: 220,
    scopedSlots: { customRender: 'submitTime' }
  },
  {
    title: '审核时间',
    width: 220,
    dataIndex: 'confirmAuditTime',
    key: 'confirmAuditTime',
    scopedSlots: { customRender: 'confirmAuditTime' }
  },
  {
    title: '审核人',
    width: 220,
    dataIndex: 'confirmAuditName',
    key: 'confirmAuditName'
  },
  {
    title: '审核状态',
    width: 220,
    dataIndex: 'authStatus',
    key: 'authStatus',
    scopedSlots: { customRender: 'authStatus' }
  },

  {
    title: '预计验厂时间',
    width: 220,
    dataIndex: 'expectFactoryAuditTime',
    key: 'expectFactoryAuditTime',
    scopedSlots: { customRender: 'expectFactoryAuditTime' }
  },
  {
    title: '操作',
    // dataIndex: 'action',
    key: 'action',
    width: 170,
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  components: {
    Popup,
    submitExamine,
    ListPopup
  },
  data() {
    return {
      statusList: [
        { label: '全部', value: '' },
        { label: '待审核', value: '2' },
        { label: '审核通过', value: '3' },
        { label: '审核不通过', value: '4' }
      ],
      id: null,
      idList: [],
      popupStatus: false,
      data: [],
      singleId: 1,
      auditType: 1,
      columns,
      viewCommentsStatus: false,
      queryParam: {
        enterpriseName: '',
        legalPersonName: '',
        authStatus: '',
        time: null,
        examinetime: null,
        enterpriseNature: ''
      },
      state: {
        selectedRowKeys: []
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
  },
  mounted() {
    this.submitExamine = _.debounce(this.submitExamine, 500)
  },
  methods: {
    viewComments(id) {
      this.id = id
      this.viewCommentsStatus = true
    },
    handleTabsChange() {
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
      const { queryParam } = this
      const data = {
        ...params,
        ...queryParam
      }
      if (data.time) {
        const [beginTime, endTime] = data.time
        data.beginTime = beginTime
        data.endTime = endTime
      }
      if (data.examinetime) {
        const [beginTime, endTime] = data.examinetime
        data.confirmAuditStartTime = beginTime
        data.confirmAuditEndTime = endTime
      }
      if (data.enterpriseNature === '') {
        data.enterpriseNature = null
      }
      return supplierAuditList({ ...data })
    },
    // 打开单个审核弹框
    handleEdit(record) {
      this.auditType = 1
      this.popupStatus = true
      this.singleId = record.id
    },
    // 打开批量审核弹框
    batchhandleEdit(record) {
      this.auditType = 2
      this.popupStatus = true
    },
    // 关闭审核弹框
    closeExaminPopup() {
      this.popupStatus = false
    },
    // 审核确认接口
    async submitExamine(authStatus, auditReason) {
      let idList = []
      if (this.auditType === 1 && authStatus === 1) {
        idList = [this.singleId]
        if (this.idList.includes(this.singleId)) {
          this.idList.splice(
            this.idList.findIndex((item) => item === this.singleId),
            1
          )
        }
      } else {
        idList = this.idList
      }
      if (authStatus === 1) {
        authStatus = '3'
      } else if (authStatus === 2) {
        authStatus = '4'
      }
      const res = await supplieraudits({ ids: idList, authStatus, auditReason })
      if (res.code === '0') {
        this.$message.success('成功')
        this.idList = []
        this.$refs.table.refresh(true)
        this.state.selectedRowKeys = []
      } else {
        this.$message.error('失败')
      }
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
      this.$refs.form.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
.certificetion-audit {
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .button {
    text-align: center;
  }
  .operation-button {
    margin-bottom: 20px;
  }
  .enterpriseName {
    display: inline-block;
    width: 195px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

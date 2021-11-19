<template>
  <div class="suppliers-manage">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="queryParams">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="企业名称" prop="enterpriseName">
                <a-input v-model="queryParams.enterpriseName" placeholder="请输入企业名称"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审核人" prop="auditUserName">
                <a-input v-model="queryParams.auditUserName" placeholder="请输入审核人"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="邀请码" prop="inviteCode">
                <a-input v-model="queryParams.inviteCode" placeholder="请输入邀请码"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="提交时间" prop="createTimes">
                <a-range-picker v-model="queryParams.createTimes" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审核时间" prop="time">
                <a-range-picker v-model="queryParams.time" />
              </a-form-model-item>
            </a-col>
            <a-col :span="24" class="button">
              <a-button @click="handleReset">重置</a-button>
              <a-button type="primary" @click="handleSearch">查询</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card>
      <div class="bottom">
        <div>
          <a-tabs default-active-key="1" @change="callback">
            <a-tab-pane key="1" tab="全部"> </a-tab-pane>
            <a-tab-pane key="3" tab="采购商" force-render></a-tab-pane>
            <a-tab-pane key="0" tab="两者都是"></a-tab-pane>
            <a-tab-pane key="10" tab="财务通过"></a-tab-pane>
            <a-tab-pane key="11" tab="财务不通过"></a-tab-pane>
          </a-tabs>
        </div>
        <s-table
          ref="table"
          name="manageTabless"
          rowKey="id"
          :scroll="{ x: 2200 }"
          :columns="columns"
          :data="initTable"
        >
          <template v-slot:updateTime="props">
            <span v-if="props">
              {{ props | moment('YYYY-MM-DD HH:mm:ss') }}
            </span>
          </template>
          <template v-slot:createTime="props">
            <span v-if="props">
              {{ props | moment('YYYY-MM-DD HH:mm:ss') }}
            </span>
          </template>
          <template v-slot:auditTime="props">
            <span v-if="props">
              {{ props | moment('YYYY-MM-DD HH:mm:ss') }}
            </span>
          </template>
          <template slot="powerOfAttorney" slot-scope="text">
            <div>
              <ImagePreview :width="40" :height="40" :value="[text.powerOfAttorneyUrl]" />
            </div>
          </template>
          <template slot="businessLicense" slot-scope="text">
            <div>
              <ImagePreview :width="40" :height="40" :value="[text.businessLicenceUrl]" />
            </div>
          </template>
          <template v-slot:enterpriseName="props">
            <router-link :to="{ name: 'PurchaserManageDetail', params: { id: props.id } }">{{
              props.enterpriseName
            }}</router-link>
          </template>
          <template slot="financeAuditStatus" slot-scope="text">
            <div v-show="text.financeAuditStatus == '1'">
              <div class="green"></div>
              审核通过
            </div>
            <div v-show="text.financeAuditStatus == '0'">
              <div class="green orange"></div>
              待审核
            </div>
            <div v-show="text.financeAuditStatus == '3'">
              <div class="green red"></div>
              审核失败
            </div>
            <div v-show="text.financeAuditStatus == '4'">
              <div class="green grey"></div>
              未录入
            </div>
          </template>
          <template slot="operation" slot-scope="text">
            <span class="examineButton" @click="viewEnterprise(text.enterpriseName)"> 查看企业风险 </span>
          </template>
        </s-table>
      </div>
    </a-card>
  </div>
</template>
<script>
import { getphserList } from '@/api/purchaser'
import ImagePreview from '@/components/ImagePreview/'
import { getBasicInfoSplicingUrl } from '@/api/accessAudit'
export default {
  components: {
    ImagePreview
  },
  name: 'PuchaserList',
  data() {
    return {
      data: [],
      columns,
      pageNum: 1,
      queryParam: {},
      selectedRowKeys: [],
      queryParams: {
        auditStatus: '1',
        enterpriseName: '',
        time: null,
        createTimes: null,
        sign: '2',
        financeAuditStatus: ''
      }
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  methods: {
    callback(e) {
      if (e === '0' || e === '1' || e === '3') {
        this.queryParams.sign = e
        this.queryParams.financeAuditStatus = ''
      } else if (e === '10') {
        this.queryParams.financeAuditStatus = '1'
        this.queryParams.sign = '0'
      } else {
        this.queryParams.financeAuditStatus = '3'
        this.queryParams.sign = '0'
      }
      this.$refs.table.refresh(true)
    },
    // 点击查看企业风险
    viewEnterprise(name) {
      getBasicInfoSplicingUrl({ keyword: name }).then((res) => {
        if (res.success) {
          console.log(res.data)
          window.open(res.data)
        } else {
          this.$message.error('查看企业风险失败!')
        }
      })
    },
    async initTable(params) {
      const { queryParams } = this
      const data = {
        ...params,
        ...queryParams
      }
      if (data.time) {
        const [startTime, endTime] = data.time
        data.auditStartTime = startTime
        data.auditEndTime = endTime
      }
      if (data.createTimes) {
        const [startTime, endTime] = data.createTimes
        data.beginTime = startTime
        data.endTime = endTime
      }
      return getphserList({ ...data })
    },
    handleSearch() {
      this.$refs.table.refresh(true)
    },
    handleReset() {
      this.$refs.ruleForm.resetFields()
    }
  }
}

const columns = [
  {
    title: '企业名称',
    key: 'enterpriseName',
    fixed: 'left',
    width: 220,
    scopedSlots: { customRender: 'enterpriseName' }
  },
  {
    title: '授权委托书',
    key: 'powerOfAttorney',
    scopedSlots: { customRender: 'powerOfAttorney' },
    width: 120
  },
  {
    title: '营业执照',
    key: 'businessLicense',
    scopedSlots: { customRender: 'businessLicense' },
    width: 120
  },
  {
    title: '统一社会信用代码',
    dataIndex: 'businessLicenceNo',
    width: 200
  },
  {
    title: '法定代表人',
    dataIndex: 'legalPersonName'
  },
  {
    title: '管理员手机号',
    dataIndex: 'registerMobile',
    width: 150
  },
  {
    title: '身份来源',
    dataIndex: 'supplierOrPurchaser'
  },
  {
    title: '提交时间',
    key: 'createTime',
    dataIndex: 'createTime',
    width: 180,
    scopedSlots: { customRender: 'createTime' }
  },
  {
    title: '审核时间',
    key: 'auditTime',
    dataIndex: 'auditTime',
    width: 180,
    scopedSlots: { customRender: 'auditTime' }
  },
  {
    title: '审核人',
    dataIndex: 'auditUserName'
  },
  {
    title: '邀请码',
    dataIndex: 'inviteCode'
  },
  {
    title: '财务审核状态',
    key: 'financeAuditStatus',
    scopedSlots: { customRender: 'financeAuditStatus' }
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 120,
    scopedSlots: { customRender: 'operation' }
  }
]
</script>
<style lang="less" scoped>
.suppliers-manage {
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .button {
    text-align: center;
  }
}
.examineButton {
  display: inline-block;
  margin-left: 10px;
  color: #ff6b00;
  &:hover {
    cursor: pointer;
  }
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
.grey {
  background: #ccc;
}
</style>

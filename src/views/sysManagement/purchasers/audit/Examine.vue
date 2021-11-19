<template>
  <div class="examine">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper-custom">
        <a-form-model
          layout="inline"
          ref="ruleForm"
          :model="query"
          v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }"
        >
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="企业名称" prop="enterpriseName">
                <a-input placeholder="请输入企业名称" class="inp" v-model="query.enterpriseName" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审核人" prop="auditUserName">
                <a-input placeholder="请输入审核人" class="inp" v-model="query.auditUserName" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="邀请码" prop="inviteCode">
                <a-input placeholder="请输入邀请码" class="inp" v-model="query.inviteCode" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="提交时间" prop="createTimes">
                <a-range-picker v-model="query.createTimes" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审核时间" prop="time">
                <a-range-picker v-model="query.time" />
              </a-form-model-item>
            </a-col>
            <a-col :span="24" class="button">
              <a-button @click="resetQuery">重置</a-button>
              <a-button type="primary" @click="handleSearch">查询</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <div class="queryResults">
      <div>
        <a-tabs default-active-key="" @change="callback">
          <a-tab-pane key="" tab="全部"> </a-tab-pane>
          <a-tab-pane key="1" tab="审核通过" force-render></a-tab-pane>
          <a-tab-pane key="0" tab="待审核"></a-tab-pane>
          <a-tab-pane key="2" tab="驳回"></a-tab-pane>
          <a-tab-pane key="10" tab="财务通过"></a-tab-pane>
          <a-tab-pane key="11" tab="财务不通过"></a-tab-pane>
        </a-tabs>
      </div>
      <div class="queryResults_button">
        <a-button class="reset" @click="showExaminePopup" :disabled="ids.length > 0 ? false : true"> 批量审核</a-button>
      </div>
      <div>
        <s-table
          name="Examine"
          ref="table"
          rowKey="id"
          :scroll="{ x: 2200 }"
          :columns="columns"
          :row-selection="rowSelection"
          :data="init"
        >
          <template slot="action" slot-scope="text">
            <div class="examineButton" @click="viewEnterprise(text.enterpriseName)">查看企业风险</div>
            <div class="examineButton" @click="showExaminePopup(text.id)" v-if="text.auditStatus == 0">审核</div>
            <div class="examineButton" @click="showComments(text.id)">查看审核意见</div>
          </template>
          <template v-slot:createTime="props">
            <span v-if="props">{{ props | moment('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
          <template v-slot:auditTime="props">
            <span v-if="props">{{ props | moment('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
          <template v-slot:updateTime="props">
            <span v-if="props">
              {{ props | moment('YYYY-MM-DD HH:mm:ss') }}
            </span>
          </template>
          <template slot="enterpriseName" slot-scope="text">
            <div class="fromNames" @click="nameJump(text.id)">
              {{ text.enterpriseName }}
            </div>
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
          <template slot="auditStatus" slot-scope="text">
            <div v-show="text.auditStatus == 1">
              <div class="green"></div>
              审核通过
            </div>
            <div v-show="text.auditStatus == 0">
              <div class="green orange"></div>
              待审核
            </div>
            <div v-show="text.auditStatus == 2">
              <div class="green red"></div>
              驳回
              <a-tooltip placement="top">
                <template slot="title">
                  <p>{{ text.auditReason }}</p>
                </template>
                <!-- <img class="rejectImg" src="../../assets/icons/u2969.svg" alt="" /> -->
                <a-icon type="question-circle" placement="top" />
              </a-tooltip>
            </div>
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
        </s-table>
      </div>
    </div>
    <a-modal
      title="审核记录"
      :visible="visible"
      :footer="null"
      :width="900"
      :bodyStyle="{
        width: '900px'
      }"
      @cancel="handleCancelComments"
    >
      <s-table name="Comments" ref="commentsTable" rowKey="auditTime" :columns="commentsColumns" :data="commentsInit">
        <template v-slot:auditTime="props">
          <span v-if="props">{{ props.auditTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
          <span v-else></span>
        </template>
        <template slot="auditStatus" slot-scope="text">
          <div v-show="text.auditStatus == '审核通过'">
            <div class="green"></div>
            审核通过
          </div>
          <div v-show="text.auditStatus == '驳回'">
            <div class="green red"></div>
            驳回
          </div>
        </template>
      </s-table>
    </a-modal>
    <Popup :popupStatus.sync="popupStatus" @submitExamine="submitExamine" />
  </div>
</template>
<script>
import ImagePreview from '@/components/ImagePreview/'
import Popup from '@/components/Popup/ExaminePopup'
import { accessAuditQuyeryPage, submitExamine, getBasicInfoSplicingUrl, viewApprovalComments } from '@/api/accessAudit'
import _ from 'loadsh'
export default {
  components: {
    Popup,
    ImagePreview
  },
  data() {
    return {
      ids: [],

      visible: false,
      query: {
        financeAuditStatus: '',
        enterpriseName: '',
        auditStatus: '',
        times: null,
        createTimes: null,
        sign: 'purchaser'
      },
      pageNumber: '10',
      popupStatus: false,
      resetData: 1,
      columns: [
        {
          title: '企业名称',
          key: 'enterpriseName',
          fixed: 'left',
          scopedSlots: { customRender: 'enterpriseName' },
          width: 250
        },
        {
          title: '营业执照',
          key: 'businessLicense',
          scopedSlots: { customRender: 'businessLicense' },
          width: 120
        },
        {
          title: '授权委托书',
          key: 'powerOfAttorney',
          scopedSlots: { customRender: 'powerOfAttorney' },
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
          key: 'registerMobile',
          dataIndex: 'registerMobile'
        },
        {
          title: '审核状态',
          key: 'auditStatus',
          scopedSlots: { customRender: 'auditStatus' }
        },
        {
          title: '提交时间',
          key: 'createTime',
          dataIndex: 'createTime',
          width: 200,
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '审核时间',
          key: 'auditTime',
          dataIndex: 'auditTime',
          width: 200,
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

        // {
        //   title: '备注',
        //   key: '备注',
        //   dataIndex: 'contactRemark',
        //   ellipsis: true
        // },
        {
          title: '操作',
          fixed: 'right',
          key: 'action',
          width: 180,
          scopedSlots: { customRender: 'action' }
        }
      ],
      commentsColumns: [
        {
          title: '审批结果',
          key: 'auditStatus',
          width: 120,
          scopedSlots: { customRender: 'auditStatus' }
        },
        { title: '审批时间', key: 'auditTime', scopedSlots: { customRender: 'auditTime' } },
        {
          title: '审批人',
          key: 'auditUserName',
          dataIndex: 'auditUserName'
        },
        {
          title: '审批意见',
          key: 'auditReason',
          width: 200,
          dataIndex: 'auditReason'
        }
      ]
    }
  },
  computed: {
    rowSelection() {
      const that = this
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          that.ids = selectedRowKeys
        },
        getCheckboxProps: (record) => {
          return {
            props: {
              disabled: record.auditStatus !== '0'
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
    async init(params) {
      const { query } = this
      var data = {
        ...params,
        ...query
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
      return accessAuditQuyeryPage({ ...data })
    },
    nameJump(id) {
      this.$router.push({
        name: 'PurchasersAuditDetails',
        query: {
          id: id
        }
      })
    },
    // 点击查看企业风险
    viewEnterprise(name) {
      getBasicInfoSplicingUrl({ keyword: name }).then((res) => {
        if (res.success) {
          window.open(res.data)
        } else {
          this.$message.error('查看企业风险失败!')
        }
      })
    },
    submitExamine(auditStatus, auditReason) {
      const { ids } = this
      submitExamine({ ids, auditStatus, auditReason }).then((res) => {
        if (res.success) {
          this.$message.success('提交成功')
          this.popupStatus = false
          this.handleSearch()
        } else {
          this.$message.error('提交失败')
        }
      })
    },
    // auditStatusEvent(value) {
    //   this.query.auditStatus = value
    // },
    resetQuery() {
      this.$refs.ruleForm.resetFields()
    },
    async commentsInit() {
      const data = {
        id: this.id
      }
      return viewApprovalComments({ ...data })
    },
    // 显示审核弹窗
    showExaminePopup(id) {
      this.popupStatus = true
      if (id) {
        this.ids = [id]
      }
    },
    onchangePage(pageNumber) {
      console.log('Page: ', pageNumber)
    },
    onChange(date, dateString) {
      this.query.beginTime = date[0]['_d']
      this.query.endTime = date[1]['_d']
    },
    handleSearch() {
      this.$refs.table.refresh(true)
    },
    callback(e) {
      if (e === '' || e === '0' || e === '1' || e === '2') {
        this.query.auditStatus = e
        this.query.financeAuditStatus = ''
      } else if (e === '10') {
        this.query.financeAuditStatus = '1'
        this.query.auditStatus = ''
      } else {
        this.query.financeAuditStatus = '3'
        this.query.auditStatus = ''
      }
      this.$refs.table.refresh(true)
    },
    showComments(id) {
      this.visible = true
      this.id = id
      this.$refs.commentsTable.refresh(true)
    },
    handleCancelComments(e) {
      this.visible = false
    }
  }
}
</script>
<style lang='less' scoped>
.suppliers-manage {
  .ant-card + .ant-card {
    margin-top: 20px;
  }
}
.examine {
  width: 100%;
  .button {
    text-align: center;
  }
  .query {
    width: 100%;
    padding-top: 24px;
    height: 128px;
    background: #ffffff;
    .queryInput li .inp {
      width: 210px !important;
      height: 32px;
    }
    .queryInput {
      margin: 0px;
      display: flex;
      li {
        flex: 1;
        text-align: center;
        span {
          margin-right: 10px;
          font-size: 14px;
        }
      }
    }
    .queryButton {
      text-align: center;
      width: 100%;
      height: 32px;
      border-radius: 8px;
      margin-top: 20px;
      .ant-btn + .ant-btn {
        margin-left: 10px;
      }
    }
  }
  .queryResults {
    width: 100%;
    padding: 24px 24px 0 24px;
    background: #ffffff;
    margin-top: 20px;
    border-radius: 8px;
    .queryResults_button {
      margin-bottom: 20px;
    }
  }
}
.fromNames {
  color: #ff6b00;
  cursor: pointer;
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
.rejectImg {
  width: 16px;
  height: 16px;
  margin-top: -3px;
}
.question {
  width: 16px;
  height: 16px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}
.examineButton {
  display: block;
  margin-left: 10px;
  color: #ff6b00;
  &:hover {
    cursor: pointer;
  }
}
.imgBox {
  width: 40px;
  height: 40px;
  &:hover {
    background: rgba(0, 0, 0, 0.5);
  }
}
.pageLeft {
  float: left;
}
.paginations {
  width: 100%;
  margin-top: 20px;
  height: 50px;
}
.textAlign {
  text-align: center;
}
.enterpriseName {
  cursor: pointer;
}
</style>

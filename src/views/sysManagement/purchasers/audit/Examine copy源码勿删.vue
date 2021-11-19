<template>
  <div class="examine">
    <div class="query">
      <ul class="queryInput">
        <li>
          <span>企业名称:</span>
          <a-input placeholder="请输入企业名称" class="inp" v-model="query.enterpriseName" />
        </li>
        <!-- <li>
          <span>审核状态:</span>
          <a-select
            allowClear
            :getPopupContainer="(triggerNode) => triggerNode.parentNode"
            @change="auditStatusEvent"
            v-model="query.auditStatus"
            class="inp"
          >
            <a-select-option value=""> 全部 </a-select-option>
            <a-select-option value="2"> 驳回 </a-select-option>
            <a-select-option value="1"> 审核通过 </a-select-option>
            <a-select-option value="0"> 待审核 </a-select-option>
          </a-select>
        </li> -->
        <li>
          <span>提交时间:</span>
          <a-range-picker showTime @change="onChange" :key="resetData" class="inp" />
        </li>
      </ul>
      <div class="queryButton">
        <a-button @click="resetQuery">重置</a-button>
        <a-button type="primary" @click="handleSearch">查询</a-button>
      </div>
    </div>
    <div class="queryResults">
      <div>
        <a-tabs default-active-key="" @change="callback">
          <a-tab-pane key="" tab="全部"> </a-tab-pane>
          <a-tab-pane key="1" tab="审核通过" force-render></a-tab-pane>
          <a-tab-pane key="0" tab="待审核"></a-tab-pane>
          <a-tab-pane key="2" tab="驳回"></a-tab-pane>
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
          :scroll="{ x: 1500 }"
          :columns="columns"
          :row-selection="rowSelection"
          :data="init"
        >
          <template slot="action" slot-scope="text">
            <span class="examineButton" style="color: #1890ff" @click="viewEnterprise(text.enterpriseName)">
              查看企业风险
            </span>
            <div
              class="examineButton"
              @click="showExaminePopup(text.id)"
              v-if="text.auditStatus == 0"
              style="color: #1890ff"
            >
              审核
            </div>
          </template>
          <template v-slot:createTime="props">
            <span v-if="props">{{ props.createTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
            <span v-else></span>
          </template>
          <template slot="name" slot-scope="text">
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
        </s-table>
      </div>
    </div>
    <Popup :popupStatus.sync="popupStatus" @submitExamine="submitExamine" />
  </div>
</template>
<script>
import ImagePreview from '@/components/ImagePreview/'
import Popup from '@/components/Popup/ExaminePopup'
import { accessAuditQuyeryPage, submitExamine, getBasicInfoSplicingUrl } from '@/api/accessAudit'
import _ from 'loadsh'
export default {
  components: {
    Popup,
    ImagePreview
  },
  data() {
    return {
      ids: [],
      query: {
        enterpriseName: '',
        auditStatus: '',
        beginTime: '',
        endTime: '',
        sign: 'purchaser'
      },
      pageNumber: '10',
      popupStatus: false,
      resetData: 1,
      columns: [
        {
          title: '企业名称',
          key: 'name',
          width: 220,
          scopedSlots: { customRender: 'name' },
          fixed: 'left'
        },
        {
          title: '管理员手机号',
          key: 'registerMobile',
          dataIndex: 'registerMobile'
        },
        {
          title: '授权委托书',
          key: 'powerOfAttorney',
          scopedSlots: { customRender: 'powerOfAttorney' }
        },
        {
          title: '营业执照',
          key: 'businessLicense',
          scopedSlots: { customRender: 'businessLicense' }
        },
        {
          title: '提交时间',
          key: 'createTime',
          width: 200,
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '审核状态',
          key: 'auditStatus',
          scopedSlots: { customRender: 'auditStatus' }
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
    auditStatusEvent(value) {
      this.query.auditStatus = value
    },
    resetQuery() {
      this.query = {
        enterpriseName: '',
        auditStatus: '',
        beginTime: '',
        endTime: '',
        sign: 'supplier'
      }
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
    callback(v) {
      this.query.auditStatus = v
      this.$refs.table.refresh(true)
    }
  }
}
</script>
<style lang='less' scoped>
.examine {
  width: 100%;
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
  display: inline-block;
  margin-left: 10px;
  color: #1890ff;
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

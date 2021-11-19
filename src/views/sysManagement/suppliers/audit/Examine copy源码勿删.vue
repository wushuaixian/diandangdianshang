<template>
  <div class="examine">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="query">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="企业名称">
                <a-input placeholder="请输入企业名称" class="inp" v-model="query.enterpriseName" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="主营品类">
                <a-select allowClear v-model="query.categoryId" class="inp">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in categoryList" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="企业性质">
                <a-select allowClear v-model="query.enterpriseNature" class="inp">
                  <a-select-option value=""> 全部 </a-select-option>
                  <a-select-option value="1"> 生产商 </a-select-option>
                  <a-select-option value="2"> 贸易商 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="提交时间">
                <a-range-picker v-model="query.time" class="inp" />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :sm="24" class="button">
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
        </a-tabs>
      </div>
      <div class="queryResults_button">
        <a-button class="reset" @click="popupStatus = true" :disabled="ids.length > 0 ? false : true">
          批量审核</a-button
        >
      </div>
      <div>
        <s-table
          name="ExamineTable"
          :scroll="{ x: 1600 }"
          ref="table"
          rowKey="id"
          :columns="columns"
          :row-selection="rowSelection"
          :data="init"
        >
          <template slot="action" slot-scope="text">
            <span class="examineButton" @click="viewEnterprise(text.enterpriseName)"> 查看企业风险 </span>
            <div class="examineButton" @click="showExaminePopup(text.id)" v-if="text.auditStatus == 0">审核</div>
          </template>
          <template v-slot:createTime="props">
            <span v-if="props">{{ props.createTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
            <span v-else></span>
          </template>
          <template slot="enterpriseNature" slot-scope="text">
            <span v-if="text.enterpriseNature === '1'">生产商</span>
            <span v-else-if="text.enterpriseNature === '2'">贸易商</span>
            <span v-else>其他</span>
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
        </s-table>
      </div>
    </div>
    <Popup :popupStatus.sync="popupStatus" @submitExamine="submitExamine" />
  </div>
</template>
<script>
import ImagePreview from '@/components/ImagePreview/'
import Popup from '@/components/Popup/ExaminePopup'
import { accessAuditQuyery, submitExamine, getBasicInfoSplicingUrl } from '@/api/accessAudit'
import * as userAPI from '@/api/user'
import _ from 'loadsh'
export default {
  components: {
    Popup,
    ImagePreview
  },
  created() {
    this.BindData()
  },
  data() {
    return {
      ids: [],
      categoryList: [],
      query: {
        enterpriseName: '',
        auditStatus: '',
        beginTime: '',
        endTime: '',
        sign: 'supplier',
        enterpriseNature: '',
        categoryId: ''
      },
      pageNumber: '10',
      popupStatus: false,
      resetData: 1,
      columns: [
        {
          title: '企业名称',
          key: 'enterpriseName',
          scopedSlots: { customRender: 'enterpriseName' },
          fixed: 'left',
          width: 220
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
          title: '主营品类',
          key: 'name',
          dataIndex: 'name'
        },
        {
          title: '企业性质',
          key: 'enterpriseNature',
          scopedSlots: { customRender: 'enterpriseNature' }
        },
        {
          title: '提交时间',
          key: 'createTime',
          ellipsis: true,
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
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  mounted() {
    this.submitExamine = _.debounce(this.submitExamine, 500)
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
  methods: {
    async init(params) {
      const { query } = this
      var data = {
        ...params,
        ...query
      }
      if (data.time) {
        const [beginTime, endTime] = data.time
        data.beginTime = beginTime
        data.endTime = endTime
      }
      return accessAuditQuyery({ ...data })
    },
    async BindData() {
      userAPI.queryMerAllCategory().then((ret) => {
        this.categoryList = ret.data
      })
    },
    nameJump(id) {
      this.$router.push({
        name: 'SuppliersAuditDetails',
        query: {
          id: id
        }
      })
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
    async submitExamine(auditStatus, auditReason) {
      const { ids } = this
      const res = await submitExamine({ ids, auditStatus, auditReason })
      if (res.code === '0') {
        this.$message.success('提交成功')
        this.handleSearch()
      } else {
        this.$message.error('提交失败')
      }
    },
    callback(v) {
      this.query.auditStatus = v
      this.$refs.table.refresh(true)
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
        sign: 'supplier',
        enterpriseNature: '',
        categoryId: ''
      }
    },
    // 显示审核弹窗
    showExaminePopup(id) {
      this.popupStatus = true
      this.ids = [id]
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
    }
  }
}
</script>
<style lang='less' scoped>
.examine {
  width: 100%;
  .button {
    text-align: center;
  }
  .top {
    width: 100%;
    height: 176px;
    background: #ffffff;
    border-radius: 8px;
    padding-top: 24px;
    margin-bottom: 20px;
    .top_inpui {
      display: flex;
      height: 32px;
      div {
        flex: 1;
        text-align: center;
        .inp {
          width: 210px;
          margin-left: 8px;
        }
        span {
          width: 102px;
          overflow: hidden;
          display: inline-block;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 15px;
        }
      }
    }
    .top_input_bottom {
      margin-top: 24px;
    }
    .top_button {
      width: 100%;
      height: 32px;
      margin-top: 18px;
      text-align: center;
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

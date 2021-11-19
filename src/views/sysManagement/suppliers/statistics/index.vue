<template>
  <div class="examine">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper-custom">
        <a-form-model
          layout="inline"
          ref="ruleForm"
          :model="query"
          v-bind="{
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
          }"
        >
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="企业名称" prop="enterpriseName">
                <a-input v-model="query.enterpriseName" placeholder="请输入企业名称"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="法人名称" prop="legalPersonName">
                <a-input v-model="query.legalPersonName" placeholder="请输入法人名称"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="管理员手机号" prop="registerMobile">
                <a-input v-model="query.registerMobile" placeholder="请输入管理员手机号"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="企业性质" prop="enterpriseNature">
                <a-select allowClear v-model="query.enterpriseNature" class="inp">
                  <a-select-option value=""> 全部 </a-select-option>
                  <a-select-option value="1"> 生产商 </a-select-option>
                  <a-select-option value="2"> 贸易商 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="身份来源" prop="sign">
                <a-select allowClear v-model="query.sign" class="inp">
                  <a-select-option value="1"> 全部 </a-select-option>
                  <a-select-option value="0"> 两者都是 </a-select-option>
                  <a-select-option value="4"> 仅供应商 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="主营品类" prop="categoryId">
                <a-select allowClear v-model="query.categoryId" class="inp">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in categoryList" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="提交时间" prop="createTimes">
                <a-range-picker v-model="query.createTimes" class="inp" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审核状态" prop="auditStatus">
                <!-- <a-input v-model="query.auditStatus" placeholder="请输入审核状态"></a-input> -->
                <a-select allowClear v-model="query.auditStatus" class="inp">
                  <a-select-option value=""> 全部 </a-select-option>
                  <a-select-option value="1"> 审核通过 </a-select-option>
                  <a-select-option value="0"> 待审核 </a-select-option>
                  <a-select-option value="2"> 驳回 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审核时间" prop="time">
                <a-range-picker v-model="query.time" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审核人" prop="auditUserName">
                <a-input v-model="query.auditUserName" placeholder="请输入审核人"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="邀请码" prop="inviteCode">
                <a-input v-model="query.inviteCode" placeholder="请输入邀请码"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="财务状态" prop="financeAuditStatus">
                <!-- <a-input v-model="query.financeAuditStatus" placeholder="请输入财务状态"></a-input> -->
                <a-select allowClear v-model="query.financeAuditStatus" class="inp">
                  <a-select-option value=""> 全部 </a-select-option>
                  <a-select-option value="1"> 审核通过 </a-select-option>
                  <!-- <a-select-option value="0"> 待审核 </a-select-option> -->
                  <a-select-option value="3"> 审核失败 </a-select-option>
                  <!-- <a-select-option value="4"> 未录入 </a-select-option> -->
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="套餐名称" prop="packageName">
                <a-input v-model="query.packageName" placeholder="请输入套餐名称"></a-input>
              </a-form-model-item>
            </a-col>

            <a-col :md="24" :sm="24" class="button">
              <a-button @click="resetQuery">重置</a-button>
              <a-button type="primary" @click="handleSearch">查询</a-button>
              <a-button @click="exportData">导出</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>

    <div class="queryResults">
      <!-- <div>
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
        <a-button class="reset" @click="popupStatus = true" :disabled="ids.length > 0 ? false : true">
          批量审核</a-button
        >
      </div> -->
      <div>
        <s-table name="ExamineTable" :scroll="{ x: 2600 }" ref="table" :columns="columns" :data="init">
          <!-- <template slot="action" slot-scope="text">
            <div class="examineButton" @click="viewEnterprise(text.enterpriseName)">查看企业风险</div>
            <div class="examineButton" @click="showExaminePopup(text.id)" v-if="text.auditStatus == 0">审核</div>
            <div class="examineButton" @click="showComments(text.id)">查看审核意见</div>
          </template> -->
          <template v-slot:createTime="props">
            <span v-if="props">{{ props | moment('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
          <template v-slot:updateTime="props">
            <span v-if="props">{{ props | moment('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
          <template v-slot:auditTime="props">
            <span v-if="props">{{ props | moment('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
          <template slot="enterpriseNature" slot-scope="text">
            <span v-if="text.enterpriseNature === '1'">生产商</span>
            <span v-else-if="text.enterpriseNature === '2'">贸易商</span>
            <span v-else>其他</span>
          </template>
          <template slot="enterpriseName" slot-scope="text">
            <!-- @click="nameJump(text.id)" -->
            <div class="fromNames">
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
          <template slot="sumAmount" slot-scope="text">
            <div v-if="text.sumAmount">¥{{ text.sumAmount }}</div>
          </template>
        </s-table>
      </div>
    </div>
  </div>
</template>
<script>
import ImagePreview from '@/components/ImagePreview/'
import { getPageStatistics, exportStatistics } from '@/api/supplierStatistics'
import * as userAPI from '@/api/user'
// import _ from 'loadsh'
export default {
  components: {
    ImagePreview
  },
  created() {
    this.BindData()
  },
  data() {
    return {
      ids: [],
      id: '',
      categoryList: [],
      visible: false,
      query: {
        auditUserName: '',
        inviteCode: '',
        enterpriseName: '',
        auditStatus: '',
        beginTime: '',
        endTime: '',
        // sign: '1',
        enterpriseNature: '',
        categoryId: '',
        time: null,
        createTimes: null,
        legalPersonName: '', // 法人名称
        registerMobile: '', // 管理员手机号
        // auditStatus: '', // 审核状态
        financeAuditStatus: '', // 财务状态
        sign: '1', // sign==1默认；sign==0两者都是；sign==4仅供应商
        packageName: '', // 套餐名称
        sumAmount: '' // 套餐总金额
      },
      pageNumber: '10',
      popupStatus: false,
      resetData: 1,
      columns: [
        {
          title: '企业名称',
          key: 'enterpriseName',
          scopedSlots: { customRender: 'enterpriseName' },
          width: 280,
          fixed: 'left'
        },
        { title: '统一社会信用代码', width: 200, key: 'businessLicenceNo', dataIndex: 'businessLicenceNo' },
        { title: '法定代表人', dataIndex: 'legalPersonName', key: 'legalPersonName' },
        { title: '管理员手机号', key: 'registerMobile', dataIndex: 'registerMobile' },
        { title: '企业性质', key: 'enterpriseNature', scopedSlots: { customRender: 'enterpriseNature' } },
        { title: '身份来源', key: 'supplierOrPurchaser', dataIndex: 'supplierOrPurchaser' },
        { title: '主营品类', key: 'name', dataIndex: 'name' },

        // { title: '营业执照', key: 'businessLicense', scopedSlots: { customRender: 'businessLicense' } },
        // { title: '授权委托书', key: 'powerOfAttorney', scopedSlots: { customRender: 'powerOfAttorney' } },

        {
          title: '提交日期',
          key: 'createTime',
          dataIndex: 'createTime',
          width: 200,
          scopedSlots: { customRender: 'createTime' }
        },
        { title: '审核状态', key: 'auditStatus', scopedSlots: { customRender: 'auditStatus' } },
        {
          title: '审核时间',
          key: 'auditTime',
          dataIndex: 'auditTime',
          width: 200,
          scopedSlots: { customRender: 'auditTime' }
        },
        { title: '审核人', dataIndex: 'auditUserName', key: 'auditUserName' },
        { title: '邀请码', dataIndex: 'inviteCode' },
        { title: '财务状态', key: 'financeAuditStatus', scopedSlots: { customRender: 'financeAuditStatus' } },
        {
          title: '套餐名称',
          key: 'packageName',
          dataIndex: 'packageName',
          width: 200
        },
        {
          title: '套餐金额（元）',
          key: 'sumAmount',
          // dataIndex: 'sumAmount',
          scopedSlots: { customRender: 'sumAmount' },
          width: 200
        }

        // {
        //   title: '操作',
        //   fixed: 'right',
        //   key: 'action',
        //   width: 120,
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      commentsColumns: [
        { title: '审批结果', key: 'auditStatus', width: 120, scopedSlots: { customRender: 'auditStatus' } },
        { title: '审批时间', key: 'auditTime', width: 200, scopedSlots: { customRender: 'auditTime' } },
        { title: '审批人', key: 'auditUserName', width: 120, dataIndex: 'auditUserName' },
        { title: '审批意见', key: 'auditReason', dataIndex: 'auditReason' }
      ]
    }
  },
  mounted() {},
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
        const [auditStartTime, auditEndTime] = data.time
        data.auditStartTime = auditStartTime
        data.auditEndTime = auditEndTime
      }
      if (data.createTimes) {
        const [beginTime, endTime] = data.createTimes
        data.beginTime = beginTime
        data.endTime = endTime
      }

      return getPageStatistics({ ...data })
    },
    async BindData() {
      userAPI.queryMerAllCategory().then((ret) => {
        this.categoryList = ret.data
      })
    },

    // nameJump(id) {
    //   this.$router.push({
    //     name: 'SuppliersAuditDetails',
    //     query: {
    //       id: id
    //     }
    //   })
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
    // auditStatusEvent(value) {
    //   this.query.auditStatus = value
    // },
    resetQuery() {
      this.$refs.ruleForm.resetFields()
      this.query.categoryId = ''
      this.query.enterpriseNature = ''
    },
    onChange(date, dateString) {
      this.query.beginTime = date[0]['_d']
      this.query.endTime = date[1]['_d']
    },
    handleSearch() {
      this.$refs.table.refresh(true)
    },
    exportData() {
      const { query } = this
      var data = {
        ...query
        // currentPage: 1,
        // itemsPerPage: 10
      }
      if (data.time) {
        const [auditStartTime, auditEndTime] = data.time
        data.auditStartTime = auditStartTime
        data.auditEndTime = auditEndTime
      }
      if (data.createTimes) {
        const [beginTime, endTime] = data.createTimes
        data.beginTime = beginTime
        data.endTime = endTime
      }
      exportStatistics({ ...data }).then((res) => {
        console.log(res)
        const blob = new Blob([res], {
          type: 'application/vnd.ms-excel' // 将会被放入到blob中的数组内容的MIME类型
          // type: 'application/vnd.ms-excel;charset=utf-8' // 将会被放入到blob中的数组内容的MIME类型
        })
        const objectUrl = URL.createObjectURL(blob) // 生成一个url
        const filename = '供应商统计报表数据' + Date.now()
        const a = document.createElement('a')
        a.href = objectUrl
        a.download = filename
        a.click()
      })
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
.Cblock {
  display: block;
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

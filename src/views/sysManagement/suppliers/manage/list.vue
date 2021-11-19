<template>
  <div class="suppliers-manage">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper-custom">
        <a-form-model
          layout="inline"
          ref="form"
          :model="queryParam"
          v-bind="{
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
          }"
        >
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="企业名称" prop="enterpriseName">
                <a-input v-model="queryParam.enterpriseName" placeholder="请输入企业名称" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="企业性质" prop="enterpriseNature">
                <a-select
                  allowClear
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  v-model="queryParam.enterpriseNature"
                >
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">生产商</a-select-option>
                  <a-select-option value="2">贸易商</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="主营品类">
                <a-select allowClear v-model="queryParam.categoryId" class="inp">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in categoryList" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审核人" prop="auditUserName">
                <a-input v-model="queryParam.auditUserName" placeholder="请输入审核人"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="邀请码" prop="inviteCode">
                <a-input v-model="queryParam.inviteCode" placeholder="请输入邀请码"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="提交时间" prop="createTimes">
                <a-range-picker v-model="queryParam.createTimes" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审核时间" prop="time">
                <a-range-picker v-model="queryParam.time" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="认证时间" prop="authAuditTimes">
                <a-range-picker v-model="queryParam.authAuditTimes" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="身份来源" prop="sign">
                <a-select allowClear v-model="queryParam.sign" class="inp">
                  <a-select-option value="1"> 全部 </a-select-option>
                  <a-select-option value="0"> 两者都是 </a-select-option>
                  <a-select-option value="4"> 仅供应商 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <div class="button">
                <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card>
      <div class="bottom">
        <!-- <a-tabs v-model="queryParam.authStatus" @change="handleTabsChange">
          <a-tab-pane v-for="item in authStatusList" :key="item.value" :tab="item.label" />
        </a-tabs> -->
        <a-tabs default-active-key="" @change="callback">
          <a-tab-pane key="" tab="全部"> </a-tab-pane>
          <a-tab-pane key="-1" tab="未认证" force-render></a-tab-pane>
          <a-tab-pane key="0" tab="待认证"></a-tab-pane>
          <a-tab-pane key="1" tab="验厂中"></a-tab-pane>
          <a-tab-pane key="2" tab="认证中"></a-tab-pane>
          <a-tab-pane key="3" tab="认证通过"></a-tab-pane>
          <a-tab-pane key="4" tab="认证不通过"></a-tab-pane>
          <a-tab-pane key="10" tab="财务通过"></a-tab-pane>
          <a-tab-pane key="11" tab="财务不通过"></a-tab-pane>
        </a-tabs>
        <s-table
          ref="table"
          name="managesTables1"
          rowKey="id"
          :scroll="{ x: 3000 }"
          :columns="columns"
          :data="initTable"
        >
          <template v-slot:enterpriseName="props">
            <router-link :to="{ name: 'SuppliersManageDetail', params: { id: props.id } }">{{
              props.enterpriseName
            }}</router-link>
          </template>
          <template slot="sumAmount" slot-scope="text">
            <div v-if="text.sumAmount">¥{{ text.sumAmount }}</div>
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
          <template v-slot:authStatus="authStatus">
            <div v-show="authStatus == '-1'">未认证</div>
            <div v-show="authStatus == '0'">待认证</div>
            <div v-show="authStatus == '1'">验厂中</div>
            <div v-show="authStatus == '2'">认证中</div>
            <div v-show="authStatus == '3'">认证通过</div>
            <div v-show="authStatus == '4'">认证不通过</div>
          </template>
          <template slot="enterpriseNature" slot-scope="text">
            <div v-show="text.enterpriseNature == 1">生产商</div>
            <div v-show="text.enterpriseNature == 2">贸易商</div>
          </template>

          <template v-slot:createTime="createTime">
            <div v-if="createTime">{{ createTime | moment('YYYY-MM-DD HH:mm:ss') }}</div>
            <div v-else></div>
          </template>
          <template v-slot:updateTime="updateTime">
            <div v-if="updateTime">{{ updateTime | moment('YYYY-MM-DD HH:mm:ss') }}</div>
            <div v-else></div>
          </template>
          <template v-slot:authAuditTime="authAuditTime">
            <!-- <div v-if="authAuditTime">{{ authAuditTime | moment('YYYY-MM-DD HH:mm:ss') }}</div> -->
            <div v-if="authAuditTime">{{ authAuditTime | moment('YYYY-MM-DD') }}</div>
            <div v-else></div>
          </template>
          <template v-slot:auditTime="props">
            <span v-if="props">{{ props | moment('YYYY-MM-DD HH:mm:ss') }}</span>
            <span v-else></span>
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
            <span class="examineButton" v-if="queryParam.financeAuditStatus === '3'" @click="sendCheck(text)">
              发送通联审核
            </span>
          </template>
        </s-table>
      </div>
    </a-card>
  </div>
</template>
<script>
import { postSupplier } from '@/api/supplierCollection'
// import { authStatusList } from '@/config/constant'
import ImagePreview from '@/components/ImagePreview/'
import * as userAPI from '@/api/user'
import { getBasicInfoSplicingUrl, resendAllinpay } from '@/api/accessAudit'
export default {
  components: {
    ImagePreview
  },
  name: 'Supplier',
  data() {
    return {
      // authStatusList,
      categoryList: [],
      colorList: [],
      queryParam: {
        auditUserName: '',
        inviteCode: '',
        auditStatus: '1',
        authStatus: '',
        enterpriseName: '',
        enterpriseNature: '',
        time: null,
        authAuditTimes: null,
        createTimes: null,
        // sign: '1',
        financeAuditStatus: '',
        categoryId: '',
        sign: '1' // sign==1默认；sign==0两者都是；sign==4仅供应商
      },
      columns: [
        {
          title: '企业名称',
          key: 'enterpriseName',
          scopedSlots: { customRender: 'enterpriseName' },
          width: 230,
          fixed: 'left'
        },
        // {
        //   title: '身份来源',
        //   key: 'supplierOrPurchaser',
        //   dataIndex: 'supplierOrPurchaser',
        //   width: 220
        // },
        // {
        //   title: '购买套餐',
        //   key: 'packageName',
        //   dataIndex: 'packageName',
        //   width: 200
        // },
        // {
        //   title: '套餐金额(元)',
        //   key: 'sumAmount',
        //   // dataIndex: 'sumAmount',
        //   scopedSlots: { customRender: 'sumAmount' },
        //   width: 200
        // },
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
        { title: '统一社会信用代码', width: 250, key: 'businessLicenceNo', dataIndex: 'businessLicenceNo' },
        { title: '法定代表人', width: 200, dataIndex: 'legalPersonName', key: 'legalPersonName' },
        { title: '主营品类', width: 200, dataIndex: 'categoryName', key: 'categoryName' },
        { title: '企业性质', width: 200, key: 'enterpriseNature', scopedSlots: { customRender: 'enterpriseNature' } },
        {
          title: '身份来源',
          key: 'supplierOrPurchaser',
          dataIndex: 'supplierOrPurchaser',
          width: 220
        },
        {
          title: '管理员手机号',
          key: 'registerMobile',
          width: 200,
          dataIndex: 'registerMobile'
        },
        {
          title: '提交时间',
          dataIndex: 'createTime',
          key: 'createTime',
          width: 200,
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '审核时间',
          dataIndex: 'auditTime',
          key: 'auditTime',
          width: 200,
          scopedSlots: { customRender: 'auditTime' }
        },
        { title: '审核人', width: 200, dataIndex: 'auditUserName', key: 'auditUserName' },
        {
          title: '认证状态',
          dataIndex: 'authStatus',
          key: 'authStatus',
          scopedSlots: { customRender: 'authStatus' },
          width: 200
        },
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
        },
        {
          title: '认证时间',
          width: 200,
          dataIndex: 'authAuditTime',
          key: 'authAuditTime',
          scopedSlots: { customRender: 'authAuditTime' }
        },
        {
          title: '邀请码',
          width: 200,
          key: 'inviteCode',
          dataIndex: 'inviteCode'
        },

        {
          title: '财务审核状态',
          width: 200,
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
      ],
      data: []
    }
  },
  created() {
    this.BindData()
  },
  methods: {
    sendCheck(text) {
      console.log(text)
      resendAllinpay({ merchantId: text.orgId }).then((res) => {
        this.$message.success(res.data)
      })
    },
    handleReset() {
      this.$refs.form.resetFields()
      this.queryParam.categoryId = ''
      this.queryParam.enterpriseNature = ''
    },
    callback(e) {
      if (e === '' || e === '-1' || e === '0' || e === '1' || e === '2' || e === '3' || e === '4') {
        this.queryParam.authStatus = e
        this.queryParam.financeAuditStatus = ''
      } else if (e === '10') {
        this.queryParam.financeAuditStatus = '1'
        this.queryParam.authStatus = ''
      } else {
        this.queryParam.financeAuditStatus = '3'
        this.queryParam.authStatus = ''
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
    async BindData() {
      userAPI.queryMerAllCategory().then((ret) => {
        this.categoryList = ret.data
      })
    },
    async initTable(params) {
      const { queryParam } = this
      const data = {
        ...params,
        ...queryParam
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
      if (data.authAuditTimes) {
        const [authAuditTimeStartTime, authAuditTimEndTime] = data.authAuditTimes
        data.authAuditTimeStartTime = authAuditTimeStartTime
        data.authAuditTimEndTime = authAuditTimEndTime
      }
      return postSupplier({ ...data })
    }
    // viewEnterprise(id) {
    //   this.$router.push({
    //     path: '/sysManagement/purchasers-audit-detail',
    //     query: {
    //       id: id
    //     }
    //   })
    // }
  }
}
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
.examineButton {
  display: block;
  margin-left: 10px;
  color: #ff6b00;
  &:hover {
    cursor: pointer;
  }
}
</style>

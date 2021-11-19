<template>
  <div class="authorizationAudit">
    <div>
      <a-card :bordered="false">
        <a-form-model layout="inline" ref="ruleForm" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row :gutter="48" class="query">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="公司名称">
                <a-select
                  style="width: 210px"
                  v-model="query.merchantName"
                  show-search
                  :allowClear="true"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  @search="handleSearch"
                  placeholder="请选择付款单位"
                  :getPopupContainer="
                    (triggerNode) => {
                      return triggerNode.parentNode || document.body
                    }
                  "
                >
                  <a-select-option v-for="item in searchMerchantLis" :key="item.value" :value="item.payname">{{
                    item.payname
                  }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="换绑手机号">
                <a-input v-model="query.changePhone" placeholder="请输入手机号" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="创建时间">
                <a-range-picker v-model="query.time" :key="dataKey" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="24" :sm="24" class="button">
              <a-button @click="handleReset">重置</a-button>
              <a-button type="primary" @click="search">查询</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </a-card>
    </div>
    <div class="bottom">
      <div>
        <a-tabs default-active-key="0" @change="callback">
          <a-tab-pane key="0" :tab="'全部(' + statusNumObj.auditAll + ')'"></a-tab-pane>
          <a-tab-pane key="1" :tab="'待审核(' + statusNumObj.auditOne + ')'"></a-tab-pane>
          <a-tab-pane key="2" :tab="'审核通过' + statusNumObj.auditTwo + ')'"></a-tab-pane>
          <a-tab-pane key="3" :tab="'审核拒绝(' + statusNumObj.auditThree + ')'"></a-tab-pane>
        </a-tabs>
      </div>
      <s-table
        rowKey="id"
        name="authorizationAuditTable"
        ref="table"
        :columns="columns"
        :scroll="{ x: 2000 }"
        :data="init"
      >
        <template slot="active" slot-scope="text">
          <span class="examine" @click="examine(text.id)" v-show="text.auditStatus == 1">审核</span>
        </template>
        <template slot="createTime" slot-scope="text">
          <span>{{ text.createTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
        <template slot="auditReason" slot-scope="text">
          <span>{{ text.auditReason }}</span>
        </template>
        <template slot="authorizationUrl" slot-scope="text">
          <ImagePreview
            v-if="text.authorizationUrl.substring(text.authorizationUrl.length - 3) !== 'pdf'"
            :value="text.authorizationUrl"
          />
          <span v-else class="examine" @click="downloadByURL(text.authorizationUrl)">点击下载授权文档</span>
        </template>
        <template slot="auditStatus" slot-scope="text">
          <span v-show="text.auditStatus == 1">待审核</span>
          <span v-show="text.auditStatus == 2">审核通过</span>
          <span v-show="text.auditStatus == 3">审核拒绝</span>
        </template>
      </s-table>
    </div>
    <Popup :popupStatus.sync="popupStatus" @submitExamine="submitExamine" />
  </div>
</template>
<script>
import Popup from '@/components/Popup/ExaminePopup'
import { ImagePreview } from '@/components/'
import _ from 'loadsh'
import { performanceList } from '@/api/PlatformMarginList'
import { authorizationAuditList, authorizationAuditStatus, authorizationAuditStatusNum } from '@/api/fince.js'
export default {
  components: {
    Popup,
    ImagePreview
  },
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
      query: {
        merchantName: [],
        changePhone: null,
        startTime: null,
        endTime: null,
        auditStatus: 0,
        time: null
      },
      id: '',
      searchMerchantLis: [],
      statusNumObj: { auditAll: 0, auditOne: 0, auditTwo: 0, auditThree: 0 },
      dataKey: 1,
      popupStatus: false,
      columns: [],
      columns1: [
        {
          title: '公司名称',
          key: 'merchantName',
          dataIndex: 'merchantName'
        },
        {
          title: '审核状态',
          key: 'auditStatus',
          scopedSlots: { customRender: 'auditStatus' }
        },
        {
          title: '换绑手机号',
          key: 'changePhone',
          dataIndex: 'changePhone'
        },
        {
          title: '换绑授权',
          key: 'authorizationUrl',
          scopedSlots: { customRender: 'authorizationUrl' }
        },
        {
          title: '创建人',
          key: 'createUsername',
          dataIndex: 'createUsername'
        },
        {
          title: '创建时间',
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          key: 'action',
          scopedSlots: { customRender: 'active' }
        }
      ],
      columns2: [
        {
          title: '公司名称',
          key: 'merchantName',
          dataIndex: 'merchantName'
        },
        {
          title: '审核状态',
          key: 'auditStatus',
          scopedSlots: { customRender: 'auditStatus' }
        },
        {
          title: '换绑手机号',
          key: 'changePhone',
          dataIndex: 'changePhone'
        },
        {
          title: '换绑授权',
          key: 'authorizationUrl',
          scopedSlots: { customRender: 'authorizationUrl' }
        },
        {
          title: '创建人',
          key: 'createUsername',
          dataIndex: 'createUsername'
        },
        {
          title: '创建时间',
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        }
      ],
      columns3: [
        {
          title: '公司名称',
          key: 'merchantName',
          dataIndex: 'merchantName'
        },
        {
          title: '审核状态',
          key: 'auditStatus',
          scopedSlots: { customRender: 'auditStatus' }
        },
        {
          title: '换绑手机号',
          key: 'changePhone',
          dataIndex: 'changePhone'
        },
        {
          title: '换绑授权',
          key: 'authorizationUrl',
          scopedSlots: { customRender: 'authorizationUrl' }
        },
        {
          title: '创建人',
          key: 'createUsername',
          dataIndex: 'createUsername'
        },
        {
          title: '创建时间',
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '驳回原因',
          key: 'auditReason',
          scopedSlots: { customRender: 'auditReason' }
        }
      ]
    }
  },
  mounted() {
    this.columns = this.columns1
    performanceList({ currentPage: 1, itemsPerPage: 10 }).then((res) => {
      if (res.code === '0') {
        this.searchMerchantLis = res.data.listObj
      }
    })
  },
  methods: {
    handleSearch(merchantName) {
      if (!merchantName.trim()) return
      _.debounce(async () => {
        const res = await performanceList({ merchantName, currentPage: 1, itemsPerPage: 10 })
        if (res.code === '0') {
          this.searchMerchantLis = res?.data?.listObj
        }
      }, 1000)()
    },
    async init(params) {
      authorizationAuditStatusNum().then((res) => {
        if (res.code === '0') {
          this.statusNumObj = res.data
        }
      })
      const data = {
        ...this.query,
        ...params
      }
      if (typeof data.merchantName === 'object') {
        data.merchantName = ''
      }
      if (data.time) {
        const [beginTime, endTime] = data.time
        data.startTime = beginTime
        data.endTime = endTime
      }
      return authorizationAuditList({ ...data })
    },
    handleReset() {
      this.query = {
        merchantName: [],
        changePhone: null,
        startTime: null,
        endTime: null,
        auditStatus: 0,
        time: null
      }
    },
    search() {
      this.$refs.table.refresh(true)
    },
    submitExamine(auditStatus, auditReason) {
      if (auditStatus === 1) {
        auditStatus = 2
      } else {
        auditStatus = 3
      }
      const params = {
        auditStatus: auditStatus,
        auditReason: auditReason,
        id: this.id
      }
      authorizationAuditStatus(params).then((res) => {
        if (res.code === '0') {
          this.search()
        }
      })
    },
    callback(v) {
      this.query.auditStatus = v
      if (v === '2') {
        this.columns = this.columns2
      } else if (v === '3') {
        this.columns = this.columns3
      } else if (v === '0' || v === '1') {
        this.columns = this.columns1
      }
      this.search()
    },
    examine(id) {
      this.id = id
      this.popupStatus = true
    },
    async downloadByURL(url) {
      const response = await fetch(url)
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = name
      a.click()
      a.remove()
    }
  }
}
</script>
<style lang="less" scoped>
.authorizationAudit {
  width: 100%;
}
.button {
  text-align: center;
}
.query {
  padding-bottom: 20px;
}
.bottom {
  background: #ffffff;
  margin-top: 20px;
}
.approvalButton {
  cursor: pointer;
  color: #ff6b00;
}
.export {
  margin-bottom: 15px;
  margin-left: 10px;
}
.examine {
  cursor: pointer;
  color: #ff6b00;
}
</style>

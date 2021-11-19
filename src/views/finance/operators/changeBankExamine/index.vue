<template>
  <div class="changeBankExamine">
    <a-card :bordered="false">
      <a-form-model layout="inline" ref="form" :model="queryParam">
        <a-row :gutter="48">
          <a-col :md="8">
            <a-form-model-item label="公司名称" prop="merchantName">
              <a-select
                v-if="!isRelaunch"
                class="inp"
                v-model="queryParam.merchantName"
                show-search
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                @search="handleSearch"
                placeholder="请输入付款款单位"
                :allowClear="true"
                :getPopupContainer="
                  (triggerNode) => {
                    return triggerNode.parentNode || document.body
                  }
                "
              >
                <a-select-option v-for="item in comList" :key="item.merchantId" :value="item.merchantName">
                  {{ item.merchantName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="8">
            <a-form-model-item label="换绑银行卡" prop="paymentCard">
              <a-input v-model="queryParam.paymentCard" placeholder="请输入银行卡卡号" />
            </a-form-model-item>
          </a-col>
          <a-col :md="8">
            <a-form-model-item label="创建时间" prop="createTime">
              <a-range-picker class="inp" v-model="queryParam.createTime" />
            </a-form-model-item>
          </a-col>
          <a-col :md="24">
            <div class="button">
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
              <a-button type="primary" style="margin-left: 20px" @click="search">查询</a-button>
            </div>
          </a-col>
        </a-row>
      </a-form-model>
    </a-card>
    <a-card>
      <a-tabs default-active-key="0" @change="callback">
        <a-tab-pane key="0" :tab="'全部(' + number.total + ')'"></a-tab-pane>
        <a-tab-pane key="1" :tab="'待审批(' + number[1] + ')'"></a-tab-pane>
        <a-tab-pane key="2" :tab="'审核通过(' + number[2] + ')'"></a-tab-pane>
        <a-tab-pane key="3" :tab="'审核拒绝(' + number[3] + ')'"></a-tab-pane>
      </a-tabs>
      <s-table name="dataDictionary" ref="table" :scroll="{ x: 2000 }" rowKey="id" :data="init" :columns="columns">
        <template slot="createTime" slot-scope="text">
          {{ text.createTime | moment('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-slot:auditStatus="text">
          <span v-show="text.auditStatus === 1">待审核</span>
          <span v-show="text.auditStatus === 2">审核通过</span>
          <span v-show="text.auditStatus === 3">审核失败</span>
        </template>
        <template slot="action" slot-scope="text">
          <span class="cursor" v-if="text.auditStatus === 1" @click="examine(text.id)">审核</span>
        </template>
        <template slot="authorizationUrl" slot-scope="text">
          <ImagePreview
            v-if="text.authorizationUrl.substring(text.authorizationUrl.length - 3) !== 'pdf'"
            :value="text.authorizationUrl"
          />
          <span v-else class="cursor" @click="downloadByURL(text.authorizationUrl)">点击下载授权文档</span>
        </template>
      </s-table>
    </a-card>
    <Examin :popupStatus.sync="popupStatus" @submitExamine="submitExamine" />
    <!-- <button @click="popupStatus = true">还是说</button> -->
  </div>
</template>
<script>
import { queryCompanyName, changeBankExaminelist, changeBankExamine } from '@/api/fince'
import { ImagePreview } from '@/components/'
import Examin from '@/components/Popup/ExaminePopup'
import _ from 'loadsh'
export default {
  components: {
    Examin,
    ImagePreview
  },
  data() {
    return {
      popupStatus: false,
      queryParam: {
        merchantName: [],
        paymentCard: '',
        createTime: null,
        auditStatus: 0
      },
      id: '',
      number: {
        total: 0,
        1: 0,
        2: 0,
        3: 0
      },
      isRelaunch: false,
      comList: [],
      columns: [
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
          title: '银行账号',
          key: 'paymentCard',
          dataIndex: 'paymentCard'
        },
        {
          title: '支行',
          key: 'openBankName',
          dataIndex: 'openBankName'
        },
        {
          title: '开户名称',
          key: 'bankAccountName',
          dataIndex: 'bankAccountName'
        },
        {
          title: '支行联行号',
          key: 'openBankNo',
          dataIndex: 'openBankNo'
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
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  created() {
    queryCompanyName({ likeName: '' }).then((res) => {
      if (res.code === '0') {
        this.comList = new Set(res.data)
      }
    })
  },
  methods: {
    async init(params) {
      console.log(1111)
      const data = {
        ...params,
        ...this.queryParam,
        beginTime: '',
        endTime: ''
      }
      if (data.createTime) {
        const [beginTime, endTime] = data.createTime
        data.beginTime = beginTime
        data.endTime = endTime
      }
      if (typeof data.merchantName === 'object') {
        data.merchantName = ''
      }
      delete data.createTime
      const res = changeBankExaminelist({ ...data })
      res.then((res) => {
        if (res.code === '0') {
          this.number.total = res.data.total
          this.$set(this.number, 'total', res.data.total)
          this.$set(this.number, 1, res.data.billStatusCount[0].number)
          this.$set(this.number, 2, res.data.billStatusCount[1].number)
          this.$set(this.number, 3, res.data.billStatusCount[2].number)
        }
      })
      return res
    },
    submitExamine(Status, auditReason) {
      const auditStatus = Status === 2 ? 3 : 2
      changeBankExamine({ auditStatus, auditReason, id: this.id }).then((res) => {
        if (res.code !== '0') {
        } else {
          this.search()
        }
      })
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
    },
    reset() {
      this.$refs.form.resetFields()
      this.search()
    },
    search() {
      this.$refs.table.refresh(true)
    },
    callback(v) {
      this.queryParam.auditStatus = v
      this.search()
    },
    handleSearch(settleObjName) {
      if (!settleObjName.trim()) return
      _.debounce(async () => {
        const res = await queryCompanyName({ likeName: settleObjName })
        if (res.code === '0') {
          this.comList = res?.data
        }
      }, 1000)()
    }
  }
}
</script>
<style lang="less" scoped>
.changeBankExamine {
  .inp {
    width: 200px;
  }
}
.button {
  text-align: center;
  padding-top: 20px;
}
.cursor {
  color: #ff6b00;
  cursor: pointer;
}
</style>

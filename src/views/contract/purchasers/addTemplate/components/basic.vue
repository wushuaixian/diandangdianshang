<template>
  <div class="box" v-if="form !== null">
    <header-title class="header-title">
      <span>基础信息</span>
    </header-title>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model
          ref="templateForm"
          layout="inline"
          :model="form"
          :rules="rules"
          :label-col="{ span: 20 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="公司名称" prop="merchantId">
                <a-select
                  v-if="$store.state.permission.isPlatform === 1"
                  allowClear
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  show-search
                  placeholder="请输入公司名称查询"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="fetching ? undefined : null"
                  @search="handleSearch"
                  v-model="form.merchantId"
                  @change="handleChangeCom"
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option v-for="item in comList" :key="item.orgName" :value="item.id">
                    {{ item.orgName }}
                  </a-select-option>
                </a-select>
                <a-select
                  v-else
                  v-model="form.merchantId"
                  placeholder="请选择公司"
                  @change="handleChangeCom"
                  option-filter-prop="children"
                  :disabled="$route.query.id && !$route.query.copy"
                  showSearch
                >
                  <a-select-option v-for="item in comList" :key="item.id" :name="item.orgName" :value="item.id">
                    {{ item.orgName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-model-item label="模板类型" prop="templateType">
                <a-select
                  v-model="form.templateType"
                  placeholder="请选择模板类型"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                >
                  <a-select-option :value="1">购销合同</a-select-option>
                  <a-select-option :value="2">服务合同</a-select-option>
                  <a-select-option :value="3">工程合同</a-select-option>
                  <a-select-option :value="4">其他合同</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="模板编码" prop="code">
                <a-input v-model="form.code" placeholder="请填写模板编码" :disabled="true" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="模板名称" prop="name">
                <a-input v-model="form.name" :maxLength="50" placeholder="请填写模板名称" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="备注">
                <a-input v-model="form.remark" :maxLength="100" placeholder="请填写备注" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
  </div>
</template>

<script>
import * as api from '@/api/contract'
const rules = {
  merchantId: [{ required: true, message: '请选择公司', trigger: 'change' }],
  merchantName: [{ required: true, message: '请选择公司', trigger: 'change' }],
  templateType: [{ required: true, message: '请选择模板类型', trigger: 'change' }],
  name: [{ required: true, message: '请填写模板名称', trigger: 'blur' }],
  code: [{ required: true, message: '请填写模板编码', trigger: 'blur' }]
}
let timeout
export default {
  props: {
    form: {
      type: Object,
      default: null
    },
    templateSource: {
      type: Number,
      default: 3
    },
    platformId: {
      type: Number,
      default: 7
    }
  },
  watch: {
    'form.merchantName': function (val) {
      this.BindCom(val)
    }
  },
  created() {
    this.BindCom()
    if (!this.$route.query?.id || String(this.$route.query?.copy) === 'true') {
      this.BindCode()
    }
  },
  data() {
    return {
      rules,
      fetching: false,
      comList: []
    }
  },
  methods: {
    async BindCom(value) {
      if (this.$store.state.permission.isPlatform === 1) {
        if (value) {
          const res = await api.getPlatComList(this.platformId, this.templateSource, value || '')
          if (res.code === '0') {
            this.comList = this.platformId === 6 ? res.data.providerMerchantList : res.data.buyerMerchantList
            if (this.comList?.length > 0 && !this.$route.query.id) {
              this.form.merchantId = this.comList[0].id
              this.form.merchantName = this.comList[0].orgName
            }
          }
        }
      } else {
        const res = await api.getComList(this.platformId)
        if (res.code === '0') {
          this.comList = this.platformId === 6 ? res.data.providerMerchantList : res.data.buyerMerchantList
          if (this.comList?.length > 0 && !this.$route.query.id) {
            this.form.merchantId = this.comList[0].id
            this.form.merchantName = this.comList[0].orgName
          }
        }
      }
    },
    async BindCode() {
      const res = await api.getTemplateCode(this.templateSource)
      if (res.code === '0') {
        this.form.code = res.data
      }
    },
    handleSearch(value) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      this.fetching = true
      this.comList = []
      timeout = setTimeout(() => {
        api.getPlatComList(this.platformId, this.templateSource, value).then((res) => {
          if (res.code === '0') {
            this.comList = this.platformId === 6 ? res.data.providerMerchantList : res.data.buyerMerchantList
          }
        })
      }, 300)
    },
    handleChangeCom(v1, v2) {
      this.form.merchantId = v1
      this.form.merchantName = v2.data.attrs.name
    }
  }
}
</script>

<style>
</style>

<template>
  <div class="the-busiiness">
    <header-title>
      <span>工商信息</span>
    </header-title>
    <a-form-model
      :label-col="{ span: 5 }"
      ref="DetailForm"
      :wrapper-col="{ span: 16 }"
      :rules="rules"
      :model="ruleForm"
      hideRequiredMark
    >
      <a-form-model-item label="企业性质" class="textareaBottomSpacin" has-feedback prop="enterpriseNature">
        <a-input disabled :value="ruleForm.enterpriseNature == 1 ? '生产商' : '贸易商'" />
      </a-form-model-item>
      <a-form-model-item label="企业名称" has-feedback prop="enterpriseName">
        <a-input disabled v-model="ruleForm.enterpriseName" />
      </a-form-model-item>
      <a-form-model-item label="管理员手机号" has-feedback>
        <a-input disabled v-model="ruleForm.registerMobile" />
      </a-form-model-item>
      <a-form-model-item label="统一社会信用代码" has-feedback prop="businessLicenceNo">
        <a-input disabled v-model="ruleForm.businessLicenceNo" />
      </a-form-model-item>
      <a-form-model-item label="成立日期" has-feedback prop="businessLicencePeriodBegin">
        <a-input disabled v-model="ruleForm.businessLicencePeriodBegin" />
      </a-form-model-item>
      <a-form-model-item label="截止日期" has-feedback prop="businessLicencePeriodEnd">
        <a-input disabled v-model="ruleForm.businessLicencePeriodEnd" />
      </a-form-model-item>
      <a-form-model-item label="公司类型" has-feedback prop="enterpriseType">
        <a-input disabled v-model="ruleForm.enterpriseType" />
      </a-form-model-item>
      <a-form-model-item label="法定代表人" has-feedback prop="legalPersonName">
        <a-input disabled v-model="ruleForm.legalPersonName" />
      </a-form-model-item>
      <a-form-model-item label="注册资金" has-feedback prop="registeredCapital">
        <a-input disabled v-model="ruleForm.registeredCapital" />
      </a-form-model-item>
      <a-form-model-item label="注册币种" has-feedback prop="currency">
        <a-input disabled v-model="ruleForm.currency" />
      </a-form-model-item>
      <a-form-model-item label="经营范围" has-feedback prop="businessScope">
        <a-textarea disabled :auto-size="{ minRows: 2, maxRows: 5 }" v-model="ruleForm.businessScope" />
      </a-form-model-item>
      <a-form-model-item label="注册地" class="textareaBottomSpacin" has-feedback prop="registrationSplicing">
        <a-input disabled v-model="ruleForm.registrationSplicing" />
      </a-form-model-item>
      <a-form-model-item label="详细地址" has-feedback prop="registeredDetailAddress">
        <a-textarea disabled :auto-size="{ minRows: 2, maxRows: 5 }" v-model="ruleForm.registeredDetailAddress" />
      </a-form-model-item>
      <a-form-model-item label="主营品类" class="textareaBottomSpacin" has-feedback>
        <a-input disabled v-model="ruleForm.name" />
      </a-form-model-item>
      <a-form-model-item label="授权委托书">
        <ImagePreview :width="80" :height="80" :value="[ruleForm.powerOfAttorneyUrl]" />
      </a-form-model-item>
      <a-form-model-item label="营业执照" class="imgTopSpacin">
        <ImagePreview :width="80" :height="80" :value="[ruleForm.businessLicenceUrl]" />
      </a-form-model-item>
    </a-form-model>
    <fixed-box>
      <a-button @click="handleCancel">关闭</a-button>
      <a-button type="primary" v-if="$$(data1, 'auditStatus') === '0'" @click="popupStatus = true">审核</a-button>
    </fixed-box>
    <Popup :popupStatus.sync="popupStatus" @close="popupStatus = false" @submitExamine="submitExamine" />
  </div>
</template>
<script>
import { ImagePreview } from '@/components/'
import { ExamineDetails, submitExamine } from '@/api/accessAudit'
import Popup from '@/components/Popup/ExaminePopup'
import moment from 'moment'
export default {
  components: { ImagePreview, Popup },
  props: {},
  data() {
    return {
      popupStatus: false,
      registrationSplicing2: '',
      data1: {},
      data2: {},
      rules: {
        enterpriseNature: {
          required: true,
          validator: (rule, value, callback) => {
            callback()
          }
        },
        enterpriseName: {
          required: true,
          validator: (rule, value, callback) => {
            if (this.ruleForm.enterpriseName !== this.data2?.enterpriseName) {
              callback(new Error(this.data2?.enterpriseName))
            } else {
              callback()
            }
          }
        },
        businessLicenceNo: {
          required: true,
          validator: (rule, value, callback) => {
            if (this.ruleForm.businessLicenceNo !== this.data2?.businessLicenceNo) {
              callback(new Error(this.data2?.businessLicenceNo))
            } else {
              callback()
            }
          }
        },
        businessLicencePeriodBegin: {
          required: true,
          validator: (rule, value, callback) => {
            if (!this.data2?.businessLicencePeriodBegin) {
              callback()
            }
            if (this.ruleForm.businessLicencePeriodBegin !== this.data2?.businessLicencePeriodBegin) {
              console.log(this.data2?.businessLicencePeriodBegin)
              callback(new Error(this.data2?.businessLicencePeriodBegin))
            } else {
              callback()
            }
          }
        },
        businessLicencePeriodEnd: {
          required: true,
          validator: (rule, value, callback) => {
            if (this.ruleForm.businessLicencePeriodEnd !== this.data2?.businessLicencePeriodEnd) {
              callback(new Error(moment(this.data2?.businessLicencePeriodEnd).format('YYYY-MM-DD HH:mm')))
            } else {
              callback()
            }
          }
        },
        enterpriseType: {
          required: true,
          validator: (rule, value, callback) => {
            if (this.ruleForm.enterpriseType !== this.data2?.enterpriseType) {
              callback(new Error(this.data2?.enterpriseType))
            } else {
              callback()
            }
          }
        },
        legalPersonName: {
          required: true,
          validator: (rule, value, callback) => {
            if (this.ruleForm.legalPersonName !== this.data2?.legalPersonName) {
              callback(new Error(this.data2?.legalPersonName))
            } else {
              callback()
            }
          }
        },
        registeredCapital: {
          required: true,
          validator: (rule, value, callback) => {
            if (this.ruleForm.registeredCapital !== this.data2?.registeredCapital) {
              callback(new Error(this.data2?.registeredCapital))
            } else {
              callback()
            }
          }
        },
        currency: {
          required: true,
          validator: (rule, value, callback) => {
            if (this.ruleForm.currency !== this.data2?.currency) {
              callback(new Error(this.data2?.currency))
            } else {
              callback()
            }
          }
        },
        businessScope: {
          required: true,
          validator: (rule, value, callback) => {
            if (this.ruleForm.businessScope !== this.data2?.businessScope) {
              callback(new Error(this.data2?.businessScope))
            } else {
              callback()
            }
          }
        },
        registrationSplicing: {
          required: true,
          validator: (rule, value, callback) => {
            if (!this.registrationSplicing2 || !value) return callback(new Error(null))
            if (this.ruleForm.registrationSplicing !== this.registrationSplicing2) {
              callback(new Error(this.registrationSplicing2))
            } else {
              callback()
            }
          }
        },
        name: {
          required: true,
          validator: (rule, value, callback) => {
            if (this.ruleForm.name !== this.data2?.name) {
              callback(new Error(this.data2?.name))
            } else {
              callback()
            }
          }
        },
        registeredDetailAddress: {
          required: true,
          validator: (rule, value, callback) => {
            if (this.ruleForm.registeredDetailAddress !== this.data2.registeredDetailAddress) {
              callback(new Error(this.data2.registeredDetailAddress))
            } else {
              callback()
            }
          }
        }
      },
      ruleForm: {
        enterpriseName: '',
        businessLicenceNo: '',
        businessLicencePeriodBegin: '',
        businessLicencePeriodEnd: '',
        enterpriseType: '',
        legalPersonName: '',
        registeredCapital: '',
        currency: '',
        businessScope: '',
        // registeredCityName: '',
        registeredDetailAddress: '',
        powerOfAttorneyUrl: '',
        businessLicenceUrl: '',
        enterpriseNature: null,
        name: null
      }
    }
  },
  methods: {
    handleCancel() {
      this.$router.go(-1)
    },
    onSubmit() {
      this.$router.go(-1)
    },
    async submitExamine(auditStatus, auditReason) {
      const ids = [this.$route.query?.id]
      const res = await submitExamine({ ids, auditStatus, auditReason })
      if (res.success) {
        this.$message.success('审核成功')
        this.popupStatus = false
        this.$router.go(-1)
      }
    },
    ExamineDetails() {
      const that = this
      ExamineDetails({ orgId: this.$route.query.id }).then((res) => {
        that.data1 = res.data[0]
        that.ruleForm.enterpriseName = this.data1.enterpriseName
        that.data2 = res.data[1]
        this.ruleForm = { ...that.data1 }
        this.ruleForm.registrationSplicing =
          that.data1.registeredProvinceName + that.data1.registeredCityName + that.data1.registeredRegionName
        this.registrationSplicing2 = `${that.data2?.registeredProvinceName || ''}${
          that.data2?.registeredCityName || ''
        }${that.data2?.registeredRegionName || ''}`
        that.$refs.DetailForm.validate()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.the-busiiness {
  .ant-form {
    margin-top: 20px;
  }
}
</style>

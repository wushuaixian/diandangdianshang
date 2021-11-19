<template>
  <div class="auditDetailsOut">
    <!-- <div class="auditDetails">
      <div class="title">
        <div class="title_block"></div>
        <div class="title_text">审核详情页</div>
      </div>
      <div class="line"></div>
    </div> -->
    <a-card>
      <header-title>
        <span>审核详情页</span>
      </header-title>
      <a-form-model
        :label-col="{ span: 5 }"
        ref="DetailForm"
        :wrapper-col="{ span: 16 }"
        :rules="rules"
        :model="ruleForm"
        hideRequiredMark
      >
        <a-form-model-item label="企业名称" has-feedback prop="enterpriseName">
          <a-input v-model="ruleForm.enterpriseName" class="inp" />
        </a-form-model-item>
        <a-form-model-item label="管理员手机号" has-feedback>
          <a-input v-model="ruleForm.registerMobile" class="inp" />
        </a-form-model-item>
        <a-form-model-item label="统一社会信用代码" has-feedback prop="businessLicenceNo">
          <a-input v-model="ruleForm.businessLicenceNo" class="inp" />
        </a-form-model-item>
        <a-form-model-item label="成立日期" has-feedback prop="businessLicencePeriodBegin">
          <a-input class="inp" v-model="ruleForm.businessLicencePeriodBegin" />
        </a-form-model-item>
        <a-form-model-item label="截止日期" has-feedback prop="businessLicencePeriodEnd">
          <a-input class="inp" v-model="ruleForm.businessLicencePeriodEnd" />
        </a-form-model-item>
        <a-form-model-item label="公司类型" has-feedback prop="enterpriseType">
          <a-input class="inp" v-model="ruleForm.enterpriseType" />
        </a-form-model-item>
        <a-form-model-item label="法定代表人" has-feedback prop="legalPersonName">
          <a-input class="inp" v-model="ruleForm.legalPersonName" />
        </a-form-model-item>
        <a-form-model-item label="注册资金" has-feedback prop="registeredCapital">
          <a-input class="inp" v-model="ruleForm.registeredCapital" />
        </a-form-model-item>
        <a-form-model-item label="注册币种" has-feedback prop="currency">
          <a-input class="inp" v-model="ruleForm.currency" />
        </a-form-model-item>
        <a-form-model-item label="经营范围" has-feedback prop="businessScope">
          <a-textarea :auto-size="{ minRows: 2, maxRows: 5 }" class="inp" v-model="ruleForm.businessScope" />
        </a-form-model-item>
        <a-form-model-item label="注册地" class="textareaBottomSpacin" has-feedback prop="registrationSplicing">
          <a-input class="inp" v-model="ruleForm.registrationSplicing" />
        </a-form-model-item>
        <a-form-model-item label="详细地址" has-feedback prop="registeredDetailAddress">
          <a-textarea class="inp" :auto-size="{ minRows: 2, maxRows: 5 }" v-model="ruleForm.registeredDetailAddress" />
        </a-form-model-item>
        <a-form-model-item label="授权委托书">
          <ImagePreview :width="80" :height="80" :value="[ruleForm.powerOfAttorneyUrl]" />
        </a-form-model-item>
        <a-form-model-item label="营业执照" class="imgTopSpacin">
          <ImagePreview :width="80" :height="80" :value="[ruleForm.businessLicenceUrl]" />
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <!-- <div class="footer">
      <a-button class="footerButton" onClick="onSubmit">关闭</a-button>
      <a-button style="margin-left: 10px" class="footerButton footerAuditButton" @click="popupStatus = true"
        >审核</a-button
      >
    </div> -->
    <fixed-box>
      <a-button onClick="onSubmit" @click="handleCancel">关闭</a-button>
      <a-button type="primary" v-if="$$(data1, 'auditStatus') === '0'" @click="popupStatus = true">审核</a-button>
    </fixed-box>
    <Popup :popupStatus.sync="popupStatus" @submitExamine="submitExamine" />
  </div>
</template>
<script>
// import AccessAuditPopup from "./AccessAuditPopup"
import Popup from '@/components/Popup/ExaminePopup'
import ImagePreview from '@/components/ImagePreview/'
import { ExamineDetails, submitExamine } from '@/api/accessAudit.js'
// import Popup from './Popup'
export default {
  components: {
    ImagePreview,
    Popup
  },
  data() {
    return {
      popupStatus: false,
      registrationSplicing2: '',
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
        businessLicenceUrl: ''
      },
      data1: {},
      data2: {},
      rules: {
        enterpriseName: {
          required: true,
          validator: (rule, value, callback) => {
            console.log(this.ruleForm.enterpriseName, this.data2.enterpriseName)
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
            if (this.ruleForm.businessLicencePeriodBegin !== this.data2?.businessLicencePeriodBegin) {
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
              callback(new Error(this.data2?.businessLicencePeriodEnd))
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
            if (!this.registrationSplicing2 || !value) return callback(null)
            if (this.ruleForm.registrationSplicing !== this.registrationSplicing2) {
              callback(new Error(this.registrationSplicing2))
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
      }
    }
  },
  mounted() {
    this.ExamineDetails()
  },
  methods: {
    handleCancel() {
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
.auditDetails {
  width: 100%;
  height: 1000px;
  background: #ffffff;
  border-radius: 8px;
  padding-top: 24px;
  padding-left: 24px;
  .title {
    width: 100%;
    height: 20px;
    margin-bottom: 8px;
    position: relative;

    .title_block {
      width: 4px;
      height: 16px;
      background-image: linear-gradient(#ff8720, #ff6241);
      display: inline-block;
    }
    .title_text {
      display: inline-block;
      font-size: 16px;
      position: absolute;
      margin-top: -4px;
      margin-left: 8px;
    }
  }
  .line {
    width: 962px;
    border-bottom: 1px solid #e5e5e5;
    margin-bottom: 25px;
  }
  img {
    width: 80px;
    height: 80px;
  }
  .ant-form-explain,
  .ant-form-extra {
    font-size: 12px !important;
  }
  .ant-form-item {
    margin-top: -7px;
  }
  .ant-col-16 {
    height: 50px;
  }
  .textareaBottomSpacin {
    margin-top: 21px;
  }
}
.inp {
  background: #f5f5f5 !important;
  width: 436px;
  border-color: #d9d9d9;
}
.footer {
  width: 100%;
  height: 64px;
  background: #ffffff;
  box-shadow: 0 0 6px 0 rgba(154, 170, 180, 0.2);
  margin-top: 20px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 12px 0;
  text-align: center;
  .footerButton {
    width: 128px;
    height: 40px;
  }
  .footerAuditButton {
    background-image: linear-gradient(-270deg, #ff8720 0%, #ff6241 100%);
    border-radius: 2px;
    color: #ffffff;
    border: none;
  }
  .footerAuditButton:hover {
    color: #ffffff;
  }
}
</style>
<style>
.auditDetailsOut .auditDetails .ant-form-explain {
  color: #ff6b00 !important;
  font-size: 12px;
}
.ant-layout-footer {
  padding: 0;
}
</style>

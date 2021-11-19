<template>
  <div class="step2">
    <a-form-model ref="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
      <a-form-model-item label="企业性质" v-if="form.userRole !== 2">
        <a-radio-group
          v-model="form.enterpriseNature"
          :options="[
            { label: '生产商', value: 1 },
            { label: '贸易商', value: 2 }
          ]"
        >
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="企业名称" required>
        <a-select
          class="selsct-font"
          allowClear
          :getPopupContainer="(triggerNode) => triggerNode.parentNode"
          size="large"
          show-search
          :value="form.comName"
          placeholder="请输入企业名称进行查询"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          @search="handleSearch"
          @change="handleChange"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="d in comList" :key="d.companyName">
            {{ d.companyName }}
          </a-select-option>
        </a-select>
        <div style="color: red" v-show="showCompany">企业名称已注册请重新选择</div>
      </a-form-model-item>
      <a-form-model-item label="主营品类" v-if="form.userRole !== 2" required>
        <tree-select
          :collapseTags="false"
          :normalizer="normalizer"
          :options="categoryList"
          v-model="form.categoryId"
        ></tree-select>
        <!-- <a-select size="large" v-model="form.categoryId" placeholder="请选择">
          <a-select-option v-for="item in categoryList" :key="item.id" :value="item.id">{{
            item.name
          }}</a-select-option>
        </a-select> -->
        <div class="tips">备注：其他经营品类在左侧菜单"企业信息管理—经营品类”中完善，该信息会影响平台对您的推荐</div>
      </a-form-model-item>
      <a-form-model-item label="营业执照" required>
        <div class="content">
          <s-upload
            v-model="form.businessLicenceUrl"
            @change="getComDetailWithOCR"
            list-type="picture-card"
            :action="uploadUrl"
            name="Filedata"
          >
            <div class="upload" v-show="!form.businessLicenceUrl">
              <div class="plus">
                <a-icon class="icon" type="plus" />
              </div>
              <div class="text">上传图片</div>
            </div>
          </s-upload>
          <div class="message">
            <div class="title">请上传营业执照（副本）原件或盖公章复印件</div>
            <div class="other">文件格式支持：bmp，tiff，jpg，jpeg，png 文件大小不能超过1.5M</div>
          </div>
        </div>
        <div style="color: red" v-show="showOCRError">请上传正确清晰的营业执照</div>
      </a-form-model-item>
      <a-form-model-item label="授权委托书" required>
        <div class="content">
          <s-upload v-model="form.powerOfAttorneyUrl" list-type="picture-card" :action="uploadUrl" name="Filedata">
            <div class="upload" v-show="!form.powerOfAttorneyUrl">
              <div class="plus">
                <a-icon class="icon" type="plus" />
              </div>
              <div class="text">上传图片</div>
            </div>
          </s-upload>
          <div class="message">
            <div class="title">
              《授权委托书模版》
              <a @click="download" download="授权委托书.doc">下载</a>
            </div>
            <div class="other">文件格式支持：bmp，tiff，jpg，jpeg，png 文件大小不能超过1.5M</div>
          </div>
        </div>
      </a-form-model-item>
      <div class="tishi">以上信息会影响平台对您审核时间，请您谨慎维护</div>
      <a-form-model-item :wrapper-col="{ span: 15, offset: 6 }">
        <a-button type="primary" block size="large" html-type="submit" :loading="isSaving" @click="Save">
          提交
        </a-button>
      </a-form-model-item>
    </a-form-model>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import * as userAPI from '@/api/user.js'
import * as api from '@/api/configgurationCenter/operatedConfigure/platformTerms/template.js'
import md5 from 'md5'
import cookie from '@/utils/cookie'
import { mapActions } from 'vuex'
let timeout
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
export default {
  created() {
    this.form.username = this.$store.state.register.registerForm.username
    this.form.mobile = this.$store.state.register.registerForm.mobile
    this.form.password = this.$store.state.register.registerForm.password
    this.form.secPassword = this.$store.state.register.registerForm.secPassword
    this.form.userRole = this.$store.state.register.registerForm.userRole
    this.form.captchas = this.$store.state.register.registerForm.captchas
    this.form.inviteCode = this.$store.state.register.registerForm.inviteCode
    this.BindData()
  },
  data() {
    return {
      uploadUrl: process.env.VUE_APP_UPLOAD_URL,
      previewVisible: false,
      showOCRError: false,
      showCompany: false,
      form: {
        // 以下为第一步所需表单
        username: '',
        mobile: '',
        password: '',
        secPassword: '',
        userRole: 1,
        captchas: '',
        inviteCode: '',
        // 以下为第二步所需表单
        comName: undefined,
        enterpriseNature: 1,
        categoryId: null,
        powerOfAttorneyUrl: '',
        businessLicenceUrl: '',
        // 以下为公司名称识别数据
        legalPersonName: '',
        registeredDetailAddress: '',
        registeredRegionName: '',
        registeredCityName: '',
        registeredProvinceName: '',
        currency: '',
        registeredCapital: '',
        enterpriseType: '',
        businessLicenceRegister: '',
        businessLicencePeriodBegin: '',
        businessLicencePeriodEnd: '',
        businessLicenceNo: '',
        businessScope: '',
        enterpriseName: '',
        // 以下为OCR识别数据
        legalPersonNameOcr: '',
        registeredDetailAddressOcr: '',
        registeredCapitalOcr: '',
        businessLicencePeriodEndOcr: '',
        enterpriseTypeOcr: '',
        businessLicenceRegisterOcr: '',
        businessLicenceNoOcr: '',
        businessScopeOcr: '',
        enterpriseNameOcr: ''
      },
      categoryList: [],
      comList: [],
      fetching: false,
      fileListWithPowerOfAttorneyUrl: [],
      fileListWithBusinessLicenceUrl: [],
      fileList: [],
      previewImage: '',
      isSaving: false,
      normalizer(node) {
        return {
          id: node?.id,
          label: node?.name,
          children: node?.children || undefined,
          isDisabled: node.level !== 2
        }
      }
    }
  },
  props: {
    step1form: {
      default: null,
      type: Object
    }
  },
  watch: {
    'form.businessLicenceUrl'(val) {
      if (!val) {
        this.showOCRError = false
      }
    }
  },
  methods: {
    ...mapActions(['GetUserPlatformList', 'refreshFrontPlatform']),
    Save() {
      console.log(this.form.categoryId)
      if (this.form.userRole !== 2 && !this.form.categoryId) {
        this.$message.info('请选择主营品类')
        return
      }
      if (!this.form.businessLicenceUrl || this.form.businessLicenceUrl === '') {
        this.$message.info('请上传营业执照（副本）原件或盖公章复印件')
        return
      }
      console.log(this.showOCRError)
      if (this.showOCRError) {
        this.$message.info('请重新上传清晰的营业执照')
        return
      }
      if (!this.form.powerOfAttorneyUrl || this.form.powerOfAttorneyUrl === '') {
        this.$message.info('请上传授权委托书')
        return
      }
      if (!this.form.comName) {
        this.$message.info('请搜索选择企业')
        return
      }
      this.form.password = md5(this.form.password)
      this.form.secPassword = md5(this.form.secPassword)
      this.isSaving = true
      userAPI
        .enterpriseRegister(this.form)
        .then(async (ret) => {
          this.isSaving = false
          if (ret.code === '0') {
            cookie.set('ut', ret.ut)
            // 拉取当前用户平台集合
            await this.GetUserPlatformList()
            await this.refreshFrontPlatform()
            this.$parent.index = 2
          } else {
            this.$message.error(ret.message)
          }
        })
        .catch(() => {
          this.isSaving = false
          this.$message.error('注册失败，请重试')
        })
    },
    getComDetailWithName() {
      if (this.form.comName && this.form.comName !== '') {
        userAPI.getBasicInfo(this.form.comName).then((ret) => {
          if (ret.code === '0') {
            if (ret.data.resultCode === 'OK') {
              const data = ret.data.yiDunCompanyBasicInfoResponseDataObject.queryResult
              this.form.legalPersonName = data.legalRepresentative
              this.form.registeredDetailAddress = data.registerPlace
              this.form.registeredRegionName = data.registerCounty
              this.form.registeredCityName = data.registerCity
              this.form.registeredProvinceName = data.registerProvince
              this.form.currency = data.registerCapitalCurrency
              this.form.registeredCapital = data.registerCapitalValue
              this.form.enterpriseType = data.orgType
              this.form.businessLicenceRegister = data.registerDate
              this.form.businessLicencePeriodBegin = data.oprtStartDate
              this.form.businessLicencePeriodEnd = data.oprtEndDate
              this.form.businessLicenceNo = data.ucCode
              this.form.businessScope = data.oprtScope
              this.form.enterpriseName = data.orgName
              this.showCompany = false
            } else {
              this.showCompany = true
              // this.$message.info('识别失败，请重试选择')
            }
          } else {
            this.showCompany = true
            // this.$message.info('识别失败，请重试选择')
          }
        })
      }
    },
    getComDetailWithOCR() {
      if (this.form.businessLicenceUrl !== '') {
        this.isSaving = true
        userAPI
          .ocrBusinessLicense(this.form.businessLicenceUrl)
          .then((ret) => {
            if (ret.code === '0') {
              if (ret.data.statusCode === 200) {
                this.form.legalPersonNameOcr = ret.data.person
                this.form.registeredDetailAddressOcr = ret.data.address
                this.form.registeredCapitalOcr = ret.data.capital
                this.form.businessLicencePeriodEndOcr = ret.data.valid_period
                this.form.enterpriseTypeOcr = ret.data.type
                this.form.businessLicenceRegisterOcr = ret.data.establish_date
                this.form.businessLicenceNoOcr = ret.data.reg_num
                this.form.businessScopeOcr = ret.data.business
                this.form.enterpriseNameOcr = ret.data.name
                this.showOCRError = false
              } else {
                this.showOCRError = true
                // this.$message.info('请上传清晰的营业执照照片')
                // this.addForm.setFields({
                //   businessLicenceUrl: {
                //     errors: new Error('请上传正确清晰的营业执照')
                //   }
                // })
                // this.form.businessLicenceUrl = ''
              }
            } else {
              this.showOCRError = true
              // this.addForm.setFields({
              //   businessLicenceUrl: {
              //     errors: new Error('请上传正确清晰的营业执照')
              //   }
              // })
              // this.$message.info('请上传清晰的营业执照照片')
              // this.form.businessLicenceUrl = ''
            }
          })
          .finally(() => (this.isSaving = false))
      }
    },
    handleCancel() {
      this.previewVisible = false
    },
    async BindData() {
      const res = await userAPI.queryTreeAllCategory()
      if (res.code === '0') {
        this.categoryList = res.data
      }
      // userAPI
      //   .queryTreeAllCategory()
      //   .then((ret) => {
      //     this.categoryList = ret.data
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //   })
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleSearch(value) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      this.fetching = true
      this.comList = []
      timeout = setTimeout(() => {
        userAPI
          .companyQuery(value)
          .then((ret) => {
            this.fetching = false
            this.comList = ret.data.yiDunResponseDataObject.queryResult.items
          })
          .catch(() => {
            this.fetching = false
          })
      }, 300)
    },
    handleChange(value) {
      this.form.comName = value
      this.getComDetailWithName()
    },
    async download() {
      const res = await api.getTemplateDetailWithType(1)
      if (res.code === '0') {
        console.log(res)
        const response = await fetch(res.data.url)
        const blob = await response.blob()
        const objectUrl = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = objectUrl
        const ext = res.data.url.substr(res.data.url.lastIndexOf('.') + 1)
        a.download = `授权委托书.${ext}`
        a.click()
        a.remove()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.step2 {
  .radio {
    font-size: 14px;
    line-height: 18px;
  }

  .tips {
    font-size: 12px;
    color: #999999;
    line-height: 14px;
    margin-top: 6px;
  }

  .checks {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #d8d8d8;
    position: relative;
    transition: all 0.5s ease;
    border-radius: 4px;
    height: 38px;
    width: 111px;

    &.sel {
      background: #fcf0e6;
      color: #fd6901;
      border-color: #fd6901;
    }

    .yes {
      display: block;
      height: 0px;
      width: 0px;
      position: absolute;
      bottom: 0;
      right: 0;
      color: #fff;
      border: 8px solid;
      border-color: transparent #fd6901 #fd6901 transparent;

      .icon {
        position: absolute;
        font-size: 7px;
        font-weight: bold;
        z-index: 1;
      }
    }
  }

  .content {
    display: flex;
    flex-direction: row;

    .upload {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: #ffffff;
      border-radius: 2px;

      .plus {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: rgba(255, 107, 0, 0.1);
        border-radius: 16px;

        .icon {
          font-size: 16px;
          color: #ff6b00;
        }
      }

      .text {
        margin-top: 4px;
        font-size: 12px;
        color: #262626;
        line-height: 16px;
      }
    }

    .message {
      display: flex;
      flex-direction: column;
      margin-left: 10px;
      margin-top: 39px;

      .title {
        font-size: 12px;
        color: #262626;
        line-height: 16px;
      }

      .other {
        font-size: 12px;
        color: #999999;
        line-height: 16px;
        margin-top: 4px;
      }
    }
  }

  .tishi {
    font-size: 12px;
    color: #666666;
    line-height: 16px;
    margin-top: 30px;
    margin-bottom: 10px;
    text-align: center;
    padding-left: 70px;
  }
}
</style>
<style lang="less">
.step2 {
  .ant-upload {
    background: #fff;
  }
  .ant-upload-list-picture .ant-upload-list-item,
  .ant-upload-list-picture-card .ant-upload-list-item {
    padding: 0;
  }
  .ant-upload-picture-card-wrapper {
    width: 112px;
  }
}
.selsct-font {
  font-size: 14px;
}
</style>

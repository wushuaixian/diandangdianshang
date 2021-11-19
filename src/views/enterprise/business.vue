<template>
  <div>
    <Tabtitle :titleName="titleName"></Tabtitle>
    <div class="busContent">
      <State
        :statusText="statusText"
        :enterpriseNature="businessDetail.enterpriseNature"
        :status="status"
        :auditReason="auditReason"
        :auditTime="auditTime"
        :categoryId="businessDetail.categoryId"
      ></State>
      <div class="formContent">
        <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
          <div v-if="$$(businessDetail, 'auditStatus') == '0'">
            <a-form-item label="企业性质" v-if="$hasSuppliers()">
              {{ businessDetail.enterpriseNature === '1' ? '生产商' : '贸易商' }}
            </a-form-item>

            <a-form-item label="企业名称">
              <a-input disabled="disabled" v-model="businessDetail.enterpriseName" />
            </a-form-item>
            <a-form-item label="主营品类" v-if="$hasSuppliers()">
              <a-input disabled="disabled" v-model="businessDetail.name" />
            </a-form-item>
            <a-form-item label="授权委托书:">
              <ImagePreview style="width: 80px" :value="businessDetail.powerOfAttorneyUrl"></ImagePreview>
            </a-form-item>
            <a-form-item label="营业执照:">
              <ImagePreview style="width: 80px" :value="businessDetail.businessLicenceUrl"></ImagePreview>
            </a-form-item>
          </div>
          <div class="formInput" v-if="$$(businessDetail, 'auditStatus') == '1'">
            <a-form-item label="企业性质" v-if="$hasSuppliers()">
              {{ businessDetail.enterpriseNature === '1' ? '生产商' : '贸易商' }}
            </a-form-item>
            <a-form-item label="企业名称:">
              <a-input disabled="disabled" v-model="businessDetail.enterpriseName" />
            </a-form-item>
            <a-form-item label="统一社会信用代码:">
              <a-input disabled="disabled" v-model="businessDetail.businessLicenceNo" />
            </a-form-item>
            <a-form-item label="法人名称:">
              <a-input disabled="disabled" v-model="businessDetail.legalPersonName" />
            </a-form-item>
            <a-form-item label="成立日期:">
              <a-input disabled="disabled" :value="businessDetail.businessLicencePeriodBegin | moment" />
            </a-form-item>
            <a-form-item label="注册资金:">
              <a-input disabled="disabled" v-model="businessDetail.registeredCapital" />
            </a-form-item>
            <a-form-item label="公司类型:">
              <a-input disabled="disabled" v-model="businessDetail.enterpriseType" />
            </a-form-item>
            <a-form-item label="截止日期:">
              <a-input disabled="disabled" :value="businessDetail.businessLicencePeriodEnd | moment" />
            </a-form-item>
            <a-form-item label="注册币种:">
              <a-input disabled="disabled" v-model="businessDetail.currency" />
            </a-form-item>
            <a-form-item label="经营范围:">
              <a-textarea disabled="disabled" v-model="businessDetail.businessScope" />
            </a-form-item>
            <a-form-item label="注册地:">
              <a-input
                disabled="disabled"
                :value="`${businessDetail.registeredProvinceName}${businessDetail.registeredCityName}${businessDetail.registeredRegionName}`"
              />
            </a-form-item>
            <a-form-item label="详细地址:">
              <a-textarea disabled="disabled" v-model="businessDetail.registeredDetailAddress" />
            </a-form-item>
            <a-form-item label="授权委托书:" v-if="businessDetail.powerOfAttorneyUrl">
              <ImagePreview style="width: 80px" :value="businessDetail.powerOfAttorneyUrl"></ImagePreview>
            </a-form-item>
            <a-form-item label="营业执照:" v-if="businessDetail.businessLicenceUrl">
              <ImagePreview style="width: 80px" :value="businessDetail.businessLicenceUrl"></ImagePreview>
            </a-form-item>
          </div>
          <div v-if="$$(businessDetail, 'auditStatus') == '2'">
            <a-form-item label="企业性质" v-if="$hasSuppliers()">
              <!-- {{ businessDetail.enterpriseNature === '1' ? '生产商' : '贸易商' }} -->
              <a-radio-group
                v-model="businessDetail.enterpriseNature"
                :options="[
                  { label: '生产商', value: '1' },
                  { label: '贸易商', value: '2' }
                ]"
              >
              </a-radio-group>
            </a-form-item>
            <a-form-item label="企业名称">
              <a-input disabled="disabled" v-model="businessDetail.enterpriseName" />
            </a-form-item>
            <a-form-item label="主营品类" v-if="$hasSuppliers()">
              <!-- <a-select v-model="businessDetail.categoryId" placeholder="请选择品类">
                <a-select-option v-for="i in queryMerAll" :key="i.id">{{ i.name }}</a-select-option>
              </a-select> -->
              <tree-select
                :collapseTags="false"
                :normalizer="normalizer"
                :options="categoryList"
                v-model="businessDetail.categoryId"
              ></tree-select>
            </a-form-item>
            <a-form-item label="授权委托书:">
              <s-upload v-model="businessDetail.powerOfAttorneyUrl" list-type="picture-card">
                <div class="upload" v-if="!businessDetail.powerOfAttorneyUrl">
                  <div class="plus">
                    <img :src="require('@/assets/images/enterprise/plus.png')" alt="" />
                  </div>
                  <div class="text">上传图片</div>
                </div>
              </s-upload>
              <div class="uploadTishi">文件格式支持：bmp，tiff，jpg，jpeg，png 文件大小不能超过1.5M</div>
              <a class="colorF" href="/files/shouquan.doc" download="授权委托书.doc">《授权委托书模板下载》</a>
            </a-form-item>
            <a-form-item label="营业执照:">
              <s-upload
                v-model="businessDetail.businessLicenceUrl"
                list-type="picture-card"
                @change="getComDetailWithOCR"
              >
                <div class="upload" v-if="!businessDetail.businessLicenceUrl">
                  <div class="plus">
                    <img :src="require('@/assets/images/enterprise/plus.png')" alt="" />
                  </div>
                  <div class="text">上传图片</div>
                </div>
              </s-upload>
              <div style="color: red" v-show="showOCRError">请上传正确清晰的营业执照</div>
              <div class="uploadTishi">文件格式支持：bmp，tiff，jpg，jpeg，png 文件大小不能超过1.5M</div>
              <span>请上传营业执照（副本）原件或盖公章复印件</span>
            </a-form-item>
          </div>
        </a-form>
      </div>
    </div>
    <fixed-box class="btnBottom" v-if="$$(businessDetail, 'auditStatus') == '2'">
      <a-button class="btnLeft" size="large">取消</a-button>
      <a-button class="btnRight" type="primary" size="large" @click="orgInfoMerchant">提交审核</a-button>
    </fixed-box>
  </div>
</template>
<script>
import Tabtitle from './tabtitle.vue'
import State from './state.vue'
import Enterpriceupload from './enterpriceupload.vue'
import Entbnt from './entbnt.vue'
import { ImagePreview } from '@/components/'
import { getBusinessDetail, appealAction, merchantOrgInfo } from '@/api/enterprise'
import * as userAPI from '../../api/user.js'

// function getBase64(img, callback) {
//   const reader = new FileReader()
//   reader.addEventListener('load', () => callback(reader.result))
//   reader.readAsDataURL(img)
// }
import { queryTreeAllCategory } from '@/api/user.js'

export default {
  components: {
    Entbnt: Entbnt, // 底部按钮
    Tabtitle: Tabtitle, // 导航标题
    State: State, // 状态信息
    Enterpriceupload: Enterpriceupload, // 图片上传
    ImagePreview // 图片预览
  },
  data() {
    return {
      titleName: '工商信息',
      businessDetail: {},
      statusText: '',
      status: 0,
      auditReason: '',
      auditTime: '',
      loading: false,
      imageUrl: '',
      queryMerAll: [],
      showOCRError: false,
      form: {},
      categoryList: [],
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
  created() {
    this.businessDetailGet()
    this.getPinLei()
  },
  methods: {
    // 获取详情
    async businessDetailGet() {
      const data = await getBusinessDetail()
      this.businessDetail = data.data
      this.auditTime = data?.data?.auditTime
      if (data?.data?.auditStatus === '2') {
        this.statusText = '审核不通过'
        this.status = 2
        this.auditReason = data?.data?.auditReason
      } else if (data?.data?.auditStatus === '1') {
        this.statusText = '审核通过'
        this.status = 1
      } else {
        this.statusText = '审核中'
        this.status = 0
      }
    },
    async getPinLei() {
      const res = await queryTreeAllCategory()
      if (res.code === '0') {
        this.categoryList = res.data
      }
    },
    getLocalTime(nS) {
      return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')
    },
    // 立即申诉
    async actionAppeal(params) {
      const data = await appealAction({ ...params, businessName: this.businessDetail.enterpriseName })
      if (data.success === true) {
        this.$message.success('申诉成功')
      }
    },
    // 提交审核
    async orgInfoMerchant() {
      if (this.businessDetail.powerOfAttorneyUrl === '') {
        this.$message.error('授权书不能为空')
        return
      }
      if (this.businessDetail.businessLicenceUrl === '') {
        this.$message.error('营业执照不能为空')
        return
      }
      if (this.businessDetail.businessLicenceUrl !== '' && this.showOCRError) {
        this.$message.error('请上传正确清晰的营业执照')
        return
      }
      const params = {
        auditStatus: this.businessDetail.auditStatus,
        categoryId: this.businessDetail.categoryId,
        powerOfAttorneyUrl: this.businessDetail.powerOfAttorneyUrl,
        businessLicenceUrl: this.businessDetail.businessLicenceUrl,
        enterpriseNature: this.businessDetail.enterpriseNature,
        // ocr信息
        legalPersonName: this.form.legalPersonNameOcr,
        registeredDetailAddress: this.form.registeredDetailAddressOcr,
        registeredCapital: this.form.registeredCapitalOcr,
        businessLicencePeriodEnd: this.form.businessLicencePeriodEndOcr,
        enterpriseType: this.form.enterpriseTypeOcr,
        businessLicenceRegister: this.form.businessLicenceRegisterOcr,
        businessLicenceNo: this.form.businessLicenceNoOcr,
        businessScope: this.form.businessScopeOcr,
        enterpriseNameOcr: this.form.enterpriseNameOcr
      }
      const data = await merchantOrgInfo(params)
      if (data.code === '0') {
        this.$message.success('提交成功')
        this.businessDetailGet()
      } else {
        this.$message.error('提交失败')
      }
    },
    getComDetailWithOCR() {
      if (this.businessDetail.businessLicenceUrl !== '') {
        this.showOCRError = false
        userAPI.ocrBusinessLicense(this.businessDetail.businessLicenceUrl).then((ret) => {
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
            }
          } else {
            this.showOCRError = true
          }
        })
      }
    }
    // handleCancelPreview1() {
    //   this.previewVisible1 = false
    // },
    // removeFile1() {
    //   this.fileList1 = []
    //   this.businessDetail.powerOfAttorneyUrl = ''
    //   this.filelist1Url = ''
    // },
    // handlePreview1() {
    //   this.previewVisible1 = true
    // },
    // handleChange1({ fileList }) {
    //   this.fileList1 = fileList
    //   if (fileList.length > 0) {
    //     this.businessDetail.powerOfAttorneyUrl = this.fileList1[0].response?.data?.url
    //     this.filelist1Url = this.fileList1[0].response?.data?.url
    //   } else {
    //     this.removeFile1()
    //   }
    // },

    // handleCancelPreview2() {
    //   this.previewVisible2 = false
    // },
    // removeFile2() {
    //   this.fileList2 = []
    //   this.businessDetail.businessLicenceUrl = ''
    //   this.filelist2Url = ''
    // },
    // handlePreview2() {
    //   this.previewVisible2 = true
    // },
    // handleChange2({ fileList }) {
    //   this.fileList2 = fileList
    //   if (fileList.length > 0) {
    //     this.businessDetail.businessLicenceUrl = this.fileList2[0].response?.data?.url
    //     this.filelist2Url = this.fileList2[0].response?.data?.url
    //   } else {
    //     this.removeFile2()
    //   }
    // },
    //
    // beforeUpload(file, fileList) {
    //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    //   if (!isJpgOrPng) {
    //     this.$message.error('You can only upload JPG file!')
    //   }
    //   const isLt2M = file.size / 1024 / 1024 < 2
    //   if (!isLt2M) {
    //     this.$message.error('Image must smaller than 2MB!')
    //   }
    //   // const data = await uploadFile()
    //   // return isJpgOrPng && isLt2M
    // },
    // handleChangeBusinessLicenceUrl(info) {
    //   if (info.file.status === 'uploading') {
    //     this.loading = true
    //     return
    //   }
    //   if (info.file.status === 'done') {
    //     // Get this url from response in real world.
    //     this.businessDetail.businessLicenceUrl = info.file.response.data.url
    //     getBase64(info.file.originFileObj, (imageUrl) => {
    //       this.imageUrl = imageUrl
    //       this.loading = false
    //     })
    //   }
    // },
    // beforeUploadBusinessLicenceUrl(file, fileList) {
    //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    //   if (!isJpgOrPng) {
    //     this.$message.error('You can only upload JPG file!')
    //   }
    //   const isLt2M = file.size / 1024 / 1024 < 2
    //   if (!isLt2M) {
    //     this.$message.error('Image must smaller than 2MB!')
    //   }
    //   // const data = await uploadFile()
    //   // return isJpgOrPng && isLt2M
    // }
  }
}
</script>

<style lang="less" scoped>
.formContent {
  /*width: 761px;*/
  padding-top: 40px;
  .formImg {
    width: 80px;
    height: 80px;
  }
  .uploadTishi {
    width: 500px;
    font-size: 12px;
  }
  .formInput {
    input {
      background-color: #ffffff !important;
    }
    textarea {
      background-color: #ffffff !important;
    }
  }
}
/deep/ .ant-upload.ant-upload-select-picture-card {
  width: 80px;
  height: 80px;
}
.colorF {
  color: #1890ff;
}
.imageSize {
  width: 100px;
  height: 100px;
}
.btnBottom {
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 6px;
}
.btnLeft {
  width: 120px;
}
.btnRight {
  width: 120px;
}
</style>
<style lang="less">
/*.busContent {*/
/*  .ant-upload {*/
/*    background: #fff;*/
/*  }*/
/*  .ant-upload-list-picture .ant-upload-list-item,*/
/*  .ant-upload-list-picture-card .ant-upload-list-item {*/
/*    padding: 0;*/
/*  }*/
/*  .ant-upload-picture-card-wrapper {*/
/*    width: 112px;*/
/*  }*/
/*}*/
</style>

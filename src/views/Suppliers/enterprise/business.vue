<template>
  <div>
    <Tabtitle :titleName="titleName"></Tabtitle>
    <div class="busContent">
      <State :statusText="statusText" :status="status" :auditReason="auditReason" :auditTime="auditTime"></State>
      <div class="formContent">
        <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
          <div v-if="businessDetail.auditStatus == '2'">
            <a-form-item label="企业名称">
              <a-input disabled="disabled" v-model="businessDetail.enterpriseName" />
            </a-form-item>
            <a-form-item label="主营品类">
              <a-input disabled="disabled" v-model="businessDetail.name" />
            </a-form-item>
            <a-form-item label="授权委托书:">
              <ImagePreview :src="businessDetail.powerOfAttorneyUrl"></ImagePreview>
            </a-form-item>
            <a-form-item label="营业执照:">
              <ImagePreview :src="businessDetail.businessLicenceUrl"></ImagePreview>
            </a-form-item>
          </div>
          <div class="formInput" v-if="businessDetail.auditStatus == '1'">
            <a-form-item label="企业名称:">
              <a-input disabled="disabled" v-model="businessDetail.enterpriseName" />
            </a-form-item>
            <a-form-item label="统一社会信用代码:">
              <a-input disabled="disabled" v-model="businessDetail.businessLicenceNo" />
            </a-form-item>
            <a-form-item label="法定代表人:">
              <a-input disabled="disabled" v-model="businessDetail.legalPersonName" />
            </a-form-item>
            <a-form-item label="成立日期:">
              <a-input disabled="disabled" v-model="businessDetail.businessLicencePeriodBegin" />
            </a-form-item>
            <a-form-item label="注册资金:">
              <a-input disabled="disabled" v-model="businessDetail.registeredCapital" />
            </a-form-item>
            <a-form-item label="公司类型:">
              <a-input disabled="disabled" v-model="businessDetail.enterpriseType" />
            </a-form-item>
            <a-form-item label="截止日期:">
              <a-input disabled="disabled" v-model="businessDetail.businessPeriodEnd" />
            </a-form-item>
            <a-form-item label="注册币种:">
              <a-input disabled="disabled" v-model="businessDetail.currency" />
            </a-form-item>
            <a-form-item label="经营范围:">
              <a-textarea disabled="disabled" v-model="businessDetail.businessScope" />
            </a-form-item>
            <a-form-item label="注册地:">
              <a-input disabled="disabled" v-model="businessDetail.registeredProvinceName" />
            </a-form-item>
            <a-form-item label="详细地址:">
              <a-textarea disabled="disabled" v-model="businessDetail.registeredDetailAddress" />
            </a-form-item>
            <a-form-item label="授权委托书:">
              <ImagePreview :src="businessDetail.powerOfAttorneyUrl"></ImagePreview>
            </a-form-item>
            <a-form-item label="营业执照:">
              <ImagePreview :src="businessDetail.businessLicenceUrl"></ImagePreview>
            </a-form-item>
          </div>
          <div v-if="businessDetail.auditStatus == '0'">
            <a-form-item label="企业名称">
              <a-input disabled="disabled" v-model="businessDetail.enterpriseName" />
            </a-form-item>
            <a-form-item label="主营品类">
              <a-input disabled="disabled" v-model="businessDetail.name" />
            </a-form-item>
            <a-form-item label="授权委托书:">
              <a-upload
                name="Filedata"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                action="/api/back-manage-web/media/uploadFile"
                fileName="Filedata"
                :before-upload="beforeUpload"
                @change="handleChange"
              >
                <img
                  class="imageSize"
                  v-if="businessDetail.powerOfAttorneyUrl"
                  :src="businessDetail.powerOfAttorneyUrl"
                  alt="avatar"
                />
                <div v-else>
                  <img :src="require('@/assets/images/enterprise/plus.png')" alt="" />
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
              <div class="uploadTishi">提示：单个上传文件最大为4M，支持BMP、TIFF、GIF、JPG、JPEG、PNG、PDF</div>
              <a class="colorF">《授权委托书模板下载》</a>
            </a-form-item>
            <a-form-item label="营业执照:">
              <a-upload
                name="Filedata"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                action="/api/back-manage-web/media/uploadFile"
                :before-upload="beforeUploadBusinessLicenceUrl"
                @change="handleChangeBusinessLicenceUrl"
              >
                <img
                  class="imageSize"
                  v-if="businessDetail.businessLicenceUrl"
                  :src="businessDetail.businessLicenceUrl"
                  alt="avatar"
                />
                <div v-else>
                  <img :src="require('@/assets/images/enterprise/plus.png')" alt="" />
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
              <div class="uploadTishi">提示：单个上传文件最大为4M，支持BMP、TIFF、GIF、JPG、JPEG、PNG、PDF</div>
              <span class="colorF">请上传营业执照（副本）原件或盖公章复印件</span>
            </a-form-item>
          </div>
        </a-form>
      </div>
    </div>
    <fixed-box v-if="businessDetail.auditStatus == '0'">
      <a-button>取消</a-button>
      <a-button type="primary" @click="orgInfoMerchant">提交审核</a-button>
    </fixed-box>
  </div>
</template>
<script>
import Tabtitle from './tabtitle.vue'
import State from './state.vue'
import Enterpriceupload from './enterpriceupload.vue'
import Entbnt from './entbnt.vue'
import { ImagePreview } from '@/components/index.js'
import { getBusinessDetail, appealAction, merchantOrgInfo } from '@/api/enterprise'
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
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
      businessDetail: '',
      statusText: '',
      status: 1,
      auditReason: '',
      auditTime: '',
      loading: false,
      imageUrl: ''
    }
  },
  mounted() {
    this.businessDetailGet()
  },
  methods: {
    // 获取详情
    async businessDetailGet() {
      const data = await getBusinessDetail()
      console.log(data)
      this.businessDetail = data.data
      this.auditTime = data.data.auditTime
      if (data.data.auditStatus === '0') {
        this.statusText = '审核不通过'
        this.status = 0
        this.auditReason = data.data.auditReason
      } else if (data.data.auditStatus === '1') {
        this.statusText = '审核通过'
        this.status = 1
      } else {
        this.statusText = '审核中'
        this.status = 2
      }
    },
    getLocalTime(nS) {
      return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')
    },
    // 立即申诉
    async actionAppeal(params) {
      const data = await appealAction({ ...params, businessName: this.businessDetail?.enterpriseName })
      console.log(data)
    },
    // 提交审核
    async orgInfoMerchant() {
      var params = {
        businessLicenceUrl: this.businessDetail.businessLicenceUrl,
        powerOfAttorneyUrl: this.businessDetail.powerOfAttorneyUrl
      }
      const data = await merchantOrgInfo(params)
      if (data.code === '0') {
        this.$message.success('提交成功')
        this.businessDetailGet()
      } else {
        this.$message.error('提交失败')
      }
    },
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        console.log('info', info)
        this.businessDetail.powerOfAttorneyUrl = info.file.response.data.url
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.imageUrl = imageUrl
          this.loading = false
        })
      }
    },
    beforeUpload(file, fileList) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      console.log(fileList)
      // const data = await uploadFile()
      // return isJpgOrPng && isLt2M
    },
    handleChangeBusinessLicenceUrl(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        console.log('info', info)
        this.businessDetail.businessLicenceUrl = info.file.response.data.url
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.imageUrl = imageUrl
          this.loading = false
        })
      }
    },
    beforeUploadBusinessLicenceUrl(file, fileList) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      console.log(fileList)
      // const data = await uploadFile()
      // return isJpgOrPng && isLt2M
    }
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
</style>

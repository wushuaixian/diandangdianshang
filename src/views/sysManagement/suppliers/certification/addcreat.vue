<template>
  <a-modal
    :title="addcreatStatus === 1 ? '添加资质' : '更新资质'"
    :visible="visible"
    @ok="handleOk"
    :width="600"
    cancelText="取消"
    okText="保存"
    @cancel="handleCancel"
  >
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
      <a-form-model-item label="资质类型" has-feedback prop="certificateType">
        <a-select
          allowClear
          :getPopupContainer="(triggerNode) => triggerNode.parentNode"
          class="inp"
          v-model="form.certificateType"
          placeholder="请选择"
        >
          <a-select-option value="IOS9001质量体系认证"> IOS9001质量体系认证 </a-select-option>
          <a-select-option value="IOS14001环境管理质量体系认证"> IOS14001环境管理质量体系认证</a-select-option>
          <a-select-option value="IOS10012测量管理体系认证"> IOS10012测量管理体系认证 </a-select-option>
          <a-select-option value="职业健康安全管理体系认证"> 职业健康安全管理体系认证 </a-select-option>
          <a-select-option value="特种设备制造许可证"> 特种设备制造许可证 </a-select-option>
          <a-select-option value="特种设备设计许可证"> 特种设备设计许可证 </a-select-option>
          <a-select-option value="特种设备安装改造维修许可证"> 特种设备安装改造维修许可证 </a-select-option>
          <a-select-option value="安全生产许可证"> 安全生产许可证 </a-select-option>
          <a-select-option value="危险品经营资质证书"> 危险品经营资质证书 </a-select-option>
          <a-select-option value="危险化学品使用许可证"> 危险化学品使用许可证 </a-select-option>
          <a-select-option value="危险化学品运输许可证"> 危险化学品运输许可证 </a-select-option>
          <a-select-option value="非药品类易制毒化学品经营备案证明"> 非药品类易制毒化学品经营备案证明 </a-select-option>
          <a-select-option value="防爆合格证"> 防爆合格证 </a-select-option>
          <a-select-option value="计量器具批准证书"> 计量器具批准证书 </a-select-option>
          <a-select-option value="制造计量器具许可证"> 制造计量器具许可证 </a-select-option>
          <a-select-option value="道路运输经营许可证"> 道路运输经营许可证 </a-select-option>
          <a-select-option value="全国工业产品生产许可证"> 全国工业产品生产许可证 </a-select-option>
          <a-select-option value="辐射安全许可证"> 辐射安全许可证 </a-select-option>
          <a-select-option value="放射性同位素许可证"> 放射性同位素许可证 </a-select-option>
          <a-select-option value="中国国家强制性产品认证证书（CCC）">
            中国国家强制性产品认证证书（CCC）
          </a-select-option>
          <a-select-option value="消防系统产品资质许可证"> 消防系统产品资质许可证 </a-select-option>
          <a-select-option value="电气防爆产品许可证"> 电气防爆产品许可证 </a-select-option>
          <a-select-option value="特种压力表许可证"> 特种压力表许可证 </a-select-option>
          <a-select-option value="起重电气许可证"> 起重电气许可证 </a-select-option>
          <a-select-option value="印制商标单位证书"> 印制商标单位证书 </a-select-option>
          <a-select-option value="安全阀门生产许可证"> 安全阀门生产许可证 </a-select-option>
          <a-select-option value="冶金标准样品认可证"> 冶金标准样品认可证 </a-select-option>
          <a-select-option value="成品油批发经营许可"> 成品油批发经营许可 </a-select-option>
          <a-select-option value="食盐批发许可证"> 食盐批发许可证 </a-select-option>
          <a-select-option value="建筑业企业资质证书"> 建筑业企业资质证书 </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="证书名称" prop="certificateName">
        <a-input placeholder="请输入证书名称" v-model="form.certificateName" />
      </a-form-model-item>
      <a-form-model-item label="证书编号" prop="certificateNumber">
        <a-input placeholder="请输入证书编号" v-model="form.certificateNumber" />
      </a-form-model-item>
      <a-form-model-item label="颁发机构" prop="issueAuthority">
        <a-input placeholder="请输入颁发机构" v-model="form.issueAuthority" />
      </a-form-model-item>
      <a-form-model-item label="颁发日期" prop="issueBeginTime">
        <a-date-picker v-model="form.issueBeginTime" type="date" placeholder="请选择颁发日期" class="inp" />
      </a-form-model-item>
      <a-form-model-item label="有效期至" prop="issueEndTime">
        <a-date-picker v-model="form.issueEndTime" type="date" placeholder="请选择有效期" class="inp" />
      </a-form-model-item>
      <a-form-model-item label="证书上传">
        <div class="content">
          <a-upload
            action="/api/back-manage-web/media/uploadFile"
            :showUploadList="true"
            :defaultFileList="fileList"
            :file-list="fileList"
            list-type="picture-card"
            @change="handleFileChange"
            @preview="handlePreview"
            @remove="removeFile"
          >
            <div class="upload" v-if="fileList.length === 0">
              <div class="plus">
                <a-icon class="icon" type="plus" />
              </div>
              <div class="text">上传图片</div>
            </div>
          </a-upload>
          <div class="message">
            <div class="other">支持格式：bmp、tiff、gif、jpg、png、jpeg、pdf，文件大小不能超过510M</div>
          </div>
        </div>
      </a-form-model-item>
    </a-form-model>
    <a-modal :visible="previewVisible" :footer="null" title="图片预览" @cancel="handleCancelPreview">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </a-modal>
</template>

<script>
import Enterpriceupload from '@/views/enterprise/enterpriceupload.vue'
import moment from 'moment'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    addcreatStatus: {
      type: Number,
      default: 1
    },
    editData: {
      type: Object,
      default: null
    }
  },
  components: {
    Enterpriceupload: Enterpriceupload // 图片上传
  },
  data() {
    return {
      previewVisible: false,
      fileList: [],
      merchantId: '',
      form: {
        certificateType: undefined,
        certificateName: undefined,
        certificateNumber: '',
        issueAuthority: '',
        issueBeginTime: '',
        issueEndTime: '',
        certificateUrl: ''
      },
      rules: {
        certificateType: [{ required: true, message: '请选择资质类型', trigger: 'blur' }],
        certificateName: [{ required: true, message: '请输入证书名称', trigger: 'blur' }],
        certificateNumber: [{ required: true, message: '请输入证书编号', trigger: 'change' }],
        issueAuthority: [{ required: true, message: '请输入颁发机构', trigger: 'change' }],
        issueBeginTime: [{ required: true, message: '请选择颁发日期', trigger: 'change' }],
        issueEndTime: [{ required: true, message: '请选择有效期', trigger: 'change' }],
        certificateUrl: [{ required: true, message: '请上传证书', trigger: 'change' }]
      }
    }
  },
  watch: {
    visible(v) {
      if (this.addcreatStatus === 2 && v) {
        this.form.certificateType = this.editData.certificateType
        this.form.certificateName = this.editData.certificateName
        this.form.certificateNumber = this.editData.certificateNumber
        this.form.issueAuthority = this.editData.issueAuthority
        this.form.issueBeginTime = moment(this.editData.issueBeginTime)
        this.form.issueEndTime = moment(this.editData.issueEndTime)
        this.form.certificateUrl = this.editData.certificateUrl
        this.merchantId = this.editData.id
      } else {
        this.form.certificateType = undefined
        this.form.certificateName = undefined
        this.form.certificateNumber = ''
        this.form.issueAuthority = ''
        this.form.issueBeginTime = ''
        this.form.issueEndTime = ''
        this.removeFile()
        this.merchantId = ''
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 关闭添加框
    handleCancel() {
      this.$emit('close')
      this.$refs.ruleForm.resetFields()
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.addcreatStatus === 1) {
            this.$emit('addQualifications', { ...this.form, certificationStatus: 1 })
          } else {
            this.$emit('updateQualifications', { ...this.form, id: this.merchantId })
          }
          console.log('success')
          this.$refs.ruleForm.resetFields()
        } else {
          return false
        }
      })
    },
    removeFile() {
      this.fileList = []
      this.form.certificateUrl = ''
    },
    handleFileChange({ fileList }) {
      console.log(fileList)
      this.fileList = fileList
      if (fileList.length > 0) {
        this.form.certificateUrl = this.fileList[0].response?.data?.url
      } else {
        this.removeFile()
      }
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleCancelPreview() {
      this.previewVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
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
  width: 300px;
  position: absolute;
  top: 67px;
  left: 121px;
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
</style>
<style scoped lang="less">
/deep/.ant-modal-content {
  width: 700px;
}
.updat {
  display: flex;
  justify-content: center;
}
</style>

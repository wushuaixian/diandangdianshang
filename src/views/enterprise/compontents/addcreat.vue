<template>
  <div>
    <a-modal
      wrapClassName="addcreat-main"
      :title="disabled ? '查看资质证书' : isEdit ? '编辑资质证书' : '新增资质证书'"
      :visible="visible"
      :footer="null"
      :confirm-loading="confirmLoading"
      @cancel="handleCancelModel"
    >
      <a-form-model ref="addRefForm" :rules="rules" :model="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
        <a-form-model-item label="资质类型" has-feedback prop="certificateType">
          <a-select
            id="qweqwe"
            :disabled="disabled"
            allowClear
            :getPopupContainer="(triggerNode) => triggerNode.parentNode"
            style="width: 100%"
            showSearch
            v-model="form.certificateType"
            placeholder="请选择资质类型"
          >
            <a-select-option value="ISO9001质量体系认证">ISO9001质量体系认证</a-select-option>
            <a-select-option value="ISO14001环境管理质量体系认证">ISO14001环境管理质量体系认证</a-select-option>
            <a-select-option value="ISO10012测量管理体系认证">ISO10012测量管理体系认证</a-select-option>
            <a-select-option value="职业健康安全管理体系认证">职业健康安全管理体系认证</a-select-option>
            <a-select-option value="特种设备制造许可证">特种设备制造许可证</a-select-option>
            <a-select-option value="特种设备设计许可证">特种设备设计许可证</a-select-option>
            <a-select-option value="特种设备安装改造维修许可证">特种设备安装改造维修许可证</a-select-option>
            <a-select-option value="安全生产许可证">安全生产许可证</a-select-option>
            <a-select-option value="危险品经营资质证书">危险品经营资质证书</a-select-option>
            <a-select-option value="危险化学品使用许可证">危险化学品使用许可证</a-select-option>
            <a-select-option value="危险化学品运输许可证">危险化学品运输许可证</a-select-option>
            <a-select-option value="非药品类易制毒化学品经营备案证明">非药品类易制毒化学品经营备案证明</a-select-option>
            <a-select-option value="防爆合格证">防爆合格证</a-select-option>
            <a-select-option value="计量器具批准证书">计量器具批准证书</a-select-option>
            <a-select-option value="制造计量器具许可证">制造计量器具许可证</a-select-option>
            <a-select-option value="道路运输经营许可证">道路运输经营许可证</a-select-option>
            <a-select-option value="全国工业产品生产许可证">全国工业产品生产许可证</a-select-option>
            <a-select-option value="辐射安全许可证">辐射安全许可证</a-select-option>
            <a-select-option value="放射性同位素许可证">放射性同位素许可证</a-select-option>
            <a-select-option value="中国国家强制性产品认证证书（CCC）">
              中国国家强制性产品认证证书（CCC）
            </a-select-option>
            <a-select-option value="消防系统产品资质许可证">消防系统产品资质许可证</a-select-option>
            <a-select-option value="电气防爆产品许可证">电气防爆产品许可证</a-select-option>
            <a-select-option value="特种压力表许可证">特种压力表许可证</a-select-option>
            <a-select-option value="起重电气许可证">起重电气许可证</a-select-option>
            <a-select-option value="印制商标单位证书">印制商标单位证书</a-select-option>
            <a-select-option value="安全阀门生产许可证">安全阀门生产许可证</a-select-option>
            <a-select-option value="冶金标准样品认可证">冶金标准样品认可证</a-select-option>
            <a-select-option value="成品油批发经营许可">成品油批发经营许可</a-select-option>
            <a-select-option value="食盐批发许可证">食盐批发许可证</a-select-option>
            <a-select-option value="建筑业企业资质证书">建筑业企业资质证书</a-select-option>
            <a-select-option value="代理证">代理证</a-select-option>
            <a-select-option value="品牌授权证书">品牌授权证书</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- <a-form-model-item label="证书名称" has-feedback prop="certificateName">
          <a-input v-model="form.certificateName" placeholder="请输入证书名称" />
        </a-form-model-item> -->
        <a-form-model-item label="证书编号" prop="certificateNumber">
          <a-input :disabled="disabled" v-model="form.certificateNumber" placeholder="请输入证书编号" />
        </a-form-model-item>
        <a-form-model-item label="颁发机构" prop="issueAuthority">
          <a-input :disabled="disabled" v-model="form.issueAuthority" placeholder="请输入颁发机构" />
        </a-form-model-item>
        <a-form-model-item label="颁发日期" prop="issueBeginTime">
          <a-date-picker :disabled="disabled" :disabled-date="disabledBeginDate" v-model="form.issueBeginTime" />
        </a-form-model-item>
        <a-form-model-item label="有效期至" has-feedback prop="issueEndTime">
          <a-date-picker :disabled="disabled" :disabled-date="disabledDate" v-model="form.issueEndTime" />
        </a-form-model-item>
        <a-form-model-item label="证书上传" prop="certificateUrl" class="upload-form-item">
          <div class="content">
            <s-upload :disabled="disabled" list-type="picture-card" v-model="form.certificateUrl">
              <div class="upload" v-if="!form.certificateUrl">
                <div class="plus">
                  <a-icon class="icon" type="plus" />
                </div>
                <div class="text">上传图片</div>
              </div>
            </s-upload>
            <div class="message">
              <div class="other">支持格式：bmp、tiff、gif、jpg、png、jpeg，文件大小不能超过1.5M</div>
            </div>
          </div>
        </a-form-model-item>
        <a-form-model-item label="驳回原因" v-if="$$(form, 'authReason')">
          <span style="color: red">{{ $$(form, 'authReason') }} </span>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 12, offset: 5 }" v-if="!disabled">
          <a-button
            type="primary"
            html-type="submit"
            style="margin-left: 30px"
            :disabled="confirmLoading"
            @click="Save"
          >
            确认
          </a-button>
          <a-button style="margin-left: 30px" @click="handleCancelModel">取消 </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import * as api from '@/api/supplieAuthAdmin'
import _ from 'loadsh'
import moment from 'moment'
const rules = {
  certificateType: [{ required: true, message: '请选择资质类型', trigger: 'change' }],
  issueEndTime: [{ required: true, message: '请选择有效期至', trigger: 'change' }],
  certificateUrl: [{ required: true, message: '请上传证书', trigger: 'change' }]
}

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
    type: {
      type: String,
      default: 'default'
    },
    visible: {
      type: Boolean,
      required: true
    },
    info: {
      type: Object,
      default: () => ({})
    },
    merchantId: {
      type: String,
      default: null
    },
    certificationStatus: {
      type: Number,
      default: 0
    }
  },
  watch: {
    'form.certificateUrl'(val) {
      if (val) {
        this.$refs.addRefForm.clearValidate('certificateUrl')
      }
    }
  },
  mounted() {
    this.Save = _.debounce(this.Save, 500)
  },
  computed: {
    isEdit() {
      return this.type === 'edit'
    },
    disabled() {
      return this.type === 'check'
    }
  },
  data() {
    return {
      confirmLoading: false,
      rules,
      form: this.info || {},
      fileList: [],
      previewVisible: false,
      previewImage: ''
    }
  },
  methods: {
    disabledBeginDate(current) {
      return current >= moment().startOf('day')
    },
    disabledDate(current) {
      return current <= moment().startOf('day')
    },
    Save() {
      this.$refs.addRefForm.validate(async (valid) => {
        if (valid) {
          this.confirmLoading = true
          const { id, issueBeginTime, issueEndTime } = this.form
          const diff = moment(issueBeginTime).diff(moment(issueEndTime), 'days')
          // 颁发时间不能大于有效时间
          if (diff > 0) {
            this.$message.error('颁发时间不能大于有效时间')
            this.confirmLoading = false
            return
          }
          const res = id
            ? await api.updateCategory({
                ...this.form,
                merchantId: this.merchantId,
                certificationStatus: this.certificationStatus
              })
            : await api.addQualifications({
                ...this.form,
                merchantId: this.merchantId,
                certificationStatus: this.certificationStatus
              })
          this.confirmLoading = false
          if (res.code === '0') {
            this.$message.success(id ? '更改成功' : '添加成功')
            this.$emit('update')
            this.handleCancelModel()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 关闭添加框
    handleCancelModel() {
      this.form = {}
      this.$emit('close', false)
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
    }
  }
}
</script>

<style lang="less" scoped>
.addcreat-main {
  .ant-calendar-picker,
  .ant-input-number {
    width: 100%;
  }
}
/deep/.ant-modal-content {
  width: 700px;
}
.upload-form-item {
  /deep/.ant-form-explain {
    margin-top: 5px;
  }
}
/deep/.content {
  display: flex;
  flex-direction: row;

  .ant-upload {
    background: #fff;
  }
  .ant-upload-list-picture .ant-upload-list-item,
  .ant-upload-list-picture-card .ant-upload-list-item {
    padding: 0;
  }
  .ant-upload-picture-card-wrapper {
    width: 112px;
    height: 122px;
  }

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
</style>

<style lang="less">
</style>

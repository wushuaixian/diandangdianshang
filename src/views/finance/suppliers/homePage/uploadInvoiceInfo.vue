<template>
  <a-modal
    title="上传发票信息"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    :width="600"
    @cancel="handleCancel"
  >
    <div>
      <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="发票任务ID"><div class="cannotModify">123456789</div> </a-form-model-item>
        <a-form-model-item label="收款单号"><div class="cannotModify">123456789</div> </a-form-model-item>
        <a-form-model-item label="抬头类型">
          <a-radio-group v-model="form.headType">
            <a-radio :value="1"> 个人 </a-radio>
            <a-radio :value="2"> 企业 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="发票类型">
          <a-radio-group v-model="form.invoiceType">
            <a-radio :value="1"> 个人 </a-radio>
            <a-radio :value="2"> 企业 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="发票类型">
          <a-radio-group v-model="form.invoiceType2">
            <a-radio :value="1"> 增值税普通发票 </a-radio>
            <a-radio :value="2"> 增值税专用发票 </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
      <header-title text="发票信息" />
      <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="开户银行"><div class="cannotModify">123456789</div> </a-form-model-item>
        <a-form-model-item label="开户行账号"><div class="cannotModify">123456789</div> </a-form-model-item>
        <a-form-model-item label="发票抬头"><div class="cannotModify">123456789</div> </a-form-model-item>
        <a-form-model-item label="纳税人识别号"><div class="cannotModify">123456789</div> </a-form-model-item>
        <a-form-model-item label="电话"><div class="cannotModify">123456789</div> </a-form-model-item>
        <a-form-model-item label="地址"><div class="cannotModify">123456789</div> </a-form-model-item>
      </a-form-model>
      <header-title text="邮件地址" />
      <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="发票邮件地址"><div class="cannotModify">123456789</div> </a-form-model-item>
        <a-form-model-item label="详细地址"><div class="cannotModify">123456789</div> </a-form-model-item>
        <a-form-model-item label="联系人"><div class="cannotModify">123456789</div> </a-form-model-item>
        <a-form-model-item label="联系电话"><div class="cannotModify">123456789</div> </a-form-model-item>
      </a-form-model>
      <br />
      <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="发票金额 (元)"><a-input class="inp" /></a-form-model-item>
        <a-form-model-item label="发票代码"><a-input class="inp" /></a-form-model-item>
        <a-form-model-item label="发票号码"><a-input class="inp" /></a-form-model-item>
        <a-form-model-item label="物流信息"><a-input class="inp" /></a-form-model-item>
        <a-form-model-item label="运单号"><a-input class="inp" /></a-form-model-item>
        <a-form-model-item label="备注">
          <div class="leftSpacing text">
            <div>{{ form.failReason.length }} / 30</div>
            <p>
              <a-textarea :maxLength="30" v-model="form.failReason" />
            </p>
          </div>
        </a-form-model-item>
        <a-form-model-item label="上传文件">
          <a-upload
            name="file"
            :multiple="true"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            :headers="headers"
            @change="changeFile"
          >
            <a-button> <a-icon type="upload" /> 上传文件 </a-button>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
    </div>
  </a-modal>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      confirmLoading: false,
      headers: [],
      form: {
        headType: 1,
        invoiceType: 1,
        invoiceType2: 2,
        failReason: ''
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 }
    }
  },
  methods: {
    handleOk() {},
    handleCancel() {
      this.$emit('close')
    },
    changeFile() {}
  }
}
</script>
<style lang="less" scoped>
.cannotModify {
  width: 436px;
  height: 32px;
  background: #f5f5f5;
  line-height: 32px;
  margin-top: 4px;
}
.inp {
  width: 436px;
}
.text {
  position: relative;
  div {
    position: absolute;
    right: 20px;
    bottom: -2px;
    z-index: 20;
    font-size: 14px;
    color: #cccccc;
  }
}
</style>

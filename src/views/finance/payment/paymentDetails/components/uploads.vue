<template>
  <div id="primary">
    <a-button @click="payments" type="primary">上传付款凭证</a-button>
    <a-modal width="600px" id="appeal" okText="提交" v-model="visible" title="编辑付款凭证" @ok="handleOk">
      <a-row style="line-height: 30px">
        <a-col :span="24">
          <a-row>
            <a-col style="color: black" :span="3">付款单号:</a-col>
            <a-col :span="20">{{ all.paymentBillCode }}</a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-row>
            <a-col style="color: black" :span="3">付款单位:</a-col>
            <a-col :span="20">{{ all.payerAccountName }}</a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-row>
            <a-col style="color: black" :span="3">收款单位:</a-col>
            <a-col :span="20">{{ all.payeeAccountName }}</a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-row>
            <a-col style="color: black" :span="4">应付款金额:</a-col>
            <a-col style="margin-left: -13px" :span="20">{{ all.feeAmt }}</a-col>
          </a-row>
        </a-col>
      </a-row>
      <div style="width: 99%; margin: 15px auto; border: 1px solid #ccc; height: 1px"></div>
      <a-row style="line-height: 30px">
        <a-row>
          <a-col style="color: black" :span="5">本次支付金额:</a-col>
          <a-col style="margin-left: -20px" :span="19">{{ all.feeAmt }}</a-col>
        </a-row>
        <a-row>
          <a-col style="color: black" :span="3">支付方式:</a-col>
          <a-col :span="19">线下支付</a-col>
        </a-row>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item style="margin-left: -54px" label="付款日期" prop="receiptTime">
            <a-date-picker v-model="form.receiptTime" show-time type="date" placeholder="请输入日期" />
          </a-form-model-item>
          <a-form-model-item style="margin-left: -56px" label="备注">
            <a-input v-model="form.remark" type="textarea" />
          </a-form-model-item>
          <a-form-model-item prop="fileDTOList" id="textss" style="margin-left: -56px" label="上传文件">
            <div class="content">
              <s-upload
                action="/api/back-manage-web/media/uploadFile"
                class="supload"
                name="Filedata"
                @aschange="suploads"
                v-model="fileList"
                list-type="picture"
                :limit="3"
                :multiple="true"
              >
                <a-button style="width: 152px"> <a-icon type="upload" />上传文件 </a-button>
              </s-upload>
            </div>
          </a-form-model-item>
        </a-form-model>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import { uploadPaymentVoucher } from '@/api/invoice'
export default {
  props: {
    all: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      fileList: [],
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 13 },
      form: {
        paymentCode: '',
        sceneType: '',
        paymentMethod: '5',
        receiptTime: '',
        id: '',
        remark: '',
        fileDTOList: []
      },
      rules: {
        receiptTime: [
          { required: true, message: '请选择付款日期', trigger: 'blur' },
          { required: true, message: '请选择付款日期', trigger: 'change' }
        ],
        fileDTOList: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.form.fileDTOList.length > 0) {
                callback()
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    suploads(e) {},
    payments() {
      this.visible = true
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.form.fileDTOList = []
          for (let i = 0; i < this.fileList.length; i++) {
            const value = {
              serialName: this.fileList[i].response.data.name,
              urserialAddressl: this.fileList[i].response.data.url
            }
            this.form.fileDTOList.push(value)
          }
          if (this.form.fileDTOList.length > 0) {
            this.uploadPaymentVoucher({
              id: this.all.id,
              paymentBillCode: this.all.paymentBillCode,
              receiptTime: this.form.receiptTime,
              remark: this.form.remark,
              sceneType: this.all.sceneType,
              paymentMethod: 5,
              fileDTOList: this.form.fileDTOList
            })
          } else {
            this.$message.error('请上传文件')
          }
        }
      })
    },
    async uploadPaymentVoucher(text) {
      try {
        const data = await uploadPaymentVoucher(text)
        if (data.code === '0') {
          this.visible = false
          this.$router.go(0)
        }
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>

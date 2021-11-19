<template>
  <div class="appeal-manage-list">
    <span @click="open">重开</span>
    <a-modal v-model="visible" title="开票申请" @ok="handleOk">
      <header-title>
        <span>基本信息</span>
      </header-title>
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="付款单号">
          <a-input disabled="disabled" v-model="form.paymentBillCode" />
        </a-form-model-item>
        <a-form-model-item label="抬头类型">
          <a-radio-group v-model="form.invoiceTitleType">
            <a-radio :value="1"> 个人 </a-radio>
            <a-radio :value="2"> 企业 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="发票形式">
          <a-radio-group v-model="form.invoiceFileType">
            <a-radio :value="1"> 电票 </a-radio>
            <a-radio :value="2"> 纸票 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item prop="invoiceType" label="发票类型">
          <a-radio-group v-model="form.invoiceType">
            <a-radio :value="1"> 增值税普通发票 </a-radio>
            <a-radio :value="2"> 增值税专用发票 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <header-title>
          <span>发票信息</span>
        </header-title>
        <a-form-model-item ref="rise" label="发票抬头" prop="invoiceTitle">
          <a-input v-model="form.invoiceTitle" />
        </a-form-model-item>
        <a-form-model-item ref="number1" label="纳税人识别号" prop="dutyParagraph">
          <a-input v-model="form.dutyParagraph" type="text" oninput="value=value.replace(/[^\d]/g,'')" />
        </a-form-model-item>
        <a-form-model-item label="开户银行" :prop="form.invoiceType === 1 ? '' : 'bankDeposit'">
          <a-input v-model="form.bankDeposit" />
        </a-form-model-item>
        <a-form-model-item ref="number" label="开户行账号" :prop="form.invoiceType === 1 ? '' : 'bankAccount'">
          <a-input v-model="form.bankAccount" type="text" oninput="value=value.replace(/[^\d]/g,'')" />
        </a-form-model-item>
        <a-form-model-item ref="address" label="地址" :prop="form.invoiceType === 1 ? '' : 'address'">
          <a-input v-model="form.bankAddress" />
        </a-form-model-item>
        <a-form-model-item ref="number2" label="电话" :prop="form.invoiceType === 1 ? '' : 'mobileNo'">
          <a-input v-model="form.mobileNo" type="text" oninput="value=value.replace(/[^\d]/g,'')" />
        </a-form-model-item>
        <header-title>
          <span>邮寄地址</span>
        </header-title>
        <a-form-model-item ref="mail" label="发票邮寄地址" prop="areaCode">
          <AreaSelect v-model="area" :selected.sync="form.areaCode" />
        </a-form-model-item>
        <a-form-model-item label="详细地址" prop="receiptAdrress">
          <a-input v-model="form.receiptAdrress" type="textarea" />
        </a-form-model-item>
        <a-form-model-item ref="contacts" label="联系人" prop="receiptPersonName">
          <a-input v-model="form.receiptPersonName" />
        </a-form-model-item>
        <a-form-model-item ref="number3" label="手机号" prop="receiptPresonTelephone">
          <a-input v-model="form.receiptPresonTelephone" type="text" oninput="value=value.replace(/[^\d]/g,'')" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { resetApplyBilling, submitBilling } from '@/api/invoice'
import AreaSelect from '@/components/AreaSelect'

export default {
  data() {
    return {
      visible: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      form: {
        areaCode: null,
        paymentBillCode: null,
        invoiceTitle: null,
        invoiceFileType: 1,
        invoiceTitleType: 2,
        invoiceType: 1,
        bankAccount: null,
        region: undefined,
        dutyParagraph: null,
        mobileNo: null,
        bankAddress: null,
        adrress: null,
        mail: null,
        receiptPersonName: null,
        receiptPresonTelephone: null,
        receiptAdrress: null,
        receiptProvince: null,
        receiptCity: null,
        receiptArea: null,
        bankDeposit: null
      },
      all: {},
      rules: {
        bankAccount: [{ required: true, message: '请输入开户行帐号', trigger: 'blur' }],
        areaCode: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value && value[0]?.code && value[1]?.code && value[2]?.code) {
                callback()
              } else {
                callback(new Error('请选择地址'))
              }
            },
            trigger: 'change'
          }
        ],
        invoiceTitle: [{ required: true, message: '请输入发票抬头', trigger: 'blur' }],
        bankDeposit: [{ required: true, message: '请选择开户银行', trigger: 'change' }],
        dutyParagraph: [{ required: true, message: '请输入纳税识别号', trigger: 'blur' }],
        mobileNo: [{ required: true, message: '请输入电话', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        mail: [{ required: true, message: '请输入发票邮寄地址', trigger: 'blur' }],
        receiptAdrress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        receiptPersonName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        receiptPresonTelephone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        invoiceType: [{ required: true, message: '请选择发票类型', trigger: 'blur' }]
      }
    }
  },
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  components: { AreaSelect },
  methods: {
    open() {
      this.resetApplyBilling({
        paymentBillCode: this.all.paymentBillCode,
        receiptAdrressId: this.all.receiptAdrressId
      })
    },
    async resetApplyBilling(text) {
      try {
        const data = await resetApplyBilling(text)
        if (data.code === '0') {
          const newData = JSON.parse(JSON.stringify(data))
          this.visible = true
          console.log(newData)
        }
        // this.form = data
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    },
    async submitBilling(text) {
      this.form.buyerMobile = this.form.mobileNo
      this.form.buyerBankName = this.form.bankDeposit
      this.form.buyerBankAccount = this.form.bankAccount
      const params = { ...text }
      if (this.form.areaCode) {
        const [provice, city, region] = this.form.areaCode
        params.receiptProvince = provice?.name
        params.receiptCity = city?.name
        params.receiptArea = region?.name
        params.provinceCode = provice.code
        params.cityCode = city.code
        params.areaCode = region.code
      }
      try {
        const { data } = await submitBilling(params)
        if (data.code === '0') {
          // this.$router.go(0)
          this.visible = false
        }
      } catch (err) {
        console.log(err)
      }
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.submitBilling(this.form)
        } else {
          return false
        }
      })
    }
  },
  watch: {
    visible(val, newval) {
      if (newval) {
        this.$refs.ruleForm.resetFields()
      }
    },
    deep: true
  }
}
</script>

<style lang="less" scoped>
</style>

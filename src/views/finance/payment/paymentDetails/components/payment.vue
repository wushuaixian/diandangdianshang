<template>
  <div class="appeal-manage-list">
    <a-button @click="payments" type="primary"> 付款 </a-button>
    <a-modal width="600px" id="appeal" okText="去付款" v-model="visible" title="付款" @ok="handleOk">
      <a-row style="line-height: 30px">
        <a-col :span="24">
          <a-row>
            <a-col :span="3"> 付款单号: </a-col>
            <a-col :span="20">{{ all.paymentBillCode }}</a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-row>
            <a-col :span="3"> 付款单位: </a-col>
            <a-col :span="20"> {{ all.payerAccountName }}</a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-row>
            <a-col :span="3"> 收款单位: </a-col>
            <a-col :span="20"> {{ all.payeeAccountName }} </a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-row>
            <a-col :span="3"> 付款金额: </a-col>
            <a-col :span="20"> {{ all.feeAmt }}</a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-row>
            <a-col :span="3"> 已付金额: </a-col>
            <a-col :span="20"> {{ all.paidAmt }} </a-col>
          </a-row>
        </a-col>
      </a-row>
      <div style="width: 99%; margin: 15px auto; border: 1px solid #ccc; height: 1px"></div>
      <a-row style="line-height: 30px">
        <a-row>
          <a-col :span="3">未付金额:</a-col>
          <a-col :span="20"> {{ all.abs }} </a-col>
        </a-row>
        <a-row>
          <a-col :span="4">本次支付金额:</a-col>
          <a-col style="color: red" :span="19"> {{ all.abs }} </a-col>
        </a-row>
        <a-row>
          <a-col :span="2">付款人:</a-col>
          <a-col :span="20"> {{ all.userName }} </a-col>
        </a-row>
      </a-row>

      <a-form-model
        v-show="information"
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item style="margin-left: -55px" label="是否开票">
          <a-radio-group @change="ytypeNo" v-model="invoiceTypes">
            <a-radio :value="1"> 是 </a-radio>
            <a-radio :value="0"> 否 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <div v-show="scyes">
          <header-title>
            <span>基本信息</span>
          </header-title>
          <a-form-model-item label="抬头类型">
            <a-radio-group disabled v-model="invoiceTitleType">
              <a-radio :value="1"> 个人 </a-radio>
              <a-radio :value="2"> 企业 </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="发票形式">
            <a-radio-group disabled v-model="invoiceFileType">
              <a-radio :value="1"> 纸票 </a-radio>
              <a-radio :value="2"> 电票 </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="发票类型">
            <a-radio-group v-model="form.invoiceType">
              <a-radio :value="1"> 增值税普通发票 </a-radio>
              <a-radio :value="2"> 增值税专用发票 </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <header-title>
            <span>发票信息</span>
          </header-title>
          <a-form-model-item label="开户银行" :prop="form.invoiceType === 1 ? '' : 'bankDeposit'">
            <a-input v-model="form.bankDeposit" />
          </a-form-model-item>
          <a-form-model-item ref="number" label="开户行账号" :prop="form.invoiceType === 1 ? '' : 'bankAccount'">
            <a-input v-model="form.bankAccount" type="text" oninput="value=value.replace(/[^\d]/g,'')" />
          </a-form-model-item>
          <a-form-model-item ref="rise" label="发票抬头" prop="invoiceTitle">
            <a-input v-model="form.invoiceTitle" />
          </a-form-model-item>
          <a-form-model-item ref="number1" label="纳税人识别号" prop="dutyParagraph">
            <a-input v-model="form.dutyParagraph" type="text" />
          </a-form-model-item>
          <a-form-model-item ref="number2" label="电话" :prop="form.invoiceType === 1 ? '' : 'mobileNo'">
            <a-input v-model="form.mobileNo" type="text" oninput="value=value.replace(/[^\d]/g,'')" />
          </a-form-model-item>
          <a-form-model-item ref="address" label="地址" :prop="form.invoiceType === 1 ? '' : 'detailAddress'">
            <a-input v-model="form.detailAddress" />
          </a-form-model-item>
          <header-title>
            <span>邮寄地址</span>
          </header-title>
          <a-form-model-item ref="mail" label="发票邮寄地址">
            <AreaSelect v-model="area" :selected.sync="areaCode" />
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
        </div>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { create, invoicePayment, submitBilling } from '@/api/invoice'
import AreaSelect from '@/components/AreaSelect'

export default {
  props: {
    all: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      information: true,
      scyes: true,
      visible: false,
      show: false,
      invoiceTypes: 1,
      labelCol: { span: 5 },
      wrapperCol: { span: 13 },
      bill: [],
      alsl: [],
      province: [],
      city: [],
      area: [],
      areaCode: null,
      resource: '',
      invoiceTitleType: 2,
      invoiceFileType: 1,
      form: {
        invoiceTaskId: null,
        paymentBillCode: null,
        invoiceTitle: null,
        invoiceType: null,
        bankAccount: null,
        region: undefined,
        dutyParagraph: null,
        mobileNo: null,
        detailAddress: null,
        adrress: null,
        mail: null,
        receiptPersonName: null,
        receiptPresonTelephone: null,
        receiptAdrress: null,
        receiptProvince: null,
        receiptCity: null,
        receiptArea: null
      },
      alls: {},
      rules: {
        bankDeposit: [{ required: true, message: '请输入开户银行', trigger: 'blur' }],
        bankAccount: [{ required: true, message: '请输入开户行帐号', trigger: 'blur' }],
        invoiceTitle: [{ required: true, message: '请输入发票抬头', trigger: 'blur' }],
        dutyParagraph: [{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }],
        mobileNo: [{ required: true, message: '请输入电话', trigger: 'blur' }],
        detailAddress: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        receiptPersonName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        receiptPresonTelephone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        receiptAdrress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      }
    }
  },
  components: { AreaSelect },
  methods: {
    ytypeNo(e) {
      console.log(e.target.value)
      if (e.target.value === 0) {
        this.scyes = false
      } else {
        this.scyes = true
      }
    },
    handleOk() {
      this.submitBilling(this.form)
      this.visible = false
      this.$router.push({
        name: 'FinancePaymentCashier',
        params: {
          id: this.all.sceneType,
          orderCode: this.all.paymentCode,
          paymentBalance: this.all.feeAmt,
          type: 2,
          payerType: 2,
          paymentBillCode: '1',
          mergePaymentType: 0
        }
      })
      // this.create({ id: this.all.id, paymentBillCode: this.all.paymentBillCode, isBilling: this.invoiceTypes })
    },
    payments() {
      if (this.$hasOpeerate()) {
        this.information = false
      }
      this.visible = true
      this.invoicePayment({ paymentBillCode: this.all.paymentBillCode })
    },
    async submitBilling(text) {
      this.form.buyerMobile = this.form.mobileNo
      this.form.buyerBankName = this.form.bankDeposit
      this.form.buyerBankAccount = this.form.bankAccount
      this.form.invoiceTitleType = this.invoiceTitleType
      this.form.invoiceFileType = this.invoiceFileType
      const params = { ...text }
      if (this.areaCode) {
        const [provice, city, region] = this.areaCode
        params.receiptProvince = provice?.name
        params.receiptCity = city?.name
        params.receiptArea = region?.name
        params.provinceCode = provice.code
        params.cityCode = city.code
        params.areaCode = region.code
      }
      try {
        const { data } = await submitBilling(params)
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    },
    async create(text) {
      try {
        const { data } = await create(text)
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    },
    async invoicePayment(text) {
      try {
        const data = await invoicePayment(text)
        if (data.code === '0') {
          const newData = JSON.parse(JSON.stringify(data))
          console.log(newData.data)
          if (newData.data) {
            this.form = newData.data
          }
        }
        // console.log(data)
      } catch (err) {
        console.log(err)
      }
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
</style>

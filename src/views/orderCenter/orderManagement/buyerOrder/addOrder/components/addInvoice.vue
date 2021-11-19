<template>
  <div class="add-order-add-address">
    <a-form-model
      v-show="thisform.invoiceType === 1"
      ref="addInvoiceForm1"
      :model="thisform"
      :rules="rules"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 17 }"
    >
      <a-form-model-item label="发票类型" prop="invoiceType">
        <a-radio-group v-model="thisform.invoiceType">
          <a-radio :value="1"> 普通发票 </a-radio>
          <a-radio :value="2"> 增值税发票 </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="发票抬头" prop="invoiceTitle">
        <a-input v-model="thisform.invoiceTitle" :maxLength="100" placeholder="请填写发票抬头" />
      </a-form-model-item>
      <a-form-model-item label="纳税人识别号" prop="dutyParagraph">
        <a-input v-model="thisform.dutyParagraph" :maxLength="30" placeholder="请填写纳税人识别号" />
      </a-form-model-item>
      <a-form-model-item label="地址">
        <a-input type="textarea" v-model="thisform.detailAddress" :maxLength="100" placeholder="请填写注册地址" />
      </a-form-model-item>
      <a-form-model-item label="电话">
        <a-input v-model="thisform.mobileNo" :maxLength="20" placeholder="请填写电话" />
      </a-form-model-item>
      <a-form-model-item label="开户银行">
        <a-input v-model="thisform.bankDeposit" :maxLength="50" placeholder="请填写开户支行" />
      </a-form-model-item>
      <a-form-model-item label="银行账号">
        <a-input v-model="thisform.bankAccount" :maxLength="30" placeholder="请填写开户行账户" />
      </a-form-model-item>
    </a-form-model>
    <a-form-model
      v-show="thisform.invoiceType !== 1"
      ref="addInvoiceForm2"
      :model="thisform"
      :rules="rules"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 17 }"
    >
      <a-form-model-item label="发票类型" prop="invoiceType">
        <a-radio-group v-model="thisform.invoiceType">
          <a-radio :value="1"> 普通发票 </a-radio>
          <a-radio :value="2"> 增值税发票 </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="发票抬头" prop="invoiceTitle">
        <a-input v-model="thisform.invoiceTitle" :maxLength="100" placeholder="请填写发票抬头" />
      </a-form-model-item>
      <a-form-model-item label="纳税人识别号" prop="dutyParagraph">
        <a-input v-model="thisform.dutyParagraph" :maxLength="30" placeholder="请填写纳税人识别号" />
      </a-form-model-item>
      <a-form-model-item label="地址" prop="detailAddress">
        <a-input type="textarea" v-model="thisform.detailAddress" :maxLength="100" placeholder="请填写注册地址" />
      </a-form-model-item>
      <a-form-model-item label="电话" prop="mobileNo">
        <a-input v-model="thisform.mobileNo" :maxLength="20" placeholder="请填写电话" />
      </a-form-model-item>
      <a-form-model-item label="开户银行" prop="bankDeposit">
        <a-input v-model="thisform.bankDeposit" :maxLength="50" placeholder="请填写开户支行" />
      </a-form-model-item>
      <a-form-model-item label="银行账号" prop="bankAccount">
        <a-input v-model="thisform.bankAccount" :maxLength="30" placeholder="请填写开户行账户" />
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import * as api from '@/api/orderCenter'
import * as utils from '@/api/utils'
const rules = {
  invoiceType: [{ required: true, message: '请选择发票类型', trigger: 'change' }],
  bankDeposit: [{ required: true, message: '请填写开户支行', trigger: 'change' }],
  bankAccount: [{ required: true, message: '请填写开户行账户', trigger: 'change' }],
  invoiceTitle: [{ required: true, message: '请填写发票抬头', trigger: 'change' }],
  mobileNo: [{ required: true, message: '请填写电话', trigger: 'change' }],
  dutyParagraph: [{ required: true, message: '请填写纳税人识别号', trigger: 'change' }],
  detailAddress: [{ required: true, message: '请填写注册地址', trigger: 'change' }]
}
export default {
  props: {
    form: {
      type: Object,
      default: () => ({
        id: null, // 发票信息 id
        invoiceType: 1,
        bankDeposit: '', // 开户银行
        bankAccount: '', // 开户行账户
        invoiceTitle: '', // 发票抬头
        mobileNo: '', // 电话
        dutyParagraph: '', // 纳税人识别号
        detailAddress: '' // 注册地址
      })
    }
  },
  created() {
    this.thisform = { ...this.form }
    utils.getDictionary(['TONGLIAN_BANK_LIST']).then((res) => {
      this.Dictionary.TONGLIAN_BANK_LIST = res.data['TONGLIAN_BANK_LIST']
    })
  },
  data() {
    return {
      rules,
      Dictionary: {
        TONGLIAN_BANK_LIST: []
      },
      thisform: {
        id: null, // 发票信息 id
        invoiceType: 1, // 1：普通发票 ；2 ：增值税发票
        bankDeposit: '', // 开户银行
        bankAccount: '', // 开户行账户
        invoiceTitle: '', // 发票抬头
        mobileNo: '', // 电话
        dutyParagraph: '', // 纳税人识别号
        detailAddress: '' // 注册地址
      }
    }
  },
  methods: {
    Save() {
      const type = this.thisform.invoiceType === 1 ? 'addInvoiceForm1' : 'addInvoiceForm2'
      this.$refs[type].validate((valid) => {
        if (valid) {
          api.setAddIncoice(this.thisform).then((res) => {
            if (res.code === '0') {
              this.$message.success('保存成功')
              this.$emit('update')
            }
          })
        }
      })
    }
  },
  watch: {
    'thisform.invoiceType': {
      handler() {
        // this.$refs.addInvoiceForm1.validate()
        // this.$refs.addInvoiceForm2.validate()
      },
      deep: true
    }
  }
}
</script>

<style lang="less">
.add-order-add-address {
  .ant-form {
    .ant-form-item {
      margin-bottom: 8px;
    }
  }
}
</style>

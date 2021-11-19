<template>
  <div class="appeal-manage-list">
    <a-modal okText="提交" v-model="visible" title="上传发票信息" @ok="handleOk">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="发票任务ID">
          <a-input disabled="disabled" v-model="form.invoiceTaskId" />
        </a-form-model-item>
        <a-form-model-item label="付款单号">
          <a-input disabled v-model="form.paymentBillCode" />
        </a-form-model-item>
        <a-form-model-item prop="invoiceType" label="发票类型">
          <a-radio-group disabled v-model="form.invoiceType">
            <a-radio :value="1">增值税普通发票</a-radio>
            <a-radio :value="2">增值税专用发票</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="发票形式">
          <a-radio-group disabled v-model="invoiceFileType">
            <a-radio :value="2">纸票</a-radio>
            <a-radio :value="1">电票</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="抬头类型">
          <a-radio-group disabled v-model="invoiceTitleType">
            <a-radio :value="1">企业</a-radio>
            <a-radio :value="2">个人</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <header-title>
          <span>开票信息</span>
        </header-title>
        <a-form-model-item ref="rise" label="发票抬头" prop="invoiceTitle">
          <a-input disabled v-model="form.invoiceTitle" />
        </a-form-model-item>
        <a-form-model-item ref="number1" label="纳税人识别号" prop="dutyParagraph">
          <a-input
            v-model="form.dutyParagraph"
            type="text"
            disabled
            oninput="value=value.replace(/[^\d]/g,'')"
            @blur="
              () => {
                $refs.number1.onFieldBlur()
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item ref="address" label="地址" :prop="form.invoiceType === 1 ? '' : 'detailAddress'">
          <a-input disabled v-model="form.detailAddress" />
        </a-form-model-item>
        <a-form-model-item ref="number2" label="电话" :prop="form.invoiceType === 1 ? '' : 'mobileNo'">
          <a-input v-model="form.mobileNo" disabled type="text" oninput="value=value.replace(/[^\d]/g,'')" />
        </a-form-model-item>
        <a-form-model-item label="开户银行" :prop="form.invoiceType === 1 ? '' : 'bankDeposit'">
          <a-input disabled v-model="form.bankDeposit" />
        </a-form-model-item>
        <a-form-model-item ref="number" label="开户行账户" :prop="form.invoiceType === 1 ? '' : 'bankAccount'">
          <a-input v-model="form.bankAccount" disabled type="text" oninput="value=value.replace(/[^\d]/g,'')" />
        </a-form-model-item>
        <header-title>
          <span>发票邮寄信息</span>
        </header-title>
        <a-form-model-item ref="mail" label="发票邮寄地址">
          <a-row>
            <a-col :span="7"><a-input disabled v-model="form.receiptProvince" placeholder="Basic usage" /></a-col>
            <a-col :span="7"><a-input id="Left" disabled v-model="form.receiptCity" placeholder="Basic usage" /></a-col>
            <a-col :span="7">
              <a-input id="Lefts" disabled v-model="form.receiptArea" placeholder="Basic usage" />
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item ref="number4" label="详细地址" prop="receiptAdrress">
          <a-input disabled v-model="form.receiptAdrress" type="text" />
        </a-form-model-item>
        <a-form-model-item ref="contacts" label="收件人" prop="receiptPersonName">
          <a-input disabled v-model="form.receiptPersonName" />
        </a-form-model-item>
        <a-form-model-item ref="number3" label="电话" prop="receiptPresonTelephone">
          <a-input
            disabled
            v-model="form.receiptPresonTelephone"
            type="text"
            oninput="value=value.replace(/[^\d]/g,'')"
          />
        </a-form-model-item>
        <a-form-model-item ref="number4" label="发票金额(元)" prop="invoiceAmount">
          <a-input disabled v-model="form.invoiceAmount" type="text" oninput="value=value.replace(/[^\d]/g,'')" />
        </a-form-model-item>
        <a-form-model-item ref="number4" label="发票代码" prop="invoiceCode">
          <a-input
            v-model="form.invoiceCode"
            @input="changeCode"
            type="tel"
            oninput="value=value.replace(/[^\d]/g,'')"
          />
        </a-form-model-item>
        <a-form-model-item ref="number4" label="发票号码" prop="invoiceNo">
          <a-input
            v-model="form.invoiceNo"
            @input="changeNums"
            type="text"
            oninput="value=value.replace(/[^\d]/g,'')"
          />
        </a-form-model-item>
        <!-- <a-form-model-item label="物流信息">
          <a-select v-model="form.expressCompanyName" :placeholder="form.invoiceType === 1 ? '' : '请选择物流信息'">
            <a-select-option value="shanghai">请选择物流信息</a-select-option>
          </a-select>
        </a-form-model-item>-->
        <a-form-model-item label="物流信息" prop="likeName">
          <a-select
            v-model="form.likeName"
            show-search
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            @search="handleSearch"
            placeholder="请选择物流信息"
            :allowClear="true"
            :getPopupContainer="
              (triggerNode) => {
                return triggerNode.parentNode || document.body
              }
            "
          >
            <a-select-option
              @click="handleChange(item)"
              v-for="item in searchMerchantLis"
              :key="item.value"
              :value="item.deliveryCompanyName"
            >
              {{ item.deliveryCompanyName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="number5" label="运货单号" prop="expressNumber">
          <a-input v-model="form.expressNumber" type="text" />
        </a-form-model-item>
        <a-form-model-item label="备注">
          <a-input v-model="form.remark" type="textarea" />
        </a-form-model-item>
        <a-form-model-item prop="fileDTOList" label="上传文件">
          <div class="content">
            <s-upload
              v-model="form.url"
              action="/api/back-manage-web/media/uploadFile"
              class="supload"
              list-type="picture"
              name="Filedata"
            >
              <a-button style="width: 152px"> <a-icon type="upload" />上传发票 </a-button>
            </s-upload>
            <div class="other">支持格式：PDF、png、jpg格式</div>
          </div>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { clickBilling, billing, merchantExpressConfig, findInvoiceListExpress } from '@/api/invoice'
import AreaSelect from '@/components/AreaSelect'
import _ from 'loadsh'
export default {
  data() {
    return {
      dataList: '',
      searchMerchantLis: [], // 搜索下拉框值，
      visible: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      all: [],
      bill: [],
      province: [],
      city: [],
      area: [],
      areaCode: null,
      invoiceTitleType: 1,
      invoiceFileType: 2,
      deliveryCompanyId: '',
      form: {
        likeName: '',
        url: null,
        invoiceTaskId: null,
        receiptBillCode: null,
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
        invoiceCode: null,
        invoiceAmount: null,
        invoiceNo: null,
        expressNumber: null,
        receiptAdrress: null,
        receiptProvince: null,
        receiptCity: null,
        receiptArea: null
      },
      rules: {
        bankAccount: [{ required: true, message: '请输入开户行帐号', trigger: 'blur' }],
        invoiceTitle: [{ required: true, message: '请输入发票抬头', trigger: 'blur' }],
        bankDeposit: [{ required: true, message: '请选择开户银行', trigger: 'change' }],
        dutyParagraph: [{ required: true, message: '请输入纳税识别号', trigger: 'blur' }],
        mobileNo: [{ required: true, message: '请输入电话', trigger: 'blur' }],
        detailAddress: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        receiptPersonName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        invoiceAmount: [{ required: true, message: '请输入发票金额', trigger: 'blur' }],
        expressNumber: [{ required: true, message: '请输入运货单号', trigger: 'blur' }],
        invoiceCode: [{ required: true, message: '请输入发票代码', trigger: 'blur' }],
        invoiceNo: [{ required: true, message: '请输入发票号码', trigger: 'blur' }],
        invoiceType: [{ required: true, message: '请选择发票类型', trigger: 'blur' }],
        likeName: [{ required: true, message: '请选择物流信息', trigger: 'blur' }],
        receiptAdrress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        fileDTOList: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.form.url) {
                callback()
              } else {
                callback(new Error('请上传文件'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  components: { AreaSelect },
  mounted() {
    // this.findInvoiceListExpress()
  },
  methods: {
    handleChange(value) {
      this.deliveryCompanyId = value.deliveryCompanyId
    },
    init(data) {
      console.log(data)
      this.dataList = data
      this.clickBilling({ invoiceId: this.dataList.id })
      // this.visible = true
      this.findInvoiceListExpress()
    },
    async findInvoiceListExpress() {
      // const { form } = this
      const data2 = await findInvoiceListExpress({ likeName: '' })
      // console.log(data2.data.slice(0, 100))
      this.searchMerchantLis = data2.data.slice(0, 100)

      return data2
    },
    handleSearch(likeName) {
      if (!likeName.trim()) return
      _.debounce(async () => {
        const res = await findInvoiceListExpress({ likeName })
        if (res.code === '0') {
          this.searchMerchantLis = res?.data.slice(0, 100)
        }
      }, 1000)()
    },
    changeCode() {
      // 限制长度
      if (this.form.invoiceCode.length > 10) {
        this.form.invoiceCode = this.form.invoiceCode.slice(0, 10)
      }
    },
    changeNums() {
      if (this.form.invoiceNo.length > 8) {
        this.form.invoiceNo = this.form.invoiceNo.slice(0, 8)
      }
    },
    async clickBilling(text) {
      try {
        const data = await clickBilling(text)
        if (data.code === '0') {
          const newData = JSON.parse(JSON.stringify(data))
          this.visible = true
          this.form = newData.data
        }
        // console.log(data)
      } catch (err) {
        console.log(err)
      }
    },
    async billing(text) {
      this.form.invoiceMoneyAmount = this.form.invoiceAmount
      this.form.invoiceFileType = this.invoiceFileType
      this.form.invoiceTitleType = this.invoiceTitleType
      this.form.deliveryCompanyId = this.deliveryCompanyId
      const params = { ...text }
      if (this.areaCode) {
        const [provice, city, region] = this.areaCode
        params.receiptProvince = provice?.name
        params.receiptCity = city?.name
        params.receiptArea = region?.name
      }
      try {
        const data = await billing(params)
        if (data.code === '0') {
          this.visible = false
          this.$router.go(0)
        }
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    },
    async merchantExpressConfig() {
      try {
        const data = await merchantExpressConfig()
        if (data.code === '0') {
          console.log(data)
        }
      } catch (err) {
        console.log(err)
      }
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.billing(this.form)
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
#Left {
  margin-left: 10px;
}
#Lefts {
  margin-left: 20px;
}
</style>

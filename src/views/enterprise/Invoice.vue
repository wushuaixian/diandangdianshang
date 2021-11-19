<template>
  <div class="invoice">
    <a-form-model ref="form" :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 10 }" :rules="rulesForm">
      <header-title>
        <span>发票信息</span>
      </header-title>
      <a-form-model-item label="发票抬头" prop="invoiceTitle">
        <!-- <a-input placeholder="请输入发票抬头" v-model="form.invoiceTitle"></a-input> -->
        <d-select
          class="selsct-font"
          show-search
          v-model="form.invoiceTitle"
          placeholder="请输入企业名称进行查询"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          @search="handleSearch"
          :token-separators="[',']"
          mode="combobox"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="d in comList" :value="d.companyName" :key="d.companyName">
            {{ d.companyName }}
          </a-select-option>
        </d-select>
      </a-form-model-item>
      <a-form-model-item label="税号" prop="dutyParagraph">
        <a-input placeholder="请输入税号" v-model="form.dutyParagraph"></a-input>
      </a-form-model-item>
      <!-- <a-form-model-item label="注册地址" prop="registerAddressCode">
        <AreaSelect :selected.sync="form.registerAddress" v-model="form.registerAddressCode" />
      </a-form-model-item> -->
      <a-form-model-item label="详细地址" prop="detailAddress">
        <a-input placeholder="请输入详细地址" v-model="form.detailAddress"></a-input>
      </a-form-model-item>
      <a-form-model-item label="开户银行" prop="bankDeposit">
        <a-input placeholder="请输入开户银行" v-model="form.bankDeposit"></a-input>
      </a-form-model-item>
      <a-form-model-item label="账号" prop="bankAccount">
        <a-input placeholder="请输入账号" v-model="form.bankAccount"></a-input>
      </a-form-model-item>
      <a-form-model-item label="电话号码" prop="mobileNo">
        <a-input placeholder="请输入电话号码" v-model="form.mobileNo"></a-input>
      </a-form-model-item>
      <header-title>
        <span>收票地址</span>
      </header-title>
      <a-form-model-item label="收票地址" prop="receiveAdressCode">
        <AreaSelect :selected.sync="form.receiveAdress" v-model="form.receiveAdressCode" />
      </a-form-model-item>
      <a-form-model-item label="详细地址" prop="receiveAdressDetail">
        <a-input placeholder="请输入详细地址" v-model="form.receiveAdressDetail"></a-input>
      </a-form-model-item>
      <a-form-model-item label="收票人" prop="receivePersonName">
        <a-input placeholder="请输入收票人" v-model="form.receivePersonName"></a-input>
      </a-form-model-item>
      <a-form-model-item label="联系电话" prop="receivePersonMobile">
        <a-input placeholder="请输入联系电话" v-model.number="form.receivePersonMobile"></a-input>
      </a-form-model-item>
    </a-form-model>
    <fixed-box>
      <a-button type="primary" @click="handleSave">保存</a-button>
    </fixed-box>
  </div>
</template>

<script>
import { AreaSelect } from '@/components'
import { addOrUpdateInvoice, getInvoiceDetail } from '@/api/enterprise'
import { companyQuery } from '@/api/user'
import _ from 'loadsh'
export default {
  components: { AreaSelect },
  data() {
    const registerAddressCodefun = (rule, value, callback) => {
      if (this.form.registerAddressCode.length < 3) {
        return callback(new Error('请选择注册地址'))
      } else {
        callback()
      }
    }
    const registerAddressCodefuns = (rule, value, callback) => {
      if (this.form.receiveAdressDetail.length < 3) {
        return callback(new Error('请选择详细地址'))
      } else {
        callback()
      }
    }
    return {
      form: {
        registerAddressCode: []
      },
      rulesForm: {
        invoiceTitle: [{ required: true, message: '请输入发票抬头' }],
        dutyParagraph: [{ required: true, message: '请输入税号' }],
        registerAddressCode: [{ required: true, message: '请选择注册地址', validator: registerAddressCodefun }],
        detailAddress: [{ required: true, message: '请输入详细地址' }],
        bankDeposit: [{ required: true, message: '请输入开户银行' }],
        bankAccount: [{ required: true, message: '请输入开户账号' }],
        mobileNo: [{ required: true, message: '请输入电话号码' }],
        receiveAdressCode: [{ required: true, message: '请输入收票地址' }],
        receiveAdressDetail: [{ required: true, message: '请选择详细地址', validator: registerAddressCodefuns }],
        receivePersonName: [{ required: true, message: '请输入收票人' }],
        receivePersonMobile: [{ required: true, message: '请输入联系电话' }]
      },
      comList: [],
      fetching: false
    }
  },
  mounted() {
    this.getInvoiceDetail()
    this.handleSearch = _.debounce(this.handleSearch, 500)
  },
  methods: {
    async handleSearch(value) {
      this.fetching = true
      const res = await companyQuery(value).finally(() => (this.fetching = false))
      if (res.code === '0') {
        const list = res?.data?.yiDunResponseDataObject?.queryResult?.items
        if (list?.length > 0) {
          this.comList = list
        }
      }
    },
    async getInvoiceDetail() {
      const res = await getInvoiceDetail()
      if (res.code === '0' && res.data) {
        const {
          provinceCode,
          cityCode,
          regionCode,
          receiveAdressProvinceCode,
          receiveAdressCityCode,
          receiveAdressAreaCode
        } = res.data
        this.form = res.data
        this.form.registerAddressCode = [Number(provinceCode), Number(cityCode), Number(regionCode)]
        this.form.receiveAdressCode = [
          Number(receiveAdressProvinceCode),
          Number(receiveAdressCityCode),
          Number(receiveAdressAreaCode)
        ]
      }
    },
    async handleSave() {
      console.log(this.form)
      await this.$refs.form.validate()
      const data = { ...this.form }

      if (data.registerAddress?.length >= 3) {
        const [province, city, region] = data.registerAddress
        if (province) {
          data.provinceCode = province?.code
          data.provinceName = province?.name
        }
        if (city) {
          data.cityCode = city?.code
          data.cityName = city?.name
        }
        if (region) {
          data.regionCode = region?.code
          data.regionName = region?.name
        }
      }
      if (data.receiveAdress?.length >= 3) {
        const [province, city, region] = data.receiveAdress
        if (province) {
          data.receiveAdressProvinceCode = province?.code
          data.receiveAdressProvince = province?.name
        }
        if (city) {
          data.receiveAdressCityCode = city?.code
          data.receiveAdressCity = city?.name
        }
        if (region) {
          data.receiveAdressAreaCode = region?.code
          data.receiveAdressArea = region?.name
        }
      }
      // data.bankAccount = data.bankAccount + ''
      const res = await addOrUpdateInvoice({ ...data })
      if (res.code === '0') {
        this.$message.success('保存成功')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.invoice {
  .head-title {
    margin-bottom: 20px;
  }
}
</style>

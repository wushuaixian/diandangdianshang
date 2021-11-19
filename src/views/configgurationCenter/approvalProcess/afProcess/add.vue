<template>
  <a-modal title="新增审批流" :visible="visible" :maskClosable="false" @ok="handleOk" @cancel="handleCancel">
    <a-form-model ref="form" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="审批形式" prop="auditType">
        <d-select :options="auditTypeList" v-model="form.auditType"></d-select>
      </a-form-model-item>
      <a-form-model-item label="所属平台" prop="platformId" v-if="$hasOpeerate()">
        <d-select :options="platformList" v-model="form.platformId" @change="handleChange"></d-select>
      </a-form-model-item>
      <a-form-model-item label="所属机构" prop="merchant">
        <d-select
          :options="merchantList"
          :label-in-value="true"
          v-model="form.merchant"
          show-search
          @change="merchantChange"
          :filterOption="handleFetch"
          :disabled="!$hasOpeerate()"
        ></d-select>
      </a-form-model-item>
      <a-form-model-item label="适用模块" prop="model">
        <d-select :options="modelList" @change="handleModel" v-model="form.model"></d-select>
      </a-form-model-item>
      <a-form-model-item label="审批单据" prop="typeCode">
        <d-select :options="typeCodeList" v-model="form.typeCode"></d-select>
      </a-form-model-item>
      <a-form-model-item label="审批流名称" prop="name">
        <a-input placeholder="请输入" v-model="form.name" :maxLength="20"></a-input>
      </a-form-model-item>
      <a-form-model-item label="备注" prop="remark">
        <a-textarea
          v-model="form.remark"
          placeholder="请输入"
          :maxLength="100"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { auditTypeList, platformList } from '@/config/constant'
import {
  addAfProcess,
  getListMulti,
  getCompanyInfos,
  getModelTypeList
} from '@/api/configgurationCenter/approvalProcess'
import { mapState } from 'vuex'
import { getSupplierMerchant, getProviderMerchant } from '@/api/projectCarry'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      auditTypeList: auditTypeList.filter((x) => x.value),
      platformList: platformList.filter((x) => x.value),
      rules: {
        auditType: [{ required: true, message: '请选择审批形式', trigger: 'change' }],
        platformId: [{ required: true, message: '请选择所属平台', trigger: 'change' }],
        merchant: [{ required: true, message: '请选择所属机构', trigger: 'change' }],
        model: [{ required: true, message: '请选择适用模块', trigger: 'change' }],
        name: [{ required: true, message: '请输入审批流名称', trigger: 'change' }],
        typeCode: [{ required: true, message: '请选择审批流单据', trigger: 'change' }]
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      form: {},
      merchantList: [],
      ListMulti: [
        { value: 'APPDFLOW_MODEL_PLAT', label: 1 },
        { value: 'APPDFLOW_MODEL_PURCHASE', label: 7 },
        { value: 'APPDFLOW_MODEL_SUPPLIER', label: 6 }
      ],
      modelList: [],
      typeCodeList: []
    }
  },
  mounted() {
    if (!this.$hasOpeerate()) {
      this.getSupplierMerchant()
      this.getListMulti()
      this.form.platformId = this.isPlatform // 采购商、供应商直接读取
    }
  },
  computed: {
    ...mapState({
      isPlatform: (state) => state.permission.isPlatform
    })
  },

  methods: {
    async getSupplierMerchant() {
      const res = this.$hasSuppliers() ? await getProviderMerchant() : await getSupplierMerchant()
      if (res.code === '0') {
        this.merchantList = res.data.map((x) => {
          return {
            value: x.merchantId,
            key: x.merchantId,
            label: x.merchantName
          }
        })
        const [merchant] = this.merchantList
        this.form.merchant = merchant
      }
    },
    async getListMulti(platformId) {
      const { ListMulti, isPlatform } = this
      const label = platformId || isPlatform
      const key = ListMulti.find((x) => x.label === label)?.value
      const data = { categories: [key] }
      const res = await getListMulti(data)
      if (res.code === '0') {
        this.modelList =
          res?.data[key]?.map((x) => {
            return {
              label: x?.name,
              value: x?.code
            }
          }) || []
      }
    },
    async handleChange(platformId) {
      delete this.form.merchant
      delete this.form.model
      delete this.form.typeCode
      this.typeCodeList = []
      this.getComList(platformId)
      this.getListMulti(platformId)
    },
    merchantChange() {
      delete this.form.model
      delete this.form.typeCode
      this.getListMulti(this.form.platformId)
      this.typeCodeList = []
    },
    async handleModel() {
      const {
        form: { platformId, model }
      } = this
      delete this.form.typeCode
      const res = await getModelTypeList({ platformId, model })
      if (res.code === '0') {
        this.typeCodeList =
          res?.data?.map((x) => {
            return {
              label: x?.name,
              value: x?.code
            }
          }) || []
      }
    },
    async getComList(platformId) {
      const res = await getCompanyInfos(platformId)
      if (res.code === '0') {
        this.merchantList = res?.data?.merchantList?.map((x) => {
          return {
            label: x?.orgName,
            value: x?.id
          }
        })
      }
    },
    handleFetch(inputValue, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
    },
    async handleOk() {
      await this.$refs.form.validate()
      const { form } = this
      const data = { ...form }
      const { label: merchantName, key: merchantId } = data.merchant
      const res = await addAfProcess({ ...data, merchantName, merchantId })
      if (res.code === '0') {
        this.$emit('ok')
        this.$emit('update:visible', false)
      }
    },
    handleCancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less" scoped>
</style>

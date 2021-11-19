<template>
  <div class="table-page-search-wrapper-custom">
    <a-form-model
      layout="inline"
      ref="form"
      :model="queryParam"
      v-bind="{
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
      }"
    >
      <a-row :gutter="48">
        <a-col :md="8" :sm="24">
          <a-form-model-item label="公司名称" prop="buyerMerchantIds">
            <d-select
              :allowClear="false"
              :options="merchantList"
              mode="multiple"
              v-model="queryParam.buyerMerchantIds"
              @change="onchange"
            />
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="申请组织" prop="applyDepartment">
            <a-input v-model="queryParam.applyDepartment" />
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="采购申请编号" prop="buyerPlanCode">
            <a-input v-model="queryParam.buyerPlanCode" />
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="物料编码" prop="materialCode">
            <a-input v-model="queryParam.materialCode" />
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="物料名称" prop="materialName">
            <a-input v-model="queryParam.materialName" />
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="规格型号" prop="materialModel">
            <a-input v-model="queryParam.materialModel" />
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="计划编号" prop="planItemCode">
            <a-input v-model="queryParam.planItemCode" />
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="合同编号" prop="contractCode">
            <a-input v-model="queryParam.contractCode" />
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="订单编号" prop="orderCode">
            <a-input v-model="queryParam.orderCode" />
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="采购员" prop="buyerUserName">
            <a-input v-model="queryParam.buyerUserName"></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="计划项目编码" prop="planProjectItemCode">
            <a-input v-model="queryParam.planProjectItemCode" />
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="计划项目名称" prop="planProjectItemName">
            <a-input v-model="queryParam.planProjectItemName" />
          </a-form-model-item>
        </a-col>

        <a-col :md="24" :sm="24">
          <div class="button">
            <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
            <a-button type="primary" @click="handleSearch">查询</a-button>
          </div>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import { getSupplierMerchant } from '@/api/projectCarry'
export default {
  props: {
    identityCardName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      info: {},
      merchantList: [],
      queryParam: {
        buyerMerchantIds: [],
        buyerUserName: this.identityCardName || ''
      }
    }
  },
  watch: {
    implementActive(val) {
      this.handleSearch()
    }
  },
  async mounted() {
    await this.getSupplierMerchant()
  },
  methods: {
    onchange(e) {
      this.queryParam.buyerMerchantIds = e
      this.handleSearch()
    },
    async getSupplierMerchant() {
      const res = await getSupplierMerchant()
      if (res.code === '0') {
        this.merchantList = res.data.map((x) => {
          return {
            value: x.merchantId,
            label: x.merchantName
          }
        })
        this.queryParam.buyerMerchantIds = [this.merchantList[0]?.value]
        this.handleSearch()
      }
    },
    handleReset() {
      this.$refs.form.resetFields()
      this.getSupplierMerchant()
    },
    handleSearch() {
      this.$emit('search', { ...this.queryParam })
    }
  }
}
</script>

<style lang="less" scoped>
</style>

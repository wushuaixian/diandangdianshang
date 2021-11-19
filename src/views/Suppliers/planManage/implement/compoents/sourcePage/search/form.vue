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
          <a-form-model-item label="采购申请编号" prop="buyerPlanId">
            <a-input v-model="queryParam.buyerPlanId" />
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
          <a-form-model-item label="寻源方式" prop="searchManner">
            <d-select :options="manageList" v-model="queryParam.searchManner"></d-select>
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="采购项目编号" prop="buyerProjectCode">
            <a-input v-model="queryParam.buyerProjectCode" />
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="采购员" prop="buyerUserName">
            <a-input v-model="queryParam.buyerUserName"></a-input>
            <!-- <d-select
              v-model="queryParam.searchSource"
              :options="[
                { label: '本人', value: 1 },
                { label: '本部门', value: 2 }
              ]"
            ></d-select> -->
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="寻源状态" prop="status">
            <d-select :options="statusList" v-model="queryParam.status"></d-select>
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="计划编号" prop="planItemCode">
            <a-input v-model="queryParam.planItemCode" />
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
import { getSupplierMerchant, getMultiList } from '@/api/projectCarry'
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
      manageList: [],
      statusList: [],
      queryParam: {
        buyerMerchantIds: [],
        buyerUserName: this.identityCardName || ''
      },
      InstancyOptions: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '否',
          value: '0'
        },
        {
          label: '是',
          value: '1'
        }
      ]
    }
  },
  mounted() {
    this.getSupplierMerchant()
    this.getMultiList()
  },
  methods: {
    onchange(e) {
      this.handleSearch()
    },
    async getMultiList() {
      const res = await getMultiList({ categories: ['SEARCH_MANAGE', 'SEARCH_STATUS'] })
      if (res.code === '0') {
        this.manageList = res.data?.SEARCH_MANAGE.filter((x) => x.code !== '3')?.map((x) => {
          return {
            label: x.name,
            value: x.code
          }
        })
        this.statusList = res?.data?.SEARCH_STATUS?.map((x) => {
          return {
            label: x.name,
            value: x.code
          }
        })
      }
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
      this.$emit('search', this.queryParam)
    }
  }
}
</script>

<style lang="less" scoped>
</style>

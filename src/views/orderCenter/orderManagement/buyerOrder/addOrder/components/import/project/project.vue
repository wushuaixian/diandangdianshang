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
          <a-form-model-item label="项目编码" prop="buyerProjectCode">
            <a-input v-model="queryParam.buyerProjectCode" placeholder="请输入项目编码查询" />
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="项目名称" prop="buyerProjectName">
            <a-input v-model="queryParam.buyerProjectName" placeholder="请输入项目名称查询" />
          </a-form-model-item>
        </a-col>
        <!-- <a-col :md="8" :sm="24">
          <a-form-model-item label="供应商">
            <a-select
              :key="selectKey"
              allowClear
              :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              show-search
              placeholder="请输入供应商名称查询"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              @search="handleSearchInput"
              @change="
                (v) => {
                  queryParam.providerMerchantId = v
                }
              "
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="item in supList" :key="item.orgName" :value="item.id">
                {{ item.orgName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col> -->
        <a-col :md="24" :sm="24">
          <div class="button">
            <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
            <a-button type="primary" @click="handleSearch">查询</a-button>
          </div>
        </a-col>
      </a-row>
    </a-form-model>
    <br />
    <s-table
      ref="table"
      name="contractTables"
      v-if="queryParam.providerMerchantId"
      rowKey="id"
      :data="init"
      :columns="columns"
    >
      <template v-slot:action="props">
        <a type="link" @click="handleSelect(props)"> 选择 </a>
      </template>
    </s-table>
    <MaterialTable
      :selectParams="selectParams"
      :visible.sync="showMaterial"
      :contractPurchaseSignId="contractPurchaseSignId"
      :buyerProjectCode="buyerProjectCode"
      :buyerProjectName="buyerProjectName"
      @ok="(list) => handleMaterialOk(list)"
    />
  </div>
</template>

<script>
import MaterialTable from './material.vue'
import { queryContractPurchaseSign } from '@/api/salescontract'
import { searchCom } from '@/api/contract'
let timeout
export default {
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    selectParams: {
      type: Object,
      default: () => []
    }
  },
  components: { MaterialTable },
  data() {
    return {
      selectKey: 1,
      fetching: false,
      supList: [],
      columns: [
        { title: '供应商', dataIndex: 'providerMerchantName', key: 'providerMerchantName' },
        { title: '项目编码', dataIndex: 'buyerProjectCode', key: 'buyerProjectCode' },
        { title: '项目名称', dataIndex: 'buyerProjectName', key: 'buyerProjectName' },
        { key: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right' }
      ],
      showMaterial: false,
      contractPurchaseSignId: null,
      buyerProjectCode: '',
      buyerProjectName: '',
      queryParam: {
        buyerProjectCode: '',
        buyerProjectName: '',
        businessName: '',
        buyerMerchantIds: [],
        complaintStatus: '',
        providerMerchantIds: [],
        providerMerchantId: ''
      }
    }
  },
  mounted() {
    this.queryParam.providerMerchantId = this.form.merchantId
  },
  methods: {
    async init(params) {
      const { queryParam } = this
      const data = {
        ...params,
        ...queryParam,
        flag: true
      }
      data.providerMerchantIds = []
      return queryContractPurchaseSign({ ...data })
    },

    handleSearchInput(value) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      this.fetching = true
      this.supList = []
      timeout = setTimeout(() => {
        searchCom(value).then((ret) => {
          this.fetching = false
          this.supList = ret.data.providerMerchantList
        })
      }, 300)
    },
    handleSelect(item) {
      this.contractPurchaseSignId = item?.id
      this.buyerProjectCode = item?.buyerProjectCode
      this.buyerProjectName = item?.buyerProjectName
      this.showMaterial = true
    },
    handleMaterialOk(list) {
      this.showMaterial = false
      this.$emit('ok', list)
    },
    handleReset() {
      this.selectKey++
      this.$refs.form.resetFields()
      // this.queryParam.providerMerchantId = this.form.merchantId
    },
    handleSearch() {
      this.$refs.table.refresh(true)
    }
  }
}
</script>

<style lang="less" scoped>
</style>

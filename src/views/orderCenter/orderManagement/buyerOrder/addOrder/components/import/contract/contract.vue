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
          <a-form-model-item label="合同编号" prop="code">
            <a-input v-model="queryParam.code" placeholder="请输入合同编号查询" />
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="合同类型" prop="contractType">
            <d-select
              v-model="queryParam.contractType"
              placeholder="请选择合同类型"
              :options="contractTypeList"
            ></d-select>
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="合同名称" prop="name">
            <a-input v-model="queryParam.name" placeholder="请输入合同名称查询" />
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
    <br />
    <s-table
      v-if="queryParam.providerMerchantId"
      ref="table"
      name="contractTables"
      rowKey="id"
      :data="init"
      :columns="columns"
      :scroll="{ x: 1500, y: 400 }"
    >
      <template v-slot:effectiveTime="effectiveTime">
        {{ effectiveTime | moment('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-slot:expireTime="expireTime">
        {{ expireTime | moment('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-slot:action="props">
        <a type="link" @click="handleSelect(props)"> 选择 </a>
      </template>
    </s-table>
    <MaterialTable
      :selectParams="selectParams"
      :visible.sync="showMaterial"
      :contractId="contractId"
      :contractName="contractName"
      :contractCode="contractCode"
      :contractType="contractType"
      :contractTypeName="contractTypeName"
      @ok="(list) => handleMaterialOk(list)"
    />
  </div>
</template>

<script>
import MaterialTable from './material.vue'
import { myContract } from '@/api/projectCarry'

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
      contractTypeList: [
        { label: '全部', value: '' },
        { label: '长协', value: '1' },
        { label: '零采', value: '2' }
      ],
      columns: [
        { title: '合同编号', width: 150, dataIndex: 'code', key: 'code' },
        { title: '合同名称', width: 150, dataIndex: 'name', key: 'name' },
        {
          title: '合同类型',
          dataIndex: 'contractTypeName',
          key: 'contractTypeName',
          width: 100
        },
        { title: '合同金额(元)', width: 150, dataIndex: 'amount', key: 'amount' },
        { title: '供应商名称', width: 300, dataIndex: 'providerMerchantName', key: 'providerMerchantName' },
        {
          title: '合同签订日期',
          width: 200,
          dataIndex: 'effectiveTime',
          key: 'effectiveTime',
          scopedSlots: { customRender: 'effectiveTime' }
        },
        {
          title: '合同截止日期',
          width: 200,
          dataIndex: 'expireTime',
          key: 'expireTime',
          scopedSlots: { customRender: 'expireTime' }
        },
        { key: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right' }
      ],
      showMaterial: false,
      contractId: null,
      contractName: '',
      contractCode: '',
      contractType: '',
      contractTypeName: '',
      queryParam: {
        name: '',
        code: '',
        contractType: undefined,
        providerMerchantId: ''
      }
    }
  },
  mounted() {
    this.queryParam.providerMerchantId = this.form.merchantId
  },
  methods: {
    async init(params) {
      const data = {
        ...params,
        ...this.queryParam,
        flag: true
      }
      const contractList = await myContract({ ...data })
      return contractList
    },
    handleSelect(item) {
      this.contractId = item?.id
      this.contractName = item?.name
      this.contractCode = item?.code
      this.contractType = item?.contractType
      this.contractTypeName = item?.contractTypeName
      this.showMaterial = true
    },
    handleMaterialOk(list) {
      this.showMaterial = false
      this.$emit('ok', list)
    },
    handleReset() {
      this.$refs.form.resetFields()
    },
    handleSearch() {
      this.$refs.table.refresh(true)
    }
  }
}
</script>

<style lang="less" scoped>
</style>

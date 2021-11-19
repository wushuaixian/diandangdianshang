<template>
  <div class="select-contract" ref="contract">
    <a-modal
      destroyOnClose
      :getContainer="() => this.$refs.contract"
      width="1000px"
      title="选择合同"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
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
              <a-form-model-item label="供应商" prop="providerMerchantName">
                <a-input placeholder="请输入供应商" v-model="queryParam.providerMerchantName"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="合同编号" prop="code">
                <a-input v-model="queryParam.code" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="合同类型" prop="contractType">
                <d-select v-model="queryParam.contractType" :options="contractTypeList"></d-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="合同签订日期" prop="time">
                <a-range-picker v-model="queryParam.time" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="合同截止日期" prop="time1">
                <a-range-picker v-model="queryParam.time1" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="合同状态" prop="status">
                <d-select v-model="queryParam.status" :options="statusList"></d-select>
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
        <s-table
          ref="table"
          name="contractTables"
          rowKey="id"
          :data="getList"
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
      </div>
      <MaterialTable :visible.sync="showMaterial" :contractId="$$(contractInfo, 'id')" @ok="handleMaterialOk" />
    </a-modal>
  </div>
</template>

<script>
import { myContract } from '@/api/projectCarry'
import MaterialTable from './materialTable.vue'
import { instancyList } from '@/config/constant'
export default {
  components: { MaterialTable },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number],
      default: ''
    },
    buyerMerchantIds: {
      type: [String, Number, Array],
      default: ''
    }
  },
  data() {
    return {
      contractInfo: null,
      showMaterial: false,
      confirmLoading: false,
      queryParam: {
        status: '6',
        time: [],
        time1: []
      },
      contractTypeList: [
        { label: '全部', value: '' },
        { label: '长协', value: '1' },
        { label: '零采', value: '2' }
      ],
      statusList: [
        { label: '全部', value: '' },
        { label: '已生效', value: '6' },
        { label: '已失效', value: '7' }
      ],
      columns: [
        { title: '合同编号', width: 150, dataIndex: 'code', key: 'code' },
        {
          title: '合同类型',
          dataIndex: 'contractTypeName',
          key: 'contractTypeName',
          width: 100
        },
        {
          title: '是否框架合同',
          dataIndex: 'frameBuyer',
          key: 'frameBuyer',
          width: 120,
          customRender: (text) => {
            return instancyList?.find((x) => x.value === text)?.label
          },
          show: true
        },
        { title: '供应商', width: 300, dataIndex: 'providerMerchantName', key: 'providerMerchantName' },
        {
          title: '合同生效日期',
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
        { title: '合同有效期(天)', width: 200, dataIndex: 'indate', key: 'indate' },
        {
          title: '履行状态',
          dataIndex: 'status',
          width: 100,
          key: 'status',
          customRender: (text) => {
            return this.statusList?.find((x) => x.value === text)?.label
          }
        },
        { title: '签订人', width: 120, dataIndex: 'createUsername', key: 'createUsername' },
        { key: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right' }
      ]
    }
  },
  watch: {
    showMaterial(val) {
      if (!val) {
        this.selectedRowKeys = []
      }
    }
  },
  methods: {
    handleChange(selectRowsKeys, selectRows) {
      this.selectedRowKeys = selectRowsKeys
      const [item] = selectRows
      if (item?.contractType === 1 && item?.frameBuyer === 1) {
        return
      }
      this.showMaterial = true
      this.contractInfo = item
    },
    async getList(page) {
      const { queryParam, buyerMerchantIds } = this
      const data = {
        ...page,
        ...queryParam,
        buyerMerchantIds
      }
      if (data.time) {
        const [effectiveTimeBegin, effectiveTimeEnd] = data.time
        data.effectiveTimeBegin = effectiveTimeBegin
        data.effectiveTimeEnd = effectiveTimeEnd
      }
      if (data.time1) {
        const [expireTimeBegin, expireTimeEnd] = data.time1
        data.expireTimeBegin = expireTimeBegin
        data.expireTimeEnd = expireTimeEnd
      }
      return myContract(data)
    },
    handleReset() {
      this.$refs.form.resetFields()
    },
    handleSearch() {
      this.$refs.table.refresh(true)
    },
    handleCancel() {
      this.$emit('update:visible', false)
    },
    handleMaterialOk(info) {
      const { contractInfo } = this
      this.$emit('ok', { matereialInfo: info, contractInfo })
      this.handleCancel()
    },
    handleOk() {
      const { contractInfo } = this
      if (!contractInfo) {
        this.$message.warning('请选择合同')
        return
      }
      this.$emit('ok', { contractInfo })
      this.handleCancel()
    },
    handleSelect(item) {
      this.contractInfo = item
      if (item?.contractType === 1 && item?.frameBuyer === 1) {
        this.handleOk()
        return
      }
      this.showMaterial = true
    }
  }
}
</script>

<style lang="less" scoped>
.select-contract {
  .s-table {
    margin-top: 20px;
    .ant-table-body {
      max-width: 500px;
      overflow: auto;
    }
    .ant-table-fixed {
      .ant-table-row {
        height: auto !important;
      }
    }
  }
}
</style>

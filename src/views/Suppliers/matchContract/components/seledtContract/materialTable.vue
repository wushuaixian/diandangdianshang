<template>
  <div class="material-table" ref="material">
    <a-modal
      destroyOnClose
      :getContainer="() => this.$refs.material"
      width="1000px"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      title="选择物料"
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
              <a-form-model-item label="物料编码" prop="materialCode">
                <a-input placeholder="请输入物料编码" v-model="queryParam.materialCode"></a-input>
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
            <a-col :md="24" :sm="24">
              <div class="button">
                <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
                <a-button type="primary" @click="handleSearch">查询</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
        <s-table
          name="materiaTables"
          ref="table"
          :rowSelection="rowSelection"
          :rowKey="(record) => record.id"
          :data="getList"
          :columns="columns"
          :scroll="{ x: 2000 }"
        >
          <template v-slot:effectiveTime="effectiveTime">
            {{ effectiveTime | moment('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <template v-slot:expireTime="expireTime">
            {{ expireTime | moment('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </s-table>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { contractItem } from '@/api/projectCarry'
export default {
  inject: ['info'],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    contractId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      matreialInfo: null,
      confirmLoading: false,
      queryParam: {},
      columns: [
        { title: '物料编码', dataIndex: 'materialCode', key: 'materialCode' },
        { title: '物料名称', dataIndex: 'materialName', key: 'materialName' },
        { title: '规格型号', dataIndex: 'materialModel', key: 'materialModel' },
        { title: '合同数量', dataIndex: 'contractMaterialNum', key: 'contractMaterialNum' },
        { title: '已匹配计划数量', dataIndex: 'planMatchingContractNum', key: 'planMatchingContractNum' },
        { title: '单位', dataIndex: 'mpMeasurementUnit', key: 'mpMeasurementUnit' },
        { title: '含税单价(元)', dataIndex: 'priceWithTax', key: 'priceWithTax' },
        { title: '税率 (%)', dataIndex: 'taxRate', key: 'taxRate' },
        { title: '价税合计(元)', dataIndex: 'priceWith', key: 'priceWith' },
        {
          title: '交货期',
          dataIndex: 'deliveryTime',
          key: 'deliveryTime',
          width: 200,
          scopedSlots: { customRender: 'effectiveTime' }
        },
        {
          title: '质保期',
          dataIndex: 'guaranteePeriod',
          key: 'guaranteePeriod',
          width: 200,
          scopedSlots: { customRender: 'expireTime' }
        }
      ],
      selectRows: [],
      rowSelection: {
        type: 'radio',
        onChange: (selectRowsKeys, selectRows) => {
          this.selectRows = selectRowsKeys
          this.matreialInfo = selectRows[0]
          // this.$emit('update:selected', selectRows)
          // this.$emit('change', selectRowsKeys)
        }
      }
    }
  },
  methods: {
    async getList(page) {
      const { queryParam, contractId: buyerContractId } = this
      const data = {
        ...page,
        ...queryParam,
        buyerContractId
      }
      return contractItem(data)
    },
    handleReset() {
      this.$refs.form.resetFields()
    },
    handleSearch() {
      this.$refs.table.refresh(true)
    },
    handleOk() {
      const { info, matreialInfo } = this
      if (info.materialCode !== matreialInfo.materialCode) {
        this.$confirm({
          title: '提示',
          content: '该计划与合同的物料编码不完全匹配，是否继续执行？',
          onOk: () => {
            this.$emit('ok', matreialInfo)
            this.handleCancel()
          }
        })
      } else {
        this.$emit('ok', matreialInfo)
        this.handleCancel()
      }
    },
    handleCancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less" scoped>
.material-table {
  .s-table {
    margin-top: 20px;
  }
}
</style>

<template>
  <div class="mapping-table">
    <a type="link" @click="bumen">
      {{ $$(record, 'contractInfo', 'contractCode') }}
      <a-icon type="caret-down" v-if="$$(record.longTermContract, 'length') > 1" />
    </a>
    <a-modal :visible="visible" :width="1000" @ok="handleOk" @cancel="handleCancel">
      <s-table
        name="procurement"
        :columns="columns"
        :list="record.longTermContracts"
        :customPage="true"
        rowKey="contractId"
        :row-selection="{
          type: 'radio',
          onChange: this.handleChange
        }"
      >
        <template v-slot:expireTime="expireTime">
          <span>{{ expireTime | moment }}</span>
        </template>
      </s-table>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    record: {
      type: Object,
      default: () => {}
    },
    ids: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      selectedRowKeysArray: [],
      name: '',
      visible: false,
      columns: [
        {
          title: '供应商',
          key: 'providerMerchantName',
          dataIndex: 'providerMerchantName'
        },
        {
          title: '合同类型',
          key: 'contractTypeName',
          dataIndex: 'contractTypeName'
        },
        {
          title: '合同编号',
          key: 'contractCode',
          dataIndex: 'contractCode'
        },
        {
          title: '含税单价(元)',
          key: 'priceWithTax',
          dataIndex: 'priceWithTax'
        },
        {
          title: '截止到日期',
          key: 'expireTime',
          dataIndex: 'expireTime',
          scopedSlots: { customRender: 'expireTime' }
        }
      ]
    }
  },
  methods: {
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      const { ids, contractInfo } = this
      this.$emit('change', { contractInfo, ids })
      this.visible = false
    },
    bumen() {
      this.visible = true
    },
    handleChange(selectedRowKeys, [selectedRows]) {
      this.contractInfo = selectedRows
      this.record.longTermContracts = this.record.longTermContracts.map((x) => {
        return {
          ...x,
          isCheck: selectedRows.id === x.id ? 1 : 0
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.authInfo {
  width: 100%;
  .button {
    text-align: center;
  }
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .bottomButton {
    margin-bottom: 20px;
  }
}
</style>

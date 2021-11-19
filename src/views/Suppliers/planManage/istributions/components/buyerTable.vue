<template>
  <div class="buyer-table" ref="content">
    <a-modal destroyOnClose title="选择采购员" width="700px" @cancel="handleCancel" @ok="handleOk" :visible="visible">
      <div class="table-page-search-wrapper-custom">
        <a-form-model
          layout="inline"
          ref="form"
          :model="params"
          v-bind="{
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
          }"
        >
          <a-row :gutter="48">
            <a-col :md="14" :sm="24">
              <a-form-model-item label="姓名">
                <a-input v-model="params.likeName"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="4" :sm="8">
              <a-button type="primary" @click="search">查询</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <s-table
        name="buyerTablest"
        ref="table"
        rowKey="id"
        :rowSelection="{ type: 'radio', onChange: this.handleChange }"
        :data="geteBuyerInfo"
        :columns="columns"
        :isCanFilter="false"
      ></s-table>
    </a-modal>
  </div>
</template>

<script>
import { buyerInfo } from '@/api/buyerPlanItem'
const columns = [
  {
    title: '用户账号',
    key: 'username',
    width: 150,
    dataIndex: 'username'
  },
  {
    title: '姓名',
    key: 'identityCardName',
    width: 150,
    dataIndex: 'identityCardName'
  },
  {
    title: '手机号',
    key: 'mobile',
    width: 150,
    dataIndex: 'mobile'
  }
]
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    merchantId: {
      type: [String, Number],
      default: ''
    },
    parentKeys: {
      type: Array,
      default: () => []
    }
  },
  mounted() {},
  data() {
    return {
      columns,
      params: {},
      selectRows: []
    }
  },
  methods: {
    async geteBuyerInfo(page) {
      const { params, merchantId } = this
      return buyerInfo({ ...params, ...page, merchantId })
    },
    // 查询列表数据
    search() {
      this.$refs.table.refresh(true)
    },
    handleCancel() {
      this.params.likeName = ''
      this.$emit('update:visible', false)
    },
    handleChange(selectRowKeys, selectRows) {
      this.selectRows = selectRows
    },
    handleOk() {
      const { parentKeys, selectRows } = this
      if (selectRows.length <= 0) {
        this.$message.warning('请选择至少一条数据')
        return
      }
      this.$emit('ok', { parentKeys, selectRows })
      this.handleCancel()
      this.selectRows = []
    }
  }
}
</script>

<style lang="less" scoped>
</style>

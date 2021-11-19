<template>
  <div class="material-modal">
    <s-table
      name="materalModal"
      rowKey="id"
      ref="table"
      :rowSelection="rowSelection"
      class="table"
      :data="getMaterialList"
      :columns="columns"
    >
      <template v-slot:createTime="createTime">
        {{ createTime | moment('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </s-table>
  </div>
</template>

<script>
// import { filter } from 'vue/types/umd'
const columns = [
  {
    title: '一级名称/编码',
    key: 'fstNameCode',
    dataIndex: 'fstNameCode'
  },
  {
    title: '二级名称/编码',
    key: 'sndNameCode',
    dataIndex: 'sndNameCode'
  },
  {
    title: '三级名称/编码',
    key: 'trdNameCode',
    dataIndex: 'trdNameCode'
  },
  { title: '规格型号', dataIndex: 'materialModel', key: 'materialModel', show: true },
  {
    title: '物料编码',
    key: 'code',
    dataIndex: 'code'
  },
  {
    title: '物料名称',
    key: 'name',
    dataIndex: 'name'
  },
  {
    title: '单位',
    key: 'mpMeasurementUnit',
    dataIndex: 'mpMeasurementUnit'
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
    scopedSlots: { customRender: 'createTime' }
  }
]
export default {
  name: 'MaterialModal',
  props: {
    visible: {
      type: Boolean,
      deafault: false
    },
    merchantId: {
      type: [String, Number],
      default: ''
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.getCategoryAll()
      }
    }
  },
  data() {
    return {
      value: [],
      columns,
      params: {
        status: '0',
        materialCategoryIds: []
      },
      treeList: [],
      normalizer(node) {
        return {
          id: node?.id,
          label: node?.name,
          children: node?.children || []
        }
      },
      selectRows: [],
      rowSelection: {
        onChange: (selectRowKeys, selectRows) => {
          this.selectRows = selectRows
        }
      }
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.material-modal-container {
  .table {
    margin-top: 20px;
  }
}
</style>

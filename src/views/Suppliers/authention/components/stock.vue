<template>
  <div class="review">
    <s-table ref="table" name="stockTables" :columns="columns" :showPagination="false" :data="init" rowKey="id">
      <template slot="index" slot-scope="text, record, index">
        <div :key="index">
          {{ index + 1 }}
        </div>
      </template>
    </s-table>
  </div>
</template>
<script>
import { getPageInventoryCapacityInfoList } from '@/api/supplieAuthAdmin'
export default {
  methods: {
    async init(params) {
      return getPageInventoryCapacityInfoList({ ...params })
    }
  },
  data() {
    return {
      columns: [
        { title: '序号', width: '61px', dataIndex: 'index', scopedSlots: { customRender: 'index' } },
        { title: '产品名称', dataIndex: 'productName' },
        { title: '库存金额(万元)', dataIndex: 'brand' }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
</style>

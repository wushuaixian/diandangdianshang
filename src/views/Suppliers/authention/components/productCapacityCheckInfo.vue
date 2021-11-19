<template>
  <div class="relation">
    <s-table ref="table" name="productCapacityCheckInfoTable" :columns="columns" :data="init" rowKey="id">
      <template slot="enterpriseProveUrl" slot-scope="url">
        <ImagePreview :width="40" :height="40" :value="url" />
      </template>
      <template slot="index" slot-scope="text, record, index">
        <div :key="index">
          {{ index + 1 }}
        </div>
      </template>
    </s-table>
  </div>
</template>
<script>
import { getPageProductCapacityCheckInfo } from '@/api/supplieAuthAdmin'
import ImagePreview from '@/components/ImagePreview'
export default {
  components: { ImagePreview },
  methods: {
    async init(params) {
      return getPageProductCapacityCheckInfo({ ...params })
    }
  },
  data() {
    return {
      columns: [
        { title: '序号', width: '61px', dataIndex: 'index' },
        { title: '产品名称', dataIndex: 'productName' },
        // { title: '月产值(万元)', dataIndex: 'monthlyCapacity' },
        { title: '年产值(万元)', dataIndex: 'yearCapacity' }
      ],
      data: []
    }
  }
}
</script>

<style lang="less" scoped>
</style>

<style lang="less">
.relation {
  .ant-table-row {
    td {
      padding: 4px 16px !important;
    }
  }
}
</style>

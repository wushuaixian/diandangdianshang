<template>
  <div class="relation">
    <s-table ref="table" name="quipmentInventoryCheckInfoTable" :columns="columns" :data="init" rowKey="id">
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
import { getPageEquipmentInventoryCheckInfo } from '@/api/supplieAuthAdmin'
import ImagePreview from '@/components/ImagePreview'
export default {
  components: { ImagePreview },
  methods: {
    async init(params) {
      return getPageEquipmentInventoryCheckInfo({ ...params })
    }
  },
  data() {
    return {
      columns: [
        { title: '序号', width: '61px', dataIndex: 'index', scopedSlots: { customRender: 'index' } },
        { title: '设备名称', dataIndex: 'equipmentName' },
        { title: '品牌', dataIndex: 'brand' },
        { title: '型号', dataIndex: 'model' },
        { title: '数量', dataIndex: 'number' },
        { title: '使用年限', dataIndex: 'durableYears' }
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

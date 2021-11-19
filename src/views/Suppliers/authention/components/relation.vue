<template>
  <div class="relation">
    <s-table ref="table" name="relationtable" :columns="columns" :data="init" rowKey="id">
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
import { getPageAssociatedEnterprise } from '@/api/supplieAuthAdmin'
import ImagePreview from '@/components/ImagePreview'
export default {
  components: { ImagePreview },
  methods: {
    async init(params) {
      return getPageAssociatedEnterprise({ ...params })
    }
  },
  data() {
    return {
      columns: [
        { title: '序号', width: '61px', dataIndex: 'index', scopedSlots: { customRender: 'index' } },
        { title: '企业名称', dataIndex: 'enterpriseName' },
        { title: '关联证明', dataIndex: 'enterpriseProveUrl', scopedSlots: { customRender: 'enterpriseProveUrl' } }
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

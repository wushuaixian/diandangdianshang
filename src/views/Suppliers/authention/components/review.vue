<template>
  <div class="review">
    <s-table ref="table" name="reviewTables" :columns="columns" :data="init" rowKey="id">
      <template slot="index" slot-scope="text, record, index">
        <div :key="index">
          {{ index + 1 }}
        </div>
      </template>
    </s-table>
  </div>
</template>
<script>
import { getPageComprehensiveReview } from '@/api/supplieAuthAdmin'
export default {
  methods: {
    async init(params) {
      return getPageComprehensiveReview({ ...params })
    }
  },
  data() {
    return {
      columns: [
        { title: '序号', width: '61px', dataIndex: 'index', scopedSlots: { customRender: 'index' } },
        { title: '项目', width: '150px', dataIndex: 'projectName' },
        { title: '总分值', dataIndex: 'totalScore' },
        { title: '实得分数', dataIndex: 'realScore' },
        { title: '权重(%)', dataIndex: 'weight' },
        { title: '加权得分', dataIndex: 'weightScore' }
      ],
      data: []
    }
  }
}
</script>

<style lang="less" scoped>
</style>

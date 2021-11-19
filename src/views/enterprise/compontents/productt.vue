<template>
  <div class="prod">
    <s-table ref="producttTable" name="producttTable" rowKey="id" :columns="columns" :data="init"> </s-table>
  </div>
</template>
<script>
import { productCapacityPage } from '@/api/enterprise'
const columns = [
  { title: '序号', dataIndex: 'index' },
  { title: '产品名称', dataIndex: 'productName' },
  { title: '月产能', dataIndex: 'monthlyCapacity' },
  { title: '年产量', dataIndex: 'yearCapacity' }
]
export default {
  data() {
    return {
      columns
    }
  },
  methods: {
    async init(params) {
      const ret = await productCapacityPage({ ...params })
      if (ret.code === '0') {
        for (let i = 0; i < ret.data.listObj?.length; i++) {
          ret.data.listObj[i].index = i + 1
        }
      }
      return ret
    }
  }
}
</script>
<style lang='less' scoped>
.prod {
  padding: 20px 0;
}
</style>

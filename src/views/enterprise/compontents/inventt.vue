<template>
  <div class="invent">
    <s-table ref="InventtTable" name="inventtTable" rowKey="id" :columns="columns" :data="init"> </s-table>
  </div>
</template>
<script>
import { equipmentInventoryPage } from '@/api/enterprise'
const columns = [
  { title: '序号', dataIndex: 'index' },
  { title: '产品名称', dataIndex: 'zizhi' },
  { title: '库存量', dataIndex: 'shi' }
]
export default {
  data() {
    return {
      columns
    }
  },
  methods: {
    async init(params) {
      const ret = await equipmentInventoryPage({ ...params })
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
.invent {
  padding: 20px 0;
}
</style>

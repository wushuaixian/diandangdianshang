<template>
  <div class="eqiment">
    <s-table ref="table" name="equipmentTable" rowKey="id" :columns="columns" :data="init" class="table"> </s-table>
  </div>
</template>
<script>
import { equipmentInventoryPage } from '@/api/enterprise'
const columns = [
  { title: '序号', dataIndex: 'index' },
  { title: '设备名称', dataIndex: 'equipmentName' },
  { title: '品牌', dataIndex: 'brand' },
  { title: '型号', dataIndex: 'model' },
  { title: '数量', dataIndex: 'number' },
  { title: '使用年限', dataIndex: 'durableYears' }
]
export default {
  data() {
    return {
      columns,
      data: []
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
<style lang="less" scoped>
.eqiment {
  padding: 20px 0;
}
</style>

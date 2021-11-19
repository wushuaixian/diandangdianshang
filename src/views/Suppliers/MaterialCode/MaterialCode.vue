<template>
  <div>
    <a-row>
      <a-col :span="8">
        <div>
          <a-row>
            <a-col :span="6" class="material"> 物料编码 </a-col>
            <a-col :span="13"> <a-input /> </a-col>
          </a-row>
        </div>
      </a-col>
      <a-col :span="8">
        <div>
          <a-row>
            <a-col :span="6" class="material"> 物料名称 </a-col>
            <a-col :span="13"> <a-input /> </a-col>
          </a-row>
        </div>
      </a-col>
      <a-col :span="8">
        <div>
          <a-row>
            <a-col :span="6" class="material"> 规格型号 </a-col>
            <a-col :span="13"> <a-input /> </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>
    <div class="obt3">
      <a-button class="rest">重置</a-button>
      <a-button type="primary" class="query">查询</a-button>
    </div>
    <div class="eqimen">
      <s-table
        ref="table"
        name="MaterialCodeTable"
        :scroll="{ x: 2200, y: 300 }"
        rowKey="id"
        :columns="columns"
        :data="init"
        class="table"
      >
      </s-table>
    </div>
    <div class="obt3">
      <a-button class="rest">取消</a-button>
      <a-button type="primary" class="query">确定</a-button>
    </div>
  </div>
</template>

<script>
import { contractItem } from '@/api/projectCarry'
const columns = [
  { title: '序号', dataIndex: 'index' },
  { title: '物料编码', dataIndex: 'equipmentName' },
  { title: '物料名称', dataIndex: 'brand' },
  { title: '规格型号', dataIndex: 'model' },
  { title: '合同数量', dataIndex: 'number' },
  { title: '已匹配计划数量', dataIndex: 'durableYears' },
  { title: '已下单数量', dataIndex: 'Quantityordered' },
  { title: '单位', dataIndex: 'Company' },
  { title: '含税单价(元)', dataIndex: 'including' },
  { title: '税率 (%)', dataIndex: 'taxrate' },
  { title: '价税合计(元)', dataIndex: 'Totalprice' },
  { title: '品牌/产地', dataIndex: 'make' },
  { title: '交货期', dataIndex: 'delivery' },
  { title: '保质期', dataIndex: 'quality' },
  { title: '备注', dataIndex: 'remarks' },
  { title: '选择', dataIndex: 'choice' }
]
export default {
  data() {
    return {
      columns,
      data: []
    }
  },
  methods: {
    init() {
      const data = {
        materialCode: '456',
        materialName: '钢铁',
        materialModel: 'Qrefds',
        currentPage: 1,
        itemsPerPage: 10
      }
      return contractItem(data)
    }
  }
}
</script>

<style scoped lang="less">
.material {
  line-height: 30px;
}
.obt3 {
  text-align: center;
  margin-top: 10px;
  .query,
  .rest {
    margin-right: 10px;
  }
}
.eqimen {
  padding: 20px 0;
}
.paging {
  text-align: right;
}
</style>

<template>
  <div class="auditClause">
    <header-title class="header-title">
      <span>{{ tableData[0].headName }}</span>
    </header-title>
    <a-table :columns="base" :data-source="tableData[0].items" :pagination="false" rowKey="id" bordered>
    </a-table>
    <header-title class="header-title">
      <span>{{ tableData[1].headName }}</span>
    </header-title>
    <a-table :columns="quality" :data-source="tableData[1].items" :pagination="false" rowKey="id" bordered>
    </a-table>
    <header-title class="header-title">
      <span>{{ tableData[2].headName }}</span>
    </header-title>
    <a-table :columns="research" :data-source="tableData[2].items" :pagination="false" rowKey="id" bordered>
    </a-table>
    <header-title class="header-title">
      <span>{{ tableData[3].headName }}</span>
    </header-title>
    <a-table :columns="product" :data-source="tableData[3].items" :pagination="false" rowKey="id" bordered>
    </a-table>
    <header-title class="header-title">
      <span>{{ tableData[4].headName }}</span>
    </header-title>
    <a-table :columns="sale" :data-source="tableData[4].items" :pagination="false" rowKey="id" bordered>
    </a-table>
  </div>
</template>

<script>
import { reviewListGet } from '@/api/supplieAuthAdmin'
export default {
  data() {
    return {
      columns: [
        { title: '考核项目', dataIndex: 'itemName', width: 150 },
        { title: '考核规则', dataIndex: 'itemRule', width: 150 },
        {
          title: '考核分数(0分-不合格；3分-达标；4分-优秀；5分-非常棒；)',
          dataIndex: 'score',
          width: 150,
          scopedSlots: { customRender: 'score' }
        },
        { title: '实际情况', dataIndex: 'truth', width: 150, scopedSlots: { customRender: 'truth' } }
      ],
      base: [
        { title: '考核项目',
          dataIndex: 'itemName',
          width: 150,
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.rowSpan = this.getRowSpanCount(this.tableData[0].items || [], 'itemName', index)
            return obj
          }
        },
        { title: '考核规则', dataIndex: 'itemRule', width: 150 },
        { title: '考核分数(0分-不合格；3分-达标；4分-优秀；5分-非常棒)',
          dataIndex: 'score',
          width: 150,
          scopedSlots: { customRender: 'score' } },
        { title: '实际情况', dataIndex: 'truth', width: 150, scopedSlots: { customRender: 'truth' } }
      ],
      quality: [
        { title: '考核项目',
          dataIndex: 'itemName',
          width: 150,
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.rowSpan = this.getRowSpanCount(this.tableData[1].items || [], 'itemName', index)
            return obj
          }
        },
        { title: '考核规则', dataIndex: 'itemRule', width: 150 },
        { title: '考核分数(0分-不合格；3分-达标；4分-优秀；5分-非常棒)',
          dataIndex: 'score',
          width: 150,
          scopedSlots: { customRender: 'score' } },
        { title: '实际情况', dataIndex: 'truth', width: 150, scopedSlots: { customRender: 'truth' } }
      ],
      research: [
        { title: '考核项目',
          dataIndex: 'itemName',
          width: 150,
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.rowSpan = this.getRowSpanCount(this.tableData[2].items || [], 'itemName', index)
            return obj
          }
        },
        { title: '考核规则', dataIndex: 'itemRule', width: 150 },
        { title: '考核分数(0分-不合格；3分-达标；4分-优秀；5分-非常棒)',
          dataIndex: 'score',
          width: 150,
          scopedSlots: { customRender: 'score' } },
        { title: '实际情况', dataIndex: 'truth', width: 150, scopedSlots: { customRender: 'truth' } }
      ],
      product: [
        { title: '考核项目',
          dataIndex: 'itemName',
          width: 150,
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.rowSpan = this.getRowSpanCount(this.tableData[3].items || [], 'itemName', index)
            return obj
          }
        },
        { title: '考核规则', dataIndex: 'itemRule', width: 150 },
        { title: '考核分数(0分-不合格；3分-达标；4分-优秀；5分-非常棒)',
          dataIndex: 'score',
          width: 150,
          scopedSlots: { customRender: 'score' } },
        { title: '实际情况', dataIndex: 'truth', width: 150, scopedSlots: { customRender: 'truth' } }
      ],
      sale: [
        { title: '考核项目',
          dataIndex: 'itemName',
          width: 150,
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.rowSpan = this.getRowSpanCount(this.tableData[4].items || [], 'itemName', index)
            return obj
          }
        },
        { title: '考核规则', dataIndex: 'itemRule', width: 150 },
        { title: '考核分数(0分-不合格；3分-达标；4分-优秀；5分-非常棒)',
          dataIndex: 'score',
          width: 150,
          scopedSlots: { customRender: 'score' } },
        { title: '实际情况', dataIndex: 'truth', width: 150, scopedSlots: { customRender: 'truth' } }
      ],
      tableData: []
    }
  },
  mounted() {
    this.getReviewList()
    console.log(1)
  },
  methods: {
    // 认证审核列表
    async getReviewList() {
      const { data } = await reviewListGet()
      console.log(data)
      this.tableData = data
    },
    // 表格合并
    getRowSpanCount(data, key, target) {
      if (!Array.isArray(data)) return 1
      data = data.map(_ => _[key])
      let preValue = data[0]
      const res = [[preValue]]
      let index = 0
      for (let i = 1; i < data.length; i++) {
        if (data[i] === preValue) {
          res[index].push(data[i])
        } else {
          index += 1
          res[index] = []
          res[index].push(data[i])
          preValue = data[i]
        }
      }
      const arr = []
      res.forEach((_) => {
        const len = _.length
        for (let i = 0; i < len; i++) {
          arr.push(i === 0 ? len : 0)
        }
      })
      return arr[target]
    }
  }
}
</script>

<style scoped>
</style>

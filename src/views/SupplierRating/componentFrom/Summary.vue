<template>
  <div>
    <a-card title="评分汇总">
      <p>供应商信息</p>
      <p>供应商名称：{{ supplier.name }}</p>
      <p>当前等级：{{ supplier.level }}</p>
      <p>主营品类：{{ supplier.category }}</p>
    </a-card>
    <a-card>
      <a-table :pagination="false" ref="table" name="AAmyTables" :columns="columns" :data-source="datainit">
        <div slot="yearMonthStr" slot-scope="text, item">
          <a @click="yearMonthStr(item)">{{ item.yearMonthStr }} </a>
        </div>
      </a-table>
      <a-button @click="comeBack" style="margin-top: 20px"> 返回</a-button>
    </a-card>
  </div>
</template>

<script>
import { getScoreDetail } from '@/api/SupplierSettings.js'
// import MyTable from './tableS'
export default {
  name: 'RoleManagement',
  components: {},
  data() {
    return {
      supplier: {
        name: '',
        level: '',
        category: ''
      },
      datainit: [],
      columns: [
        {
          title: '月份',
          // dataIndex: 'yearMonthStr',
          key: 'yearMonthStr',
          scopedSlots: { customRender: 'yearMonthStr' }
        },
        {
          title: '总分',
          dataIndex: 'totalScore',
          key: 'totalScore'
        },
        {
          title: '静态得分',
          dataIndex: 'staticScore',
          key: 'staticScore'
        },
        {
          title: '动态得分',
          dataIndex: 'moveScore',
          key: 'moveScore'
        },
        {
          title: '店铺得分',
          dataIndex: 'storeScore',
          key: 'storeScore'
        }
      ]
    }
  },
  created() {},
  mounted() {
    this.init()
    // vm.$refs.table.refresh(true)
  },
  methods: {
    comeBack() {
      this.$router.go(-1)
    },
    yearMonthStr(item) {
      this.$router.push({
        name: 'detailed',
        params: {
          id: item.id,
          seach: '1'
        }
      })
    },
    async init(params) {
      const res = {
        ...params,
        id: parseInt(this.$route.params.id)
      }
      const data = await getScoreDetail({ ...res })

      this.datainit = data.data?.cycleVOS
      this.supplier.name = data.data?.orgName
      this.supplier.level = data.data?.gradeName
      this.supplier.category = data.data?.name
    }
  }
}
</script>

<style scoped lang="less">
</style>

<template>
  <div class="enterprise-category">
    <header-title>
      <span>经营品类</span>
    </header-title>
    <AddCategory @ok="$refs.table.refresh(true)" />
    <s-table ref="table" name="categoryTable" :columns="columns" :data="getList" rowKey="id">
      <template v-slot:stataus="record">
        <a-tooltip placement="top" v-if="record.auditStatus === '3'">
          <template slot="title">
            <span>{{ record.message }}</span>
          </template>
          {{ statausText[record.auditStatus] }}
          <a-icon type="question-circle" />
        </a-tooltip>
        <span v-else>{{ statausText[record.auditStatus] }}</span>
      </template>
      <template v-slot:action="props">
        <a
          @click="handleDelte(props)"
          v-if="!['1', '2'].includes(props.auditStatus) && Number(props.mainCategoryId) !== 1"
        >
          删除
        </a>
      </template>
    </s-table>
  </div>
</template>

<script>
import { queryMerchantCategory, deleteCategory } from '@/api/enterprise'
import AddCategory from './compontents/addCategory.vue'
export default {
  components: { AddCategory },
  data() {
    return {
      statausText: ['', '待审核', '审核通过', '审核不通过'],
      columns: [
        {
          title: '类目编码',
          dataIndex: 'categoryCode',
          key: 'categoryCode'
        },
        {
          title: '经营品类名称',
          key: 'name',
          customRender: (record) => {
            return Number(record?.mainCategoryId) === 1 ? (
              <span style="color:#ff6b00;">{record.name}(主营品类)</span>
            ) : (
              <span>{record.name}</span>
            )
          }
        },
        {
          title: '审核状态',
          key: 'auditStatus',
          scopedSlots: {
            customRender: 'stataus'
          }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: {
            customRender: 'action'
          }
        }
      ]
    }
  },

  methods: {
    async getList(pagination) {
      return queryMerchantCategory({ ...pagination })
    },
    async handleDelte({ categoryApplyId: id }) {
      this.$confirm({
        title: '提示',
        content: '确定删除吗?',
        onOk: async () => {
          const data = new FormData()
          data.append('id', id)
          const res = await deleteCategory(data)
          if (res.code === '0') {
            this.$message.success('删除成功')
            this.$refs.table.refresh()
          }
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>

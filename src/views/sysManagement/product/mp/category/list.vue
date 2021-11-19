<template>
  <div class="mp-category">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model :model="queryParam" layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="类目树名称">
                <a-input v-model="queryParam.name" placeholder="" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="类目类型">
                <a-select
                  allowClear
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  v-model="queryParam.type"
                  placeholder="请选择"
                  :options="categoryOptions"
                  default-value="0"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :sm="24" class="button">
              <a-button type="primary" @click="handleSearch">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetForm">重置</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card>
      <a-table rowKey="id" :columns="columns" :data-source="list" :pagination="pagination">
        <template v-slot:actions="props">
          <router-link :to="{ name: '' }">编辑</router-link>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { listRootCategoryBack } from '@/api/product/mp/'
import Page from '@/mixins/page'
export default {
  mixins: [Page],
  data() {
    return {
      columns: [
        {
          title: '类目树名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '类目树名称（第二语言）',
          dataIndex: 'nameLan2',
          key: 'nameLan2'
        },
        {
          title: '类目树ID',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '类目类型',
          dataIndex: 'type',
          key: 'type',
          customRender: (value) => {
            const item = this.categoryOptions.find((x) => x.value === value)
            return item?.label
          }
        },
        {
          title: '操作',
          dataIndex: 'actions',
          key: 'action',
          scopedSlots: {
            customRender: 'actions'
          }
        }
      ],
      queryParam: {
        total: 1
      },
      categoryOptions: [
        {
          value: 1,
          label: '后台类目'
        },
        {
          value: 2,
          label: '前台类目'
        }
      ],
      list: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    async init() {
      const {
        pagination: { current, pageSize },
        queryParam
      } = this
      const res = await listRootCategoryBack({ current, pageSize, ...queryParam })
      if (res.code === '0') {
        const { listObj, total } = res.data
        this.list = listObj
        this.pagination.total = total
      }
    },
    handleSearch() {}
  }
}
</script>

<style lang="less" scoped>
.mp-category {
  .button {
    text-align: center;
  }
}
</style>


<template>
  <div class="appeal-manage-list">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="类目名称" prop="categoryName">
                <a-input v-model="queryParam.categoryName" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :sm="24" class="button">
              <a-button @click="handleReset">重置</a-button>
              <a-button type="primary" @click="search">查询</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card>
      <MYadd ref="child" @ok="search" />
      <s-table :scroll="{ y: 340 }" rowKey="id" ref="table" name="platform" :columns="columns" :data="getList">
        <template slot="auditStatus" slot-scope="text, record">
          <span v-if="record.auditStatus === '1'">审核</span>
          <span v-if="record.auditStatus === '2'">不审核</span>
          <span v-if="record.auditStatus === '3'">部分审核</span>
        </template>
        <template slot="createTime" slot-scope="text, record">
          {{ record.createTime | dayjs }}
        </template>
        <template slot="options" slot-scope="text, record">
          <a @click="Delete(record.id)">删除</a>
        </template>
      </s-table>
    </a-card>
    <a-modal v-model="visibleDelete" title="删除" ok-text="确定" cancel-text="取消" @ok="hideDelete">
      <p style="text-align: center">确认删除吗？</p>
    </a-modal>
  </div>
</template>

<script>
import { postGoodsAuditCategoryDelete, postGoodsAuditCategoryQuery } from '@/api/goodsConfigure'

import MYadd from './my-add.vue'

export default {
  components: { MYadd },
  data() {
    return {
      id: '',
      visibleDelete: false,
      columns: [
        {
          title: '一级类目',
          dataIndex: 'categoryOneName',
          key: 'categoryOneName'
        },
        {
          title: '二级类目',
          dataIndex: 'categoryTwoName',
          key: 'categoryTwoName',
          scopedSlots: { customRender: 'categoryTwoName' }
        },
        {
          title: '审核状态',
          dataIndex: 'auditStatus',
          key: 'auditStatus',
          scopedSlots: { customRender: 'auditStatus' }
        },
        {
          title: '创建人',
          dataIndex: 'createUserName',
          key: 'createUserName'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '操作',
          dataIndex: 'options',
          key: 'options',
          scopedSlots: { customRender: 'options' }
        }
      ],
      queryParam: {
        categoryName: null
      }
    }
  },
  methods: {
    // 获取列表
    async getList(pagination) {
      const { queryParam } = this
      const data = {
        ...pagination,
        ...queryParam
      }
      return postGoodsAuditCategoryQuery({ ...data })
    },
    handleReset() {
      this.$refs.ruleForm.resetFields()
    },
    // 查询
    search() {
      this.$refs.table.refresh(true)
    },
    // 删除
    Delete(e) {
      this.id = e
      this.visibleDelete = true
    },
    hideDelete() {
      postGoodsAuditCategoryDelete({ id: this.id }).then((res) => {
        if (res.code === '0') {
          this.search()
          this.$refs.child.getselectList()
        }
      })
      this.visibleDelete = false
    }
  }
}
</script>

<style lang="less" scoped>
.appeal-manage-list {
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .button {
    text-align: center;
  }
}
</style>

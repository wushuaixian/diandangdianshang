
<template>
  <div>
    <div class="addBttton">
      <span>选择供应商</span>
      <a-button type="primary" @click="Add"> 新增</a-button>
    </div>
    <a-modal :width="1300" v-model="visible" okText="保存" title="供应商列表" @ok="handleOk">
      <a-card :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-model-item label="供应商名称" prop="">
                  <a-input v-model="queryParam.enterpriseName" placeholder="请输入" />
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-model-item label="供应商编码" prop="">
                  <a-input v-model="queryParam.orgCode" placeholder="请输入" />
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
        <s-table
          :row-selection="rowSelection"
          :scroll="{ x: 200, y: 230 }"
          ref="table"
          rowKey="id"
          name="supplier"
          :columns="columns"
          :data="getList"
        >
          <template slot="auditStatus" slot-scope="text, record">
            <span v-if="record.auditStatus === '-1'">待处理</span>
            <span v-if="record.auditStatus === '0'">待审核</span>
            <span v-if="record.auditStatus === '1'"> 通过</span>
            <span v-if="record.auditStatus === '2'">不通过</span>
          </template>
          <template slot="options" slot-scope="text, record">
            <a @click="Delete(record.id)">删除</a>
          </template>
        </s-table>
      </a-card>
    </a-modal>
    <a-modal :width="1300" v-model="visibleDelete" title="删除" @ok="handleDelete"> </a-modal>
  </div>
</template>

<script>
import { postQuerySupplier } from '@/api/goodsConfigure'
export default {
  data() {
    return {
      visible: false,
      visibleDelete: false,
      columns: [
        {
          title: '供应商名称',
          dataIndex: 'enterpriseName',
          key: 'enterpriseName'
        },
        {
          title: '供应商编码',
          dataIndex: 'orgCode',
          key: 'orgCode',
          scopedSlots: { customRender: 'orgCode' }
        },
        {
          title: '供应商状态',
          dataIndex: 'auditStatus',
          key: 'auditStatus',
          scopedSlots: { customRender: 'auditStatus' }
        },
        {
          title: '操作',
          dataIndex: 'options',
          key: 'options',
          scopedSlots: { customRender: 'options' }
        }
      ],
      queryParam: {
        enterpriseName: null,
        orgCode: null
      },
      List: []
    }
  },
  computed: {
    // 选中数据
    rowSelection() {
      const that = this
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
          that.List.push(...selectedRows)
        }
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
      return postQuerySupplier(data)
    },
    handleReset() {
      this.queryParam = {}
      this.$refs.ruleForm.resetFields()
    },
    // 查询
    search() {
      this.$refs.table.refresh(true)
    },
    // 新增显示modal
    Add() {
      this.visible = true
    },
    // 确认关闭modal 并保存
    handleOk() {
      this.visible = false
      this.$emit('getList', this.List)
    },
    // 修改
    Update(e) {},
    // 显示删除modal
    Delete(e) {
      this.visibleDelete = true
    },
    // 确认删除
    handleDelete() {
      this.visibleDelete = false
    },

    Revert() {}
  }
}
</script>

<style lang="less" scoped>
.button {
  text-align: center;
}
.addBttton {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
}
</style>

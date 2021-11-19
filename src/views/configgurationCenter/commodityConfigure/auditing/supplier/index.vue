
<template>
  <div class="appeal-manage-list">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="供应商名称" prop="businessName">
                <a-input v-model="queryParam.merchantName" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="供应商编码" prop="businessName">
                <a-input v-model="queryParam.merchantCode" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="创建时间" prop="time">
                <a-range-picker @change="chengeCreateTime" v-model="reset.resetTime" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="商品审核范围">
                <a-select
                  defaultValue="全部"
                  v-model="reset.resertSelect"
                  @change="changeSelectType"
                  allowClear
                  style="width: 269px"
                  :options="selectType"
                  placeholder="请选择"
                >
                </a-select>
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
      <a-button style="margin-bottom: 15px" type="primary" @click="Add"> 添加设置</a-button>
      <s-table
        :scroll="{ x: 200, y: true }"
        ref="table"
        rowKey="index"
        name="supplier"
        :columns="columns"
        :data="getList"
      >
        <template slot="auditRange" slot-scope="text, record">
          <span v-if="record.auditRange === 1">审核</span>
          <span v-if="record.auditRange === 2">部分审核</span>
        </template>
        <template slot="createTime" slot-scope="text, record">
          <span>{{ record.createTime | dayjs }}</span>
        </template>
        <template slot="options" slot-scope="text, record">
          <a @click="Update(record)" style="margin-right: 15px">编辑</a>
          <a @click="Delete(record.id)">删除</a>
        </template>
      </s-table>
    </a-card>
    <a-modal v-model="visibleDelete" okText="确定" title="删除" @ok="handleDelete">
      <div style="text-align: center">确认删除当前数据？</div>
    </a-modal>
  </div>
</template>

<script>
// import { getList } from '@/api/appealManage'
// postSelectedCategoryIds
import { postGoodsAuditSupplierDelete, postSupplierList } from '@/api/goodsConfigure'

import { formatDate } from '@/utils/util'

export default {
  data() {
    return {
      id: null,
      visibleDelete: false,
      reset: {
        resetTime: null,
        resertSelect: null
      },
      selectType: [
        {
          label: '全部',
          value: null
        },
        {
          label: '审核',
          value: 1
        },
        {
          label: '部分审核',
          value: 2
        }
      ],
      columns: [
        {
          title: '供应商名称',
          dataIndex: 'merchantName',
          key: 'merchantName',
          width: 200
        },
        {
          title: '供应商编码',
          dataIndex: 'merchantCode',
          key: 'merchantCode',
          width: 200,
          scopedSlots: { customRender: 'merchantCode' }
        },
        {
          title: '商品审核范围',
          dataIndex: 'auditRange',
          key: 'auditRange',
          width: 200,
          scopedSlots: { customRender: 'auditRange' }
        },
        {
          title: '创建人',
          dataIndex: 'createUsername',
          key: 'createUsername',
          width: 200,
          scopedSlots: { customRender: 'createUsername' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          width: 200,
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '操作',
          // dataIndex: 'options',
          key: 'action',
          width: 150,
          fixed: 'right',
          scopedSlots: { customRender: 'options' }
        }
      ],
      queryParam: {
        merchantName: null,
        merchantCode: null,
        beginTime: null,
        endTime: null,
        auditRange: null
      }
    }
  },
  methods: {
    // 监听时间
    chengeCreateTime(e) {
      this.queryParam.beginTime = formatDate(e[0]._d)
      this.queryParam.endTime = formatDate(e[1]._d)
    },
    // 监听商品审核选择
    changeSelectType(e) {
      this.queryParam.auditRange = e
    },
    // 获取列表
    async getList(pagination) {
      const { queryParam } = this
      const data = {
        ...pagination,
        ...queryParam
      }
      console.log(data)
      return postSupplierList(data)
    },
    handleReset() {
      this.queryParam = {}
      this.reset = {}
      this.$refs.ruleForm.resetFields()
    },
    // 查询
    search() {
      this.$refs.table.refresh(true)
    },
    // 修改
    Update(e) {
      // 获取已选列表数据
      // postSelectedCategoryIds({ id: e.id }).then((res) => {
      //   this.$router.push({ name: 'auditingSupplierAddUpdate', query: { selectIds: res.data, isUpdate: true } })
      // })
      this.$router.push({ name: 'auditingSupplierAddUpdate', query: { updateData: JSON.stringify(e) } })
    },
    // 删除
    Delete(id) {
      this.id = id
      this.visibleDelete = true
    },
    handleDelete() {
      postGoodsAuditSupplierDelete({ id: this.id }).then((res) => {
        if (res.code === '0') {
          this.search()
        }
      })
      this.visibleDelete = false
    },
    Add() {
      this.$router.push({ name: 'auditingSupplierAddUpdate' })
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

<!--
 * @Author: your name
 * @Date: 2021-06-29 23:57:54
 * @LastEditTime: 2021-07-15 20:52:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/product/productSet/categoryManagement/categoryOwnerList/index.vue
-->
<template>
  <a-space style="width: 100%" direction="vertical">
    <a-row :gutter="48">
      <a-col :span="24">
        <a-form-model layout="inline" ref="form" :model="queryParam">
          <a-form-model-item label="姓名" prop="identityCardName">
            <a-input placeholder="请输入姓名" v-model="queryParam.identityCardName" />
          </a-form-model-item>
          <a-form-model-item label="账号" prop="username">
            <a-input placeholder="请输入账号" v-model="queryParam.username" />
          </a-form-model-item>
          <a-form-model-item label="手机号" prop="mobile">
            <a-input placeholder="请输入手机号" v-model="queryParam.mobile" />
          </a-form-model-item>
        </a-form-model>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24" align="center">
        <a-space align="center">
          <a-button @click="handleReset">重置</a-button>
          <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
        </a-space>
      </a-col>
    </a-row>

    <s-table
      :row-selection="rowSelection"
      name="categoriesTable"
      ref="table"
      rowKey="id"
      :columns="columns"
      :data="init"
    ></s-table>
  </a-space>
</template>

<script>
import { queryUsers } from '@/api/categoryControl.js'
export default {
  name: 'CategoryOwnerList',
  data() {
    return {
      columns: [
        { title: '姓名', dataIndex: 'identityCardName' },
        { title: '账号', dataIndex: 'username' },
        { title: '手机号', dataIndex: 'mobile' }
        // { title: '所属机构', dataIndex: 'positionName' }
      ],
      queryParam: {},
      form: {},
      selectedRows: []
    }
  },
  computed: {
    rowSelection() {
      const vm = this
      return {
        onSelect: (record) => {
          vm.$emit('selectRow', record)
        },
        type: 'radio'
      }
    }
  },
  methods: {
    async init(pagination) {
      const { queryParam } = this
      // const { currentPage, itemsPerPage } = pagination
      const params = {
        // startItem: currentPage,
        // itemsPerPage: itemsPerPage,
        ...pagination,
        ...queryParam
      }
      // filter  Null and Empty string
      Object.keys(params).forEach((item) => {
        if (params[item] === null || params[item] === '') delete params[item]
      })
      return queryUsers({ ...params })
    },
    handleReset() {
      const vm = this
      vm.$refs.form.resetFields()
    }
  }
}
</script>

<style scoped>
</style>

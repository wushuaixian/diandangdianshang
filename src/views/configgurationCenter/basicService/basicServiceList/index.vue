<!--
 * @Author: your name
 * @Date: 2021-07-21 11:17:06
 * @LastEditTime: 2021-07-29 11:30:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/configgurationCenter/basicService/index.vue
-->
<template>
  <div>
    <a-card class="card">
      <a-form-model ref="ruleForm" layout="inline" :model="queryParams" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="采购商名称" prop="merchantName">
              <a-input v-model="queryParams.merchantName" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="采购商编码" prop="orgCode">
              <a-input v-model.number="queryParams.orgCode" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="创建时间" prop="time">
              <a-range-picker v-model="queryParams.time" @change="onChange_time" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col class="btn">
            <a-button
              class="reset"
              @click=";[$refs.ruleForm.resetFields(), (queryParams.startTime = ''), (queryParams.endTime = '')]"
            >
              重置
            </a-button>
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
          </a-col>
        </a-row>
      </a-form-model>
    </a-card>
    <a-card>
      <a-button class="card" type="primary" @click="add">新增</a-button>
      <s-table rowKey="id" ref="table" name="basicServiceListTable" :columns="columns" :data="getList">
        <template v-slot:createTime="createTime">
          <span>{{ createTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
        <template v-slot:action="action, item">
          <div>
            <a class="edit" @click="edit(item)">编辑</a>
            <a @click="deleteFn(item)">删除</a>
          </div>
        </template>
      </s-table>
    </a-card>
  </div>
</template>
<script>
import { queryList, purchaseDeployDelete } from '@/api/basicService'
export default {
  data() {
    return {
      queryParams: {},
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      columns: [
        {
          title: '采购商名称',
          dataIndex: 'merchantName',
          key: 'merchantName'
        },
        {
          title: '采购商编码',
          dataIndex: 'orgCode',
          key: 'orgCode'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '操作',
          key: 'action',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    onChange_time(val, [startTime, endTime]) {
      const vm = this
      vm.$set(vm.queryParams, 'startTime', startTime)
      vm.$set(vm.queryParams, 'endTime', endTime)
    },
    async getList(params) {
      const { queryParams } = this
      const result = await queryList({
        ...params,
        ...queryParams
      })
      return result
    },
    add() {
      this.$router.push({
        name: 'BasicServiceSet',
        params: {
          type: 'add',
          id: 0
        }
      })
    },
    edit({ id }) {
      this.$router.push({
        name: 'BasicServiceSet',
        params: {
          type: 'edit',
          id
        }
      })
    },
    async deleteFn({ id }) {
      const vm = this
      this.$confirm({
        title: '删除',
        content: '确认删除吗?',
        async onOk() {
          const { code } = await purchaseDeployDelete({ id })
          if (code === '0') {
            vm.$message.success('删除成功')
            vm.$refs.table.refresh(true)
          }
        },
        async onCancel() {}
      })
    }
  }
}
</script>
<style scoped lang="less">
.card {
  margin-bottom: 20px;
}
.btn {
  text-align: center;
  margin-top: 20px;
  .reset {
    margin-right: 10px;
  }
}
.edit {
  margin-right: 20px;
}
</style>

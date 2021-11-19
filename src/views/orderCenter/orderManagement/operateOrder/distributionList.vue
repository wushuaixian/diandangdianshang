<!--
 * @Author: your name
 * @Date: 2021-07-26 10:17:42
 * @LastEditTime: 2021-07-27 00:57:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/orderCenter/orderManagement/operateOrder/distributionList.vue
-->
<template>
  <div>
    <a-card>
      <a-form-model ref="ruleForm" :model="queryParams" layout="inline" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="8">
            <a-form-model-item has-feedback label="物流公司编号" prop="deliveryCompanyId">
              <a-input v-model="queryParams.deliveryCompanyId" autocomplete="off" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item has-feedback label="物流公司名称" prop="deliveryCompanyName">
              <a-input v-model="queryParams.deliveryCompanyName" autocomplete="off" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="销售商家" prop="merchantId" style="width: 100%">
              <d-select v-model="queryParams.merchantId" :options="merchantList"></d-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-col :md="24" :sm="24">
          <div class="btn">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button class="reset" @click="resetFrom">重置</a-button>
          </div>
        </a-col>
      </a-form-model>
    </a-card>
    <a-card class="list">
      <div class="list-btn">
        <a-button type="primary" @click="addFn">新增</a-button>
        <a-button type="primary" class="reset" @click="batchDelete">批量删除</a-button>
      </div>
      <s-table
        ref="distributionListTable"
        name="distributionListTable"
        rowKey="id"
        :data="getList"
        :columns="columns"
        :row-selection="rowSelection"
        :scroll="{ x: 500 }"
      >
        <template v-slot:action="action">
          <a @click="editFn(action)">编辑</a>
          <a @click="deleteItem(action)" class="debtn">删除</a>
        </template>
      </s-table>
    </a-card>
    <addDistribution
      v-if="visible"
      :visible.sync="visible"
      :edit.sync="edit"
      :params.sync="params"
      @ok="search"
    ></addDistribution>
  </div>
</template>
<script>
import { queryRoleManagementInfo } from '@/api/roleManagement'
import { merchantExpressConfigListPage, merchantExpressConfigDelete } from '@/api/orderCenter'
import addDistribution from './components/addDistribution.vue'
export default {
  components: {
    addDistribution
  },
  data() {
    return {
      queryParams: {},
      merchantList: [],
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      visible: false,
      edit: false,
      params: null,
      selectRowKeys: [],
      rowSelection: {
        onChange: (selectRowKeys, selectRows) => {
          this.selectRowKeys = selectRowKeys
        }
      },
      columns: [
        {
          title: '物流公司名称',
          dataIndex: 'deliveryCompanyName',
          key: 'deliveryCompanyName',
          width: 200
        },
        {
          title: '物流公司编号',
          dataIndex: 'deliveryCompanyId',
          key: 'deliveryCompanyId',
          width: 200
        },
        {
          title: '销售商家',
          dataIndex: 'merchantName',
          key: 'merchantName',
          width: 200
        },
        {
          title: '状态',
          dataIndex: 'isAvailable',
          key: 'isAvailable',
          width: 200,
          customRender: (value) => {
            if (value === 1) {
              return '启用'
            } else {
              return '停用'
            }
          }
        },
        {
          title: '联系电话',
          dataIndex: 'phone',
          key: 'phone',
          width: 200
        },
        {
          title: '配送商来源',
          dataIndex: 'type',
          key: 'type',
          width: 200,
          customRender: (value) => {
            if (value === 1) {
              return '平台配送商'
            } else if (value === 2) {
              return '非平台配送商'
            }
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  mounted() {
    this.getQueryRoleManagementInfo()
  },
  methods: {
    async getQueryRoleManagementInfo() {
      const result = await queryRoleManagementInfo({
        departmentType: null
      })
      this.merchantList = result.data.map((item) => {
        item.value = item.orgId
        item.label = item.enterpriseName
        return item
      })
    },
    resetFrom() {
      this.$refs.ruleForm.resetFields()
    },
    async getList(params) {
      const { queryParams } = this
      const result = await merchantExpressConfigListPage({
        filters: { ...queryParams },
        limit: params.itemsPerPage,
        page: params.currentPage
      })
      return result
    },
    async deleteItem({ id }) {
      const vm = this
      this.$confirm({
        title: '提示',
        content: '确认删除吗',
        onOk: async () => {
          const result = await merchantExpressConfigDelete([id])
          if (result.code === '0') {
            vm.$message.success('删除成功')
            vm.search()
          }
        },
        onCancel() {}
      })
    },
    async batchDelete() {
      const { selectRowKeys } = this
      if (selectRowKeys.length === 0) {
        this.$message.warning('请选择物流公司信息')
        return false
      }
      const vm = this
      this.$confirm({
        title: '提示',
        content: '确认删除吗',
        onOk: async () => {
          const result = await merchantExpressConfigDelete(selectRowKeys)
          if (result.code === '0') {
            vm.$message.success(result.message || '删除成功')
            vm.search()
          }
        },
        onCancel() {}
      })
    },
    editFn(item) {
      this.visible = true
      this.edit = true
      this.params = item
    },
    addFn() {
      this.visible = true
    },
    search() {
      this.$refs.distributionListTable.refresh(true)
    }
  }
}
</script>
<style scoped lang="less">
.reset {
  margin-left: 20px;
}
.btn {
  text-align: center;
  margin-top: 20px;
}
.list {
  margin-top: 20px;
  .list-btn {
    margin-bottom: 20px;
  }
}
.debtn {
  margin-left: 20px;
}
</style>

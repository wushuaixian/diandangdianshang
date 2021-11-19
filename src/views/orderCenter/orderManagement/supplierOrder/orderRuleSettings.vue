<!--
 * @Author: your name
 * @Date: 2021-07-30 16:08:07
 * @LastEditTime: 2021-08-02 11:38:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/orderCenter/orderManagement/supplierOrder/orderRuleSettings.vue
-->
<template>
  <div>
    <!-- 搜索  start-->
    <a-card>
      <search @search="search"></search>
    </a-card>
    <!-- 搜索   end-->
    <a-card style="margin-top: 20px">
      <a-button class="btn" type="primary" @click="add">新增</a-button>
      <a-button @click="moreIsDisable">批量停用</a-button>
      <s-table
        ref="orderRuleSettingTable"
        name="orderRuleSettingTable"
        rowKey="id"
        :data="getSoApproveRuleListPage"
        :columns="columns"
        :row-selection="rowSelection"
        :scroll="{ x: 300 }"
      >
        <template v-slot:active="active">
          <a class="edit" @click="edit(active)">编辑</a>
          <a @click="deleteFn(active)">删除</a>
        </template>
      </s-table>
    </a-card>
  </div>
</template>
<script>
import { soApproveRuleListPage, soApproveRuleDelete, soApproveRuleBatchDisable } from '@/api/orderCenter'
import search from './components/orderRuleSettingsComponents/search'
export default {
  components: {
    search
  },
  data() {
    return {
      queryPrams: {},
      columns: [
        {
          title: '规则编码',
          dataIndex: 'code',
          width: 300,
          key: 'code'
        },
        {
          title: '规则名称',
          dataIndex: 'name',
          key: 'name',
          width: 200
        },
        {
          title: '规则适用商家',
          dataIndex: 'merchantName',
          key: 'merchantName',
          width: 200
        },
        {
          title: '审核原因',
          dataIndex: 'reason',
          key: 'reason',
          width: 200,
          customRender: (value) => {
            if (value === '1') {
              return '订单有备注'
            } else if (value === '2') {
              return '价格与套价不服'
            } else if (value === '3') {
              return '有过人工改价'
            } else if (value === '4') {
              return '其他'
            }
          }
        },
        {
          title: '状态',
          dataIndex: 'isDisable',
          key: 'isDisable',
          width: 200,
          customRender: (value) => {
            if (value === 0) {
              return '启用'
            } else {
              return '停用'
            }
          }
        },
        {
          title: '操作',
          key: 'active',
          width: 150,
          fixed: 'right',
          scopedSlots: { customRender: 'active' }
        }
      ],
      selectRowKeys: [],
      selectRows: [],
      rowSelection: {
        onChange: (selectRowKeys, selectRows) => {
          this.selectRowKeys = selectRowKeys
          this.selectRows = selectRows
        }
      }
    }
  },
  methods: {
    async getSoApproveRuleListPage(params) {
      const { queryPrams } = this

      const result = await soApproveRuleListPage({
        filters: { ...queryPrams },
        limit: params.itemsPerPage,
        page: params.currentPage
      })
      const res = {
        data: {
          listObj: result.data,
          total: result.total
        }
      }
      return res
    },
    search(params) {
      this.queryPrams = params
      this.$refs.orderRuleSettingTable.refresh(true)
    },
    add() {
      this.$router.push({
        name: 'OrderRuleSettingsDetail'
      })
    },
    edit({ id }) {
      this.$router.push({
        name: 'OrderRuleSettingsDetail',
        query: {
          id
        }
      })
    },
    async deleteFn({ id }) {
      const vm = this
      this.$confirm({
        title: '提示',
        content: '确定要删除吗?',
        async onOk() {
          const result = await soApproveRuleDelete({
            id
          })
          if (result.code === '0') {
            vm.$message.success('删除成功')
            vm.$refs.orderRuleSettingTable.refresh(true)
          }
        },
        async onCancel() {}
      })
    },
    moreIsDisable() {
      const { selectRows, selectRowKeys } = this
      const vm = this
      if (selectRowKeys.length === 0) {
        this.$message.warning('请选择配置')
        return false
      }
      if (
        selectRows.some((item) => {
          return item.isDisable === 1
        })
      ) {
        this.$message.warning('无法停用已被停用数据')
        return false
      }
      this.$confirm({
        title: '提示',
        content: '确定要停用吗?',
        async onOk() {
          const result = await soApproveRuleBatchDisable(selectRowKeys)
          if (result.code === '0') {
            vm.$message.success('停用成功')
            vm.$refs.orderRuleSettingTable.refresh(true)
          }
        },
        async onCancel() {}
      })
    }
  }
}
</script>
<style scoped lang="less">
.btn {
  margin-right: 20px;
  margin-bottom: 20px;
}
.edit {
  margin-right: 20px;
}
</style>

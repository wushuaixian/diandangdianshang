<!--
 * @Author: your name
 * @Date: 2021-07-27 11:50:37
 * @LastEditTime: 2021-08-03 13:37:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/orderCenter/orderManagement/buyerOrder/paymentMethodSettings/index.vue
-->
<template>
  <div>
    <searchComponent @search="searchList"> </searchComponent>
    <a-card class="card">
      <a-button class="card-btn" type="primary" @click="goDetail"> 新增付款方式 </a-button>
      <s-table
        rowKey="id"
        ref="paymentMethodSettingsTable"
        name="paymentMethodSettingsTable"
        :data="getList"
        :scroll="{ x: 300 }"
        :columns="columns"
      >
        <template v-slot:expireTime="expireTime">
          <span>{{ expireTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
        <template v-slot:createTimeDb="createTimeDb">
          <span>{{ createTimeDb | moment('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
        <template v-slot:isAvailable="isAvailable, item">
          <a-switch :checked="isAvailable === 0 ? false : true" @change="changeIsAvailable(item)" />
        </template>
        <template v-slot:action="action, item">
          <a class="btn" @click="edit(item)">编辑</a>
          <a v-if="item.isAvailable === 0" @click="deleteFn(item)">删除</a>
        </template>
      </s-table>
    </a-card>
  </div>
</template>
<script>
import searchComponent from './components/searchComponent.vue'
import {
  merchantPaymentConfigListPage,
  deleteMerchantPaymentConfig,
  merchantPaymentConfigUpdateStatus
} from '@/api/orderCenter'
export default {
  components: {
    searchComponent
  },
  data() {
    return {
      queryParams: {},
      columns: [
        {
          title: '系统编号',
          dataIndex: 'id',
          width: 200,
          key: 'id'
        },
        {
          title: '付款名称',
          dataIndex: 'paymentName',
          width: 250,
          key: 'paymentName'
        },
        {
          title: '付款方式',
          dataIndex: 'paymentType',
          key: 'paymentType',
          width: 100,
          customRender: (record) => {
            if (record === 1) {
              return '账期'
            } else {
              return '分阶段'
            }
          }
        },
        {
          title: '支付方式',
          dataIndex: 'payType',
          key: 'payType',
          width: 100,
          customRender: (record) => {
            if (record === 1) {
              return '电汇'
            } else if (record === 2) {
              return '承兑汇票'
            } else {
              return '两者都是'
            }
          }
        },
        {
          title: '供应商名称',
          dataIndex: 'providerMerchantName',
          key: 'providerMerchantName',
          width: 200
        },
        {
          title: '合同编号',
          dataIndex: 'contractCode',
          width: 200,
          key: 'contractCode'
        },
        {
          title: '合同到期日',
          dataIndex: 'expireTime',
          key: 'expireTime',
          width: 200,
          scopedSlots: { customRender: 'expireTime' }
        },
        {
          title: '合同状态',
          dataIndex: 'status',
          key: 'status',
          width: 100,
          customRender: (record) => {
            // 0:草稿 1:供应商确认中 2:供应商已同意 3:供应商已驳回 4：采购方审批中 5：采购方审批驳回 6：已生效 7：已失效
            if (record === '0') {
              return '草稿'
            } else if (record === '1') {
              return '供应商确认中'
            } else if (record === '2') {
              return '供应商已同意'
            } else if (record === '3') {
              return '供应商已驳回'
            } else if (record === '4') {
              return '采购方审批中'
            } else if (record === '5') {
              return '采购方审批驳回'
            } else if (record === '6') {
              return '已生效'
            } else if (record === '7') {
              return '已失效'
            }
          }
        },
        {
          title: '启用状态',
          dataIndex: 'isAvailable',
          key: 'isAvailable',
          width: 200,
          scopedSlots: { customRender: 'isAvailable' }

          // customRender: (record) => {
          //   if (record === 0) {
          //     return '不可用'
          //   } else {
          //     return '可用'
          //   }
          // }
        },
        {
          title: '创建人',
          dataIndex: 'createUsername',
          key: 'createUsername',
          width: 200
        },
        {
          title: '创建时间',
          dataIndex: 'createTimeDb',
          key: 'createTimeDb',
          width: 200,
          scopedSlots: { customRender: 'createTimeDb' }
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    searchList(params) {
      this.queryParams = params
      this.$refs.paymentMethodSettingsTable.refresh(true)
    },
    async getList(params) {
      const { queryParams } = this
      const result = await merchantPaymentConfigListPage({
        ...queryParams,
        ...params
      })
      return result
    },
    deleteFn(item) {
      const { id } = item
      const vm = this
      this.$confirm({
        title: '提示',
        content: '确认删除选择的数据吗？',
        async onOk() {
          // vm.viewTasksVisible = true
          const res = await deleteMerchantPaymentConfig({
            id
          })
          if (res.code === '0') {
            vm.$message.success('删除成功')
            vm.$refs.paymentMethodSettingsTable.refresh(true)
          }
        },
        onCancel() {}
      })
    },
    async changeIsAvailable(item) {
      const { id, isAvailable, status } = item
      const vm = this
      if (isAvailable === 1 && status !== '7') {
        this.$confirm({
          title: '提示',
          content: '付款方式正在被使用，无法停用跳转至采购合同查看使用情况。',
          async onOk() {
            vm.$router.push({
              name: 'ContractPurchaseContractList'
            })
          },
          onCancel() {}
        })
      } else {
        const res = await merchantPaymentConfigUpdateStatus({
          id,
          isAvailable: !isAvailable ? 1 : 0
        })
        if (res.code === '0') {
          vm.$message.success('状态修改成功')
          vm.$refs.paymentMethodSettingsTable.refresh(true)
        }
      }
    },
    goDetail() {
      this.$router.push({
        name: 'PaymentMethodSettingsDetail'
      })
    },
    edit({ id }) {
      this.$router.push({
        name: 'PaymentMethodSettingsDetail',
        query: {
          id
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.card {
  margin-top: 20px;
}
.btn {
  margin-right: 10px;
}
.card-btn {
  margin-bottom: 20px;
}
</style>

<!--
 * @Author: your name
 * @Date: 2021-07-18 11:32:07
 * @LastEditTime: 2021-08-07 14:12:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/orderCenter/orderManagement/supplierOrder/orderApprovalList.vue
-->
<template>
  <div>
    <orderApprovalListSearch @ok="search"></orderApprovalListSearch>
    <a-card class="card">
      <a-tabs :default-active-key="1" @change="callback">
        <a-tab-pane :tab="item.statusText" v-for="item in orderApprovalList.orderApprovalStatus" :key="item.status">
        </a-tab-pane>
      </a-tabs>
      <s-table
        ref="orderApprovalListTable"
        name="orderApprovalListTable"
        rowKey="id"
        :data="getList"
        :scroll="{ x: 500 }"
        :columns="columns"
      >
        <template v-slot:orderCreateTime="orderCreateTime">
          {{ orderCreateTime | moment('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-slot:action="action, item">
          <a v-if="active === 1" @click="save(item)"> 审核</a>
        </template>
      </s-table>
    </a-card>
    <batchConfirmationModal
      ref="batchConfirmationModal"
      @ok="$refs.orderApprovalListTable.refresh(true)"
    ></batchConfirmationModal>
  </div>
</template>
<script>
import orderApprovalListSearch from './components/orderApprovalListComponents/orderApprovalListSearch'
import batchConfirmationModal from './components/orderDetailComponents/batchConfirmationModal'
import { orderApprovalList, orderDetail } from '@/config/orderStatus'
import { soAuditListPage } from '@/api/orderCenter'
export default {
  components: {
    orderApprovalListSearch,
    batchConfirmationModal
  },
  data() {
    return {
      orderApprovalList,
      columns: [
        {
          title: '订单编号',
          dataIndex: 'orderCode',
          key: 'orderCode',
          width: 200,
          customRender: (text, item) => {
            const { orderCode } = item
            return (
              <router-link to={{ name: 'SupplierOrderOrderDetailSourcing', query: { orderCode } }}>
                {orderCode}
              </router-link>
            )
          }
        },
        {
          title: '订单类型',
          dataIndex: 'orderType',
          key: 'orderType',
          width: 200,
          customRender: (record) => {
            const { orderTypeJson } = orderDetail
            return orderTypeJson[record]
          }
        },
        {
          title: '下单时间',
          dataIndex: 'orderCreateTime',
          key: 'orderCreateTime',
          width: 200,
          scopedSlots: { customRender: 'orderCreateTime' }
        },
        {
          title: '买家备注',
          dataIndex: 'orderRemarkUser',
          key: 'orderRemarkUser',
          width: 200
        },
        {
          title: '商家备注',
          dataIndex: 'orderRemarkMerchant2user',
          key: 'orderRemarkMerchant2user',
          width: 200
        },
        {
          title: '审核原因',
          dataIndex: 'reasonStr',
          key: 'reasonStr',
          width: 200
        },
        {
          title: '买家名称',
          dataIndex: 'userName',
          key: 'userName',
          width: 200
        },
        // {
        //   title: '收货信息',
        //   dataIndex: 'notifyEmails',
        //   key: 'notifyEmails',
        //   width: 200
        // },
        {
          title: '订单总金额(元)',
          dataIndex: 'orderAmount',
          key: 'orderAmount',
          width: 200
        },
        {
          title: '审核状态',
          dataIndex: 'statusStr',
          key: 'statusStr',
          width: 200
        },
        {
          title: '审核时间',
          dataIndex: 'auditTime',
          key: 'auditTime',
          width: 200
        },
        {
          title: '审核备注内容',
          dataIndex: 'remark',
          key: 'remark',
          width: 200
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      queryParams: {},
      active: 1
    }
  },
  methods: {
    search(params) {
      this.queryParams = params
      this.$refs.orderApprovalListTable.refresh(true)
    },
    async getList(params) {
      const { queryParams, active } = this
      const result = await soAuditListPage({
        filters: { ...queryParams, status: active },
        limit: params.itemsPerPage,
        page: params.currentPage
      })
      const res = {
        data: {
          listObj: result.data,
          total: result.total
        }
      }
      return new Promise((resolve, reject) => {
        resolve(res)
      })
    },
    save(item) {
      this.$refs.batchConfirmationModal.init([item.id], 'review')
    },
    callback(e) {
      this.active = e
      this.$refs.orderApprovalListTable.refresh(true)
    }
  }
}
</script>
<style scoped lang="less">
.card {
  margin-top: 20px;
}
</style>

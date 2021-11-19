
<template>
  <div class="appeal-manage-list">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="from">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="采购商名称" prop="isFree">
                <a-radio-group v-model="from.isFree">
                  <a-radio :value="1"> 免保证金 </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card>
      <div class="add_button">
        <div>采购商：</div>
        <a-button type="primary" @click="visibleLog = true">新增</a-button>
      </div>
      <s-table
        :scroll="{ y: 300 }"
        :customPage="true"
        :list="dataList"
        rowKey="id"
        ref="table"
        :columns="columns"
        name="daysDepositRefund"
      >
        <template slot="authStatus" slot-scope="text, record">
          <span v-if="record.authStatus === 0">待认证</span>
          <span v-if="record.authStatus === 1">验厂中</span>
          <span v-if="record.authStatus === 2">认证中/待审核</span>
          <span v-if="record.authStatus === 3">认证通过/审核通过</span>
          <span v-if="record.authStatus === 4">认证不通过/审核拒绝</span>
        </template>
        <template slot="options" slot-scope="text, record">
          <a @click="Delete(record.id)">删除</a>
        </template>
      </s-table>
      <div style="margin-top: 15px; text-align: center">
        <a-button type="primary" @click="Save">保存</a-button>
        <a-button style="margin-left: 15px" @click="Ravert">返回</a-button>
      </div>
    </a-card>

    <div></div>
    <a-modal title="删除" :visible="visibleDelete" @cancel="visibleDelete = false" @ok="handleDelete">
      <div style="text-align: center">确认删除当前数据？</div>
    </a-modal>

    <!-- 采购商列表  start-->
    <a-modal title="采购商列表" :width="1100" :visible="visibleLog" @cancel="cancel" @ok="handle">
      <a-card :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
            <a-row :gutter="48">
              <a-col :md="12" :sm="24">
                <a-form-model-item label="采购商名称" prop="enterpriseName">
                  <a-input v-model="queryParam.enterpriseName" placeholder="请输入" />
                </a-form-model-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-model-item label="采购商编码" prop="orgCode">
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
      <s-table
        :scroll="{ y: 480 }"
        :row-selection="rowSelection"
        rowKey="id"
        ref="table"
        :columns="columnsList"
        name="daysDepositRefund"
        :data="getPurchaserList"
      >
        <template slot="options" slot-scope="text, record">
          <a @click="Delete(record.id)">删除</a>
        </template>
        <template slot="authStatus" slot-scope="text, record">
          <span v-if="record.authStatus === 0">待认证</span>
          <span v-if="record.authStatus === 1">验厂中</span>
          <span v-if="record.authStatus === 2">认证中/待审核</span>
          <span v-if="record.authStatus === 3">认证通过/审核通过</span>
          <span v-if="record.authStatus === 4">认证不通过/审核拒绝</span>
        </template>
      </s-table>
    </a-modal>
    <!-- 采购商列表  ent -->
  </div>
</template>

<script>
import { postAddPurchaseFreeDeposit, postMerchantOrgInfoOrgPage } from '@/api/cautionMoney'

export default {
  data() {
    return {
      from: {
        isFree: 1
      },
      selectedRows: [],
      dataList: [],
      id: '',
      visibleLog: false,
      visibleDelete: false,
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '待处理',
          value: '0'
        },
        {
          label: '已处理',
          value: '1'
        },
        {
          label: '驳回',
          value: '2'
        }
      ],
      columns: [
        {
          title: '采购商名称',
          dataIndex: 'enterpriseName',
          key: 'enterpriseName'
        },
        {
          title: '采购商编码',
          dataIndex: 'orgCode',
          key: 'orgCode'
        },
        {
          title: '采购商状态',
          dataIndex: 'authStatus',
          key: 'authStatus',
          scopedSlots: { customRender: 'authStatus' }
        },
        {
          title: '操作',
          dataIndex: 'options',
          key: 'options',
          scopedSlots: { customRender: 'options' }
        }
      ],
      columnsList: [
        {
          title: '采购商名称',
          dataIndex: 'enterpriseName',
          key: 'enterpriseName'
        },
        {
          title: '采购商编码',
          dataIndex: 'orgCode',
          key: 'orgCode'
        },
        {
          title: '采购商状态',
          dataIndex: 'authStatus',
          key: 'authStatus',
          scopedSlots: { customRender: 'authStatus' }
        }
      ],
      queryParam: {
        orgCode: null,
        enterpriseName: null
      }
    }
  },
  computed: {
    rowSelection() {
      const that = this
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          that.selectedRows = selectedRows
        }
      }
    }
  },
  methods: {
    Save() {
      if (this.dataList.length > 0) {
        const merchantIds = []
        this.dataList.forEach((res) => {
          merchantIds.push(res.id)
        })
        const params = {
          merchantIds,
          isFree: this.from.isFree
        }
        postAddPurchaseFreeDeposit(params).then((res) => {
          if (res.code === '0') {
            this.$message.success(res.message)
            this.$router.push({ name: 'BuyerSecurityDeposit' })
          }
        })
      } else {
        this.$message.error('请先添加采购商')
      }
    },
    Ravert() {
      this.$router.go(-1)
    },
    Delete(id) {
      this.id = id
      this.visibleDelete = true
    },
    handleDelete() {
      const dataList = [...this.dataList]
      this.dataList = dataList.filter((item) => item.id !== this.id)
      this.visibleDelete = false
    },
    // 获取列表
    async getPurchaserList(pagination) {
      const { queryParam } = this
      const data = {
        ...pagination,
        ...queryParam,
        isPurchasers: '1'
      }

      return postMerchantOrgInfoOrgPage({ ...data })
    },
    handleReset() {
      this.$refs.ruleForm.resetFields()
    },
    // 查询
    search() {
      this.$refs.table.refresh(true)
    },
    // 查看日志
    Check() {
      this.visibleLog = true
      this.handleReset()
    },
    // 关闭日志
    handle() {
      this.visibleLog = false
      this.dataList = this.selectedRows
      this.handleReset()
    },
    cancel() {
      this.visibleLog = false
    }
  }
}
</script>

<style lang="less" scoped>
.button {
  text-align: center;
}
.add_button {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
</style>
